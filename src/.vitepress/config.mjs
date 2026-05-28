import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Kazuha',
  description: '适用于幻灯片放映下的演示助手工具。',
  outDir: '../dist', // 输出目录设置到项目根目录下的 dist
  themeConfig: {
    logo: '/logo.svg',
    
    // 导航栏
    nav: [
      { text: '文档', link: '/quick-start/README.md' }
    ],

    // 侧边栏
    sidebar: [
      {
        text: '快速开始',
        collapsed: false,
        items: [
          { text: '简介', link: '/quick-start/README.md' },
          { text: '准备工作', link: '/quick-start/preparation' },
          { text: '下载与安装', link: '/quick-start/install' },
        ]
      },
      {
        text: '功能',
        collapsed: false,
        items: [
          { text: 'Overlay Window', link: '/features/overlay-window/' },
          { 
            text: '设置',
            collapsed: false,
            items: [
              { text: '常规', link: '/features/settings/general' },
              { text: '主题', link: '/features/settings/theme' },
              { text: '全局应用字体', link: '/features/settings/font' },
              { text: '放映', link: '/features/settings/presentation' },
              { text: '工具栏', link: '/features/settings/toolbar' }
            ]
          },
          { text: 'Timer', link: '/features/timer/' },
          { text: 'Spotlight', link: '/features/spotlight/' }
        ]
      },
      {
        text: '杂事',
        link: '/misc/README.md'
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/Haraguse/Kazuha' }
    ],
    
    footer: {
      message: 'Made with ❤️',
      copyright: 'Copyright © 2025-2026 Seirai Haraguchi'
    }
  }
})
