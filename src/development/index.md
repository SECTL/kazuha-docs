# Luminalium 主题与 Splash 包制作指南

本文档旨在帮助开发者和设计师为 Luminalium 软件制作自定义的启动画面（Splash）和覆盖层主题（Theme）。

## 目录结构

所有用户自定义的资源包都应存放在软件根目录下的 `user` 文件夹中。如果该文件夹不存在，请手动创建。

```
Luminalium/
├── main.py
├── ...
└── user/
    ├── splash/
    │   └── &lt;your_splash_id&gt;/
    │       ├── manifest.json
    │       ├── preview.png
    │       └── splash.py
    └── themes/
        └── &lt;your_theme_id&gt;/
            ├── manifest.json
            ├── preview.png
            └── index.html
```

---

## 1. Splash 包制作 (启动画面)

Splash 包用于自定义软件启动时的加载画面。

### 1.1 文件结构

一个合法的 Splash 包必須包含以下文件：

*   **manifest.json**: 描述文件。
*   **preview.png** (或 .jpg): 预览图，用于在设置界面显示。
*   **splash.py**: Python 脚本，包含构建 UI 的逻辑。

### 1.2 manifest.json

```json
{
    "name": "your_splash_id",
    "version": "1.0.0",
    "author": "Your Name",
    "description": "A cool splash screen."
}
```
**注意**: `name` 字段必須与文件夹名稱一致。

### 1.3 splash.py 详解

`splash.py` 必須包含一个 `apply(splash_widget)` 函数。该函数接收一个 `StartupSplash` 实例（繼承自 `QWidget`），你可以在這个 Widget 上构建你的界面。

**主要对象**:
*   `splash_widget`: 這是你的画布。它默认是无边框、背景透明的窗口。
*   `splash_widget._container`: 建議在這个 QFrame 上添加你的控件。

**可用数据**:
*   `splash_widget._version_text`: 版本號文本 (如 "v1.2.3")。
*   `splash_widget._status_text`: 当前加载状态文本 (如 "正在初始化 20%")。
*   `splash_widget._progress_value`: 当前加载进度 (0-100)。

**示例代碼**:

```python
from PySide6.QtWidgets import QLabel, QProgressBar
from PySide6.QtCore import Qt
from PySide6.QtGui import QFont

def apply(splash):
    // 设置窗口大小
    splash.resize(600, 300)
    
    // 设置容器樣式 (背景色、圓角等)
    splash._container.setStyleSheet("""
        QFrame {
            background-color: #ffffff;
            border-radius: 12px;
            border: 1px solid #e0e0e0;
        }
    """)
    
    // 添加标题
    title = QLabel("My Custom Splash", splash._container)
    title.move(50, 50)
    title.setFont(QFont("Microsoft YaHei", 24, QFont.Bold))
    
    // 添加进度條 (如果需要自定义更新逻辑，可以綁定到 splash 的 update 方法，或者使用定时器)
    // 注意：默认的进度更新會尝试调用 splash._progress 和 splash._percent_label
    // 如果你完全重寫了 UI，你可能需要 Monkey Patch splash.set_progress 方法
    
    // 简单的自定义进度显示示例：
    original_set_progress = splash.set_progress
    
    status_label = QLabel(splash._container)
    status_label.move(50, 150)
    status_label.resize(500, 30)
    
    def custom_set_progress(value, text_key="initializing"):
        # 调用原始逻辑以確保后台状态正確 (可选)
        # original_set_progress(value, text_key)
        
        # 更新你的 UI
        status_label.setText(f"{text_key} ... {value}%")
        splash.update() # 強制重繪
        
    // 覆盖实例方法
    splash.set_progress = custom_set_progress
```

---

## 2. Theme 包制作 (覆盖层主题)

Theme 包定义了 PPT 放映时的覆盖层 UI。它本質上是一个透明背景的網頁。

### 2.1 文件结构

*   **manifest.json**: 描述文件。
*   **preview.png** (或 .jpg): 预览图。
*   **index.html**: 主入口文件。

### 2.2 manifest.json

```json
{
    "name": "your_theme_id",
    "version": "1.0.0",
    "author": "Your Name"
}
```
**注意**: `name` 字段必須与文件夹名稱一致。

### 2.3 index.html 开发指南

你的 HTML 文件將在 `QWebEngineView` 中运行。背景必須是透明的，以便显示下方的 PPT。

#### 2.3.1 关键 CSS 类

*   **`.interactive`**: **非常重要！** 只有帶有此类名的元素（及其子元素）才能接收鼠标點擊。其他区域將是“穿透”的，鼠标事件會傳遞给 PPT。
    *   务必確保你的按鈕、工具欄、彈窗都包含此类名。
    *   你可以通过 JS 动态計算并发送 Mask 更新，但使用 `.interactive` 类并配合官方提供的脚本是最简单的方法。

#### 2.3.2 与后端通信 (QWebChannel)

你需要在 HTML 中引入 `qwebchannel.js` 并建立連接。

```html
&lt;script src="qrc:///qtwebchannel/qwebchannel.js">&lt;/script&gt;
&lt;script&gt;
    let bridge = null;
    new QWebChannel(qt.webChannelTransport, function(channel) {
        bridge = channel.objects.bridge;
        bridge.requestInitState(); // 请求初始化状态
    });
&lt;/script&gt;
```

#### 2.3.3 接收数据 (后端 -> 前端)

你需要在 `window` 对象上定义以下函数，后端會自动调用它們：

*   **`updateConfig(config)`**: 当配置变更时调用。
    *   `config.scale`: UI 缩放比例 (float).
    *   `config.safeArea`: 安全区域边距 (int).
    *   `config.toolbarPosition`: 'bottom' | 'top' | 'left' | 'right'.
    *   `config.showStatusBar`: 是否显示状态欄 (bool).
    *   `config.toolbarOrder`: 工具欄按鈕順序 (Array&lt;string&gt;).
    *   `config.disabledTools`: 被禁用的工具列表 (Array&lt;string&gt;).
    *   `config.compatibilityMode`: 兼容模式 (bool).
*   **`updatePageInfo(current, total)`**: 更新頁碼信息。
*   **`toggleStatusBar(visible)`**: 显示/隐藏状态欄。
*   **`setTheme(isDark, accentColor, themeId)`**: 设置主题顏色模式。
*   **`updateSystemStatus(data)`**: 更新系統状态（電量、網絡等）。
    *   `data` 包含 `battery_percent`, `network_online`, `volume`, `smtc_status` 等。
*   **`updatePageThumbnail(index, url)`**: 接收縮略图数据（Base64 URL）。
*   **`showInkPrompt()` / `hideInkPrompt()`**: 显示/隐藏“保留墨跡”对话框。

#### 2.3.4 发送指令 (前端 -> 后端)

通过 `bridge` 对象调用后端功能：

*   **导航**:
    *   `bridge.prevPage()`: 上一頁。
    *   `bridge.nextPage()`: 下一頁。
    *   `bridge.gotoSlide(pageIndex)`: 跳轉到指定頁。
    *   `bridge.endShow()`: 结束放映。
*   **工具**:
    *   `bridge.setTool(toolName)`: 切換工具 ('arrow', 'pen', 'eraser')。
    *   `bridge.setPenColor(r, g, b)`: 设置画笔顏色。
    *   `bridge.clearScreen()`: 清除墨跡。
    *   `bridge.toggleSpotlight()`: 开关聚光燈。
    *   `bridge.toggleBoard()`: 开关白板。
    *   `bridge.toggleTimer()`: 开关計时器。
    *   `bridge.launchApp(path)`: 启动外部应用。
*   **系統**:
    *   `bridge.inkPromptResult(keep)`: 用户选择是否保留墨跡 (bool)。
    *   `bridge.updateMask(rects)`: 手动更新點擊穿透区域（通常不需要手动调用，見下文）。
    *   `bridge.resizeNudge()`: 通知后端 UI 大小已变更（用于刷新 Mask）。
    *   `bridge.requestThumbnail(index)`: 请求某頁的縮略图。

#### 2.3.5 點擊穿透 (Mask) 機制

为了讓非 UI 区域能穿透點擊，你需要告訴后端哪些区域是“实体”的。
推薦做法是在你的 JS 中实现 `sendMaskUpdate` 函数，并在 UI 变化时调用它。

```javascript
function sendMaskUpdate() {
    if (!bridge) return;
    // 使用 requestAnimationFrame 避免頻繁调用
    requestAnimationFrame(() => {
        const rects = [];
        // 遍歷所有帶 .interactive 类的元素
        document.querySelectorAll('.interactive').forEach(el => {
            const r = el.getBoundingClientRect();
            if (r.width === 0 || r.height === 0) return;
            // 获取相对于视口的坐标
            rects.push({
                x: r.x, y: r.y, width: r.width, height: r.height
            });
        });
        // 发送给后端
        bridge.updateMask(rects);
    });
}

// 监听 DOM 变化自动更新 (可选)
const observer = new ResizeObserver(() => sendMaskUpdate());
document.querySelectorAll('.interactive').forEach(el => observer.observe(el));
```

### 2.4 开发建議

1.  **使用 CSS 变量**: 參考默认主题，使用 CSS 变量来适配深色/淺色模式。
2.  **响应式布局**: 考慮 `config.toolbarPosition`，你的 UI 应该能适应工具欄在不同位置的情況。
3.  **调试**: 你可以在浏览器中直接打开 `index.html` 進行 UI 调试，但与 `bridge` 相关的功能將无法工作。可以 Mock 一个 `bridge` 对象来測試交互。

祝你开发愉快！
