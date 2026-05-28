# 覆盖层主题包制作指南

本页介绍如何为 Luminalium 制作自定义覆盖层主题（Theme）。覆盖层主题本质上是一个运行在 `QWebEngineView` 中的透明网页。

## Theme 包制作 (覆盖层主题)

Theme 包定义了 PPT 放映时的覆盖层 UI，它允许你在演示过程中提供工具栏、状态栏、页面信息、按钮和交互控件。

### 文件结构

一个合法的 Theme 包必须包含以下文件：

- **manifest.json**: 描述文件。
- **preview.png** (或 .jpg): 预览图。
- **index.html**: 主入口文件。

### manifest.json

```json
{
    "name": "your_theme_id",
    "version": "1.0.0",
    "author": "Your Name"
}
```

**注意**: `name` 字段必须与文件夹名称一致。

### index.html 开发指南

你的 HTML 文件将在 `QWebEngineView` 中运行。背景必须是透明的，以便显示下方的 PPT。

#### 关键 CSS 类

- **`.interactive`**: **非常重要！** 只有带有此类名的元素（及其子元素）才能接收鼠标点击。其他区域将是“穿透”的，鼠标事件会传递给 PPT。
- 请确保按钮、工具栏、弹窗等可交互区域都包含 `.interactive` 类。
- 你可以使用 JavaScript 动态计算并发送 Mask 更新，但 `.interactive` 类通常已经足够让官方遮罩机制识别可点击区域。

#### 与后端通信 (QWebChannel)

在 HTML 中引入 `qwebchannel.js` 并建立连接：

```html
<script src="qwebchannel.js"></script>
<script>
let bridge = null;
new QWebChannel(qt.webChannelTransport, function(channel) {
    bridge = channel.objects.bridge;
    bridge.requestInitState();
});
</script>
```

#### 接收数据 (后端 -> 前端)

请在 `window` 对象上定义以下函数，后端会自动调用它们：

- `updateConfig(config)`：当配置变更时调用。
  - `config.scale`: UI 缩放比例 (float)
  - `config.safeArea`: 安全区域边距 (int)
  - `config.toolbarPosition`: 'bottom' | 'top' | 'left' | 'right'
  - `config.showStatusBar`: 是否显示状态栏 (bool)
  - `config.toolbarOrder`: 工具栏按钮顺序 (Array)
  - `config.disabledTools`: 被禁用的工具列表 (Array)
  - `config.compatibilityMode`: 兼容模式 (bool)
- `updatePageInfo(current, total)`：更新页码信息。
- `toggleStatusBar(visible)`：显示/隐藏状态栏。
- `setTheme(isDark, accentColor, themeId)`：设置主题颜色模式。
- `updateSystemStatus(data)`：更新系统状态，`data` 包含 `battery_percent`, `network_online`, `volume`, `smtc_status` 等。
- `updatePageThumbnail(index, url)`：接收缩略图数据（Base64 URL）。
- `showInkPrompt()` / `hideInkPrompt()`：显示/隐藏“保留墨迹”对话框。

#### 发送指令 (前端 -> 后端)

通过 `bridge` 对象调用后端功能：

- **导航**：
  - `bridge.prevPage()`：上一页。
  - `bridge.nextPage()`：下一页。
  - `bridge.gotoSlide(pageIndex)`：跳转到指定页。
  - `bridge.endShow()`：结束放映。
- **工具**：
  - `bridge.setTool(toolName)`：切换工具 ('arrow', 'pen', 'eraser')。
  - `bridge.setPenColor(r, g, b)`：设置画笔颜色。
  - `bridge.clearScreen()`：清除墨迹。
  - `bridge.toggleSpotlight()`：开关聚光灯。
  - `bridge.toggleBoard()`：开关白板。
  - `bridge.toggleTimer()`：开关计时器。
  - `bridge.launchApp(path)`：启动外部应用。
- **系统**：
  - `bridge.inkPromptResult(keep)`：用户选择是否保留墨迹 (bool)。
  - `bridge.updateMask(rects)`：手动更新点击穿透区域（通常不需要手动调用）。
  - `bridge.resizeNudge()`：通知后端 UI 大小已变更（用于刷新 Mask）。
  - `bridge.requestThumbnail(index)`：请求某页的缩略图。

#### 点击穿透 (Mask) 机制

为了让非 UI 区域能够穿透点击，你需要告诉后端哪些区域是真正的交互区域。建议实现 `sendMaskUpdate` 并在 UI 变化时调用它。

```js
function sendMaskUpdate() {
    if (!bridge) return;
    requestAnimationFrame(() => {
        const rects = [];
        document.querySelectorAll('.interactive').forEach(el => {
            const r = el.getBoundingClientRect();
            if (r.width === 0 || r.height === 0) return;
            rects.push({
                x: r.x,
                y: r.y,
                width: r.width,
                height: r.height
            });
        });
        bridge.updateMask(rects);
    });
}

const observer = new ResizeObserver(() => sendMaskUpdate());
document.querySelectorAll('.interactive').forEach(el => observer.observe(el));
```

### 开发建议

1. **使用 CSS 变量**：参考默认主题，使用 CSS 变量适配深色／浅色模式。
2. **响应式布局**：考虑 `config.toolbarPosition`，UI 应该能适应工具栏在不同位置的情形。
3. **调试**：可以在浏览器中直接打开 `index.html` 进行 UI 调试，但与 `bridge` 相关的功能无法工作。建议 Mock 一个 `bridge` 对象来测试交互。

祝你开发愉快！