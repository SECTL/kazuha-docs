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

