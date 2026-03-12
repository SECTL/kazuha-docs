# Kazuha 主題與 Splash 包製作指南

本文檔旨在幫助開發者和設計師為 Kazuha 軟件製作自定義的啟動畫面（Splash）和覆蓋層主題（Theme）。

## 目錄結構

所有用戶自定義的資源包都應存放在軟件根目錄下的 `user` 文件夾中。如果該文件夾不存在，請手動創建。

```
Kazuha/
├── main.py
├── ...
└── user/
    ├── splash/
    │   └── <your_splash_id>/
    │       ├── manifest.json
    │       ├── preview.png
    │       └── splash.py
    └── themes/
        └── <your_theme_id>/
            ├── manifest.json
            ├── preview.png
            └── index.html
```

---

## 1. Splash 包製作 (啟動畫面)

Splash 包用於自定義軟件啟動時的加載畫面。

### 1.1 文件結構

一個合法的 Splash 包必須包含以下文件：

*   **manifest.json**: 描述文件。
*   **preview.png** (或 .jpg): 預覽圖，用於在設置界面顯示。
*   **splash.py**: Python 腳本，包含構建 UI 的邏輯。

### 1.2 manifest.json

```json
{
    "name": "your_splash_id",
    "version": "1.0.0",
    "author": "Your Name",
    "description": "A cool splash screen."
}
```
**注意**: `name` 字段必須與文件夾名稱一致。

### 1.3 splash.py 詳解

`splash.py` 必須包含一個 `apply(splash_widget)` 函數。該函數接收一個 `StartupSplash` 實例（繼承自 `QWidget`），你可以在這個 Widget 上構建你的界面。

**主要對象**:
*   `splash_widget`: 這是你的畫布。它默認是無邊框、背景透明的窗口。
*   `splash_widget._container`: 建議在這個 QFrame 上添加你的控件。

**可用數據**:
*   `splash_widget._version_text`: 版本號文本 (如 "v1.2.3")。
*   `splash_widget._status_text`: 當前加載狀態文本 (如 "正在初始化 20%")。
*   `splash_widget._progress_value`: 當前加載進度 (0-100)。

**示例代碼**:

```python
from PySide6.QtWidgets import QLabel, QProgressBar
from PySide6.QtCore import Qt
from PySide6.QtGui import QFont

def apply(splash):
    # 設置窗口大小
    splash.resize(600, 300)
    
    # 設置容器樣式 (背景色、圓角等)
    splash._container.setStyleSheet("""
        QFrame {
            background-color: #ffffff;
            border-radius: 12px;
            border: 1px solid #e0e0e0;
        }
    """)
    
    # 添加標題
    title = QLabel("My Custom Splash", splash._container)
    title.move(50, 50)
    title.setFont(QFont("Microsoft YaHei", 24, QFont.Bold))
    
    # 添加進度條 (如果需要自定義更新邏輯，可以綁定到 splash 的 update 方法，或者使用定時器)
    # 注意：默認的進度更新會嘗試調用 splash._progress 和 splash._percent_label
    # 如果你完全重寫了 UI，你可能需要 Monkey Patch splash.set_progress 方法
    
    # 簡單的自定義進度顯示示例：
    original_set_progress = splash.set_progress
    
    status_label = QLabel(splash._container)
    status_label.move(50, 150)
    status_label.resize(500, 30)
    
    def custom_set_progress(value, text_key="initializing"):
        # 調用原始邏輯以確保後台狀態正確 (可選)
        # original_set_progress(value, text_key)
        
        # 更新你的 UI
        status_label.setText(f"{text_key} ... {value}%")
        splash.update() # 強制重繪
        
    # 覆蓋實例方法
    splash.set_progress = custom_set_progress
```

---

## 2. Theme 包製作 (覆蓋層主題)

Theme 包定義了 PPT 放映時的覆蓋層 UI。它本質上是一個透明背景的網頁。

### 2.1 文件結構

*   **manifest.json**: 描述文件。
*   **preview.png** (或 .jpg): 預覽圖。
*   **index.html**: 主入口文件。

### 2.2 manifest.json

```json
{
    "name": "your_theme_id",
    "version": "1.0.0",
    "author": "Your Name"
}
```
**注意**: `name` 字段必須與文件夾名稱一致。

### 2.3 index.html 開發指南

你的 HTML 文件將在 `QWebEngineView` 中運行。背景必須是透明的，以便顯示下方的 PPT。

#### 2.3.1 關鍵 CSS 類

*   **`.interactive`**: **非常重要！** 只有帶有此類名的元素（及其子元素）才能接收鼠標點擊。其他區域將是“穿透”的，鼠標事件會傳遞給 PPT。
    *   務必確保你的按鈕、工具欄、彈窗都包含此類名。
    *   你可以通過 JS 動態計算並發送 Mask 更新，但使用 `.interactive` 類並配合官方提供的腳本是最簡單的方法。

#### 2.3.2 與後端通信 (QWebChannel)

你需要在 HTML 中引入 `qwebchannel.js` 並建立連接。

```html
<script src="qrc:///qtwebchannel/qwebchannel.js"></script>
<script>
    let bridge = null;
    new QWebChannel(qt.webChannelTransport, function(channel) {
        bridge = channel.objects.bridge;
        bridge.requestInitState(); // 請求初始化狀態
    });
</script>
```

#### 2.3.3 接收數據 (後端 -> 前端)

你需要在 `window` 對象上定義以下函數，後端會自動調用它們：

*   **`updateConfig(config)`**: 當配置變更時調用。
    *   `config.scale`: UI 縮放比例 (float).
    *   `config.safeArea`: 安全區域邊距 (int).
    *   `config.toolbarPosition`: 'bottom' | 'top' | 'left' | 'right'.
    *   `config.showStatusBar`: 是否顯示狀態欄 (bool).
    *   `config.toolbarOrder`: 工具欄按鈕順序 (Array<string>).
    *   `config.disabledTools`: 被禁用的工具列表 (Array<string>).
    *   `config.compatibilityMode`: 兼容模式 (bool).
*   **`updatePageInfo(current, total)`**: 更新頁碼信息。
*   **`toggleStatusBar(visible)`**: 顯示/隱藏狀態欄。
*   **`setTheme(isDark, accentColor, themeId)`**: 設置主題顏色模式。
*   **`updateSystemStatus(data)`**: 更新系統狀態（電量、網絡等）。
    *   `data` 包含 `battery_percent`, `network_online`, `volume`, `smtc_status` 等。
*   **`updatePageThumbnail(index, url)`**: 接收縮略圖數據（Base64 URL）。
*   **`showInkPrompt()` / `hideInkPrompt()`**: 顯示/隱藏“保留墨跡”對話框。

#### 2.3.4 發送指令 (前端 -> 後端)

通過 `bridge` 對象調用後端功能：

*   **導航**:
    *   `bridge.prevPage()`: 上一頁。
    *   `bridge.nextPage()`: 下一頁。
    *   `bridge.gotoSlide(pageIndex)`: 跳轉到指定頁。
    *   `bridge.endShow()`: 結束放映。
*   **工具**:
    *   `bridge.setTool(toolName)`: 切換工具 ('arrow', 'pen', 'eraser')。
    *   `bridge.setPenColor(r, g, b)`: 設置畫筆顏色。
    *   `bridge.clearScreen()`: 清除墨跡。
    *   `bridge.toggleSpotlight()`: 開關聚光燈。
    *   `bridge.toggleBoard()`: 開關白板。
    *   `bridge.toggleTimer()`: 開關計時器。
    *   `bridge.launchApp(path)`: 啟動外部應用。
*   **系統**:
    *   `bridge.inkPromptResult(keep)`: 用戶選擇是否保留墨跡 (bool)。
    *   `bridge.updateMask(rects)`: 手動更新點擊穿透區域（通常不需要手動調用，見下文）。
    *   `bridge.resizeNudge()`: 通知後端 UI 大小已變更（用於刷新 Mask）。
    *   `bridge.requestThumbnail(index)`: 請求某頁的縮略圖。

#### 2.3.5 點擊穿透 (Mask) 機制

為了讓非 UI 區域能穿透點擊，你需要告訴後端哪些區域是“實體”的。
推薦做法是在你的 JS 中實現 `sendMaskUpdate` 函數，並在 UI 變化時調用它。

```javascript
function sendMaskUpdate() {
    if (!bridge) return;
    # 使用 requestAnimationFrame 避免頻繁調用
    requestAnimationFrame(() => {
        const rects = [];
        # 遍歷所有帶 .interactive 類的元素
        document.querySelectorAll('.interactive').forEach(el => {
            const r = el.getBoundingClientRect();
            if (r.width === 0 || r.height === 0) return;
            # 獲取相對於視口的坐標
            rects.push({
                x: r.x, y: r.y, width: r.width, height: r.height
            });
        });
        # 發送給後端
        bridge.updateMask(rects);
    });
}

# 監聽 DOM 變化自動更新 (可選)
const observer = new ResizeObserver(() => sendMaskUpdate());
document.querySelectorAll('.interactive').forEach(el => observer.observe(el));
```

### 2.4 開發建議

1.  **使用 CSS 變量**: 參考默認主題，使用 CSS 變量來適配深色/淺色模式。
2.  **響應式布局**: 考慮 `config.toolbarPosition`，你的 UI 應該能適應工具欄在不同位置的情況。
3.  **調試**: 你可以在瀏覽器中直接打開 `index.html` 進行 UI 調試，但與 `bridge` 相關的功能將無法工作。可以 Mock 一個 `bridge` 對象來測試交互。

祝你開發愉快！
