# 启动画面主题包制作指南

本文档旨在帮助开发者和设计师为 Luminalium 软件制作自定义的启动画面（Splash）。

## 目录结构

所有用户自定义的资源包都应存放在软件根目录下的 `user` 文件夹中。如果该文件夹不存在，请手动创建。

```text
Luminalium/
├── main.py
├── ...
└── user/
    ├── splash/
    │   └── your_splash_id/
    │       ├── manifest.json
    │       ├── preview.png
    │       └── splash.py
    └── themes/
        └── your_theme_id/
            ├── manifest.json
            ├── preview.png
            └── index.html
```

---

## Splash 包制作 (启动画面)

Splash 包用于自定义软件启动时的加载画面。

### 文件结构

一个合法的 Splash 包必须包含以下文件：

- **manifest.json**: 描述文件。
- **preview.png** (或 .jpg): 预览图，用于在设置界面显示。
- **splash.py**: Python 脚本，包含构建 UI 的逻辑。

### manifest.json

```json
{
    "name": "your_splash_id",
    "version": "1.0.0",
    "author": "Your Name",
    "description": "A cool splash screen."
}
```

**注意**: `name` 字段必须与文件夹名称一致。

### splash.py 详解

`splash.py` 必须包含一个 `apply(splash_widget)` 函数。该函数接收一个 `StartupSplash` 实例（继承自 `QWidget`），你可以在这个 Widget 上构建你的界面。

**主要对象**:

- `splash_widget`: 这是你的画布。它默认是无边框、背景透明的窗口。
- `splash_widget._container`: 建议在这个 `QFrame` 上添加你的控件。

**可用数据**:

- `splash_widget._version_text`: 版本号文本 (如 "v1.2.3")。
- `splash_widget._status_text`: 当前加载状态文本 (如 "正在初始化 20%")。
- `splash_widget._progress_value`: 当前加载进度 (0-100)。

### 示例代码

```python
from PySide6.QtWidgets import QLabel
from PySide6.QtCore import Qt
from PySide6.QtGui import QFont

def apply(splash):
    # 设置窗口大小
    splash.resize(600, 300)
    
    # 设置容器样式 (背景色、圆角等)
    splash._container.setStyleSheet('''
        QFrame {
            background-color: #ffffff;
            border-radius: 12px;
            border: 1px solid #e0e0e0;
        }
    ''')
    
    # 添加标题
    title = QLabel("My Custom Splash", splash._container)
    title.move(50, 50)
    title.setFont(QFont("Microsoft YaHei", 24, QFont.Bold))
    
    # 简单的自定义状态显示
    status_label = QLabel(splash._container)
    status_label.move(50, 150)
    status_label.resize(500, 30)
    
    original_set_progress = splash.set_progress
    
    def custom_set_progress(value, text_key="initializing"):
        # 调用原始逻辑以确保后台状态正确（可选）
        # original_set_progress(value, text_key)
        
        status_label.setText(f"{text_key} ... {value}%")
        splash.update()  # 强制重绘
    
    splash.set_progress = custom_set_progress
```

---

## 开发建议

- 使用标准字体和简洁布局，确保启动画面在不同分辨率下都能正常显示。
- 如果你的界面包含动画效果，尽量保持启动过程流畅，避免阻塞主线程。
- 使用 `preview.png` 展示最具代表性的视觉效果，以便用户在设置界面中快速预览。
---

## 2. Theme 包制作 (覆盖层主题)

Theme 包定义了 PPT 放映时的覆盖层 UI。它本质上是一个透明背景的网页。

### 2.1 文件结构

- **manifest.json**: 描述文件。
- **preview.png** (或 .jpg): 预览图。
- **index.html**: 主入口文件。

### 2.2 manifest.json

```json
{
    "name": "your_theme_id",
    "version": "1.0.0",
    "author": "Your Name"
}
```

**注意**: `name` 字段必须与文件夹名称一致。

### 2.3 index.html 开发指南

你的 HTML 文件将在 `QWebEngineView` 中运行。背景必须是透明的，以便显示下方的 PPT。

#### 2.3.1 关键 CSS 类

- **`.interactive`**: **非常重要！** 只有带有此类名的元素（及其子元素）才能接收鼠标点击。其他区域将是“穿透”的，鼠标事件会传递给 PPT。务必确保你的按钮、工具栏、弹窗都包含此类名。
- 你可以通过 JS 动态计算并发送 Mask 更新，但使用 `.interactive` 类并配合官方提供的脚本是最简单的方法。

#### 2.3.2 与后端通信 (QWebChannel)

你需要在 HTML 中引入 `qwebchannel.js` 并建立连接。

```html
<script src="qwebchannel.js"></script>
<script>
let bridge = null;
new QWebChannel(qt.webChannelTransport, function(channel) {
    bridge = channel.objects.bridge;
    bridge.requestInitState(); // 请求初始化状态
});
</script>
```

#### 2.3.3 接收数据 (后端 -> 前端)

你需要在 `window` 对象上定义以下函数，后端会自动调用它们：

- **`updateConfig(config)`**: 当配置变更时调用。`config.scale`: UI 缩放比例 (float)。
- `config.safeArea`: 安全区域边距 (int)。
- `config.toolbarPosition`: 'bottom' | 'top' | 'left' | 'right'.
- `config.showStatusBar`: 是否显示状态栏 (bool)。
- `config.toolbarOrder`: 工具栏按钮顺序 (Array).
- `config.disabledTools`: 被禁用的工具列表 (Array).
- `config.compatibilityMode`: 兼容模式 (bool).

- **`updatePageInfo(current, total)`**: 更新页码信息。
- **`toggleStatusBar(visible)`**: 显示/隐藏状态栏。
- **`setTheme(isDark, accentColor, themeId)`**: 设置主题颜色模式。
- **`updateSystemStatus(data)`**: 更新系统状态（电量、网络等）。`data` 包含 `battery_percent`, `network_online`, `volume`, `smtc_status` 等。

- **`updatePageThumbnail(index, url)`**: 接收缩略图数据（Base64 URL）。
- **`showInkPrompt()` / `hideInkPrompt()`**: 显示/隐藏“保留墨迹”对话框。

#### 2.3.4 发送指令 (前端 -> 后端)

通过 `bridge` 对象调用后端功能：

- **导航**:`bridge.prevPage()`: 上一页。
- `bridge.nextPage()`: 下一页。
- `bridge.gotoSlide(pageIndex)`: 跳转到指定页。
- `bridge.endShow()`: 结束放映。

- **工具**:`bridge.setTool(toolName)`: 切换工具 ('arrow', 'pen', 'eraser')。
- `bridge.setPenColor(r, g, b)`: 设置画笔颜色。
- `bridge.clearScreen()`: 清除墨迹。
- `bridge.toggleSpotlight()`: 开关聚光灯。
- `bridge.toggleBoard()`: 开关白板。
- `bridge.toggleTimer()`: 开关计时器。
- `bridge.launchApp(path)`: 启动外部应用。

- **系统**:`bridge.inkPromptResult(keep)`: 用户选择是否保留墨迹 (bool)。
- `bridge.updateMask(rects)`: 手动更新点击穿透区域（通常不需要手动调用，见下文）。
- `bridge.resizeNudge()`: 通知后端 UI 大小已变更（用于刷新 Mask）。
- `bridge.requestThumbnail(index)`: 请求某页的缩略图。

#### 2.3.5 点击穿透 (Mask) 机制

为了让非 UI 区域能穿透点击，你需要告诉后端哪些区域是“实体”的。 推荐做法是在你的 JS 中实现 `sendMaskUpdate` 函数，并在 UI 变化时调用它。

```js
function sendMaskUpdate() {
    if (!bridge) return;
    requestAnimationFrame(() => {
        const rects = [];
        document.querySelectorAll('.interactive').forEach(el => {
            const r = el.getBoundingClientRect();
            if (r.width === 0 || r.height === 0) return;
            rects.push({
                x: r.x, y: r.y, width: r.width, height: r.height
            });
        });
        bridge.updateMask(rects);
    });
}

const observer = new ResizeObserver(() => sendMaskUpdate());
document.querySelectorAll('.interactive').forEach(el => observer.observe(el));
```

### 2.4 开发建议

1. **使用 CSS 变量**: 参考默认主题，使用 CSS 变量来适配深色/浅色模式。
2. **响应式布局**: 考虑 `config.toolbarPosition`，你的 UI 应该能适应工具栏在不同位置的情况。
3. **调试**: 你可以在浏览器中直接打开 `index.html` 进行 UI 调试，但与 `bridge` 相关的功能将无法工作。可以 Mock 一个 `bridge` 对象来测试交互。

祝你开发愉快！