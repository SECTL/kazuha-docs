import { defineConfig } from 'vitepress'

const currentYear = new Date().getFullYear()
export default defineConfig({
  lang: 'zh-CN',
  title: 'Kazuha',
  description: '适用于幻灯片放映下的演示助手工具。',
  outDir: '../dist', // 输出目录设置到项目根目录下的 dist
  head: [
    ['link',{ rel: 'icon', href: '/logo.png'}],
  ],
  sitemap: {
    hostname: 'https://kazuha.sectl.top',
  },
  themeConfig: {
    logo: '/logo.svg',
    
    // 导航栏
    nav: [
      { text: '快速开始', link: '/quick-start/' },
      {
        text: '功能',
        items: [
          { text: '覆盖窗口', link: '/features/overlay-window' },
          { 
            text: '设置',
            collapsed: false,
            items: [
              { text: '常规', link: '/features/settings/general' },
              { text: '主题', link: '/features/settings/theme' },
              { text: '全局应用字体', link: '/features/settings/font' },
              { text: '放映', link: '/features/settings/present' },
              { text: '工具栏', link: '/features/settings/toolbar' }
            ]
          },
          { text: '计时器', link: '/features/timer' },
          { text: '聚光灯', link: '/features/spotlight' }
        ]
      },
    ],

    // 侧边栏
    sidebar: [
      {
        text: '快速开始',
        collapsed: false,
        items: [
          { text: '准备工作', link: '/quick-start/prepare' },
          { text: '下载与安装', link: '/quick-start/install' },
        ]
      },
      {
        text: '功能',
        collapsed: false,
        items: [
          { text: '覆盖窗口', link: '/features/overlay-window' },
          { 
            text: '设置',
            collapsed: false,
            items: [
              { text: '常规', link: '/features/settings/general' },
              { text: '主题', link: '/features/settings/theme' },
              { text: '全局应用字体', link: '/features/settings/font' },
              { text: '放映', link: '/features/settings/present' },
              { text: '工具栏', link: '/features/settings/toolbar' }
            ]
          },
          { text: '计时器', link: '/features/timer' },
          { text: '聚光灯', link: '/features/spotlight' }
        ]
      },
      {
        text: '杂事',
        link: '/misc/README.md'
      }
    ],

    search: {
      provider: "local",
      options: {
        translations: {
          button: {
            buttonText: "搜索文档",
            buttonAriaLabel: "搜索文档",
          },
          modal: {
            noResultsText: "没有找到结果",
            resetButtonTitle: "清除搜索条件",
            footer: {
              selectText: "选择",
              navigateText: "切换",
              closeText: "关闭",
            },
          },
        },
      },
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/SECTL/Kazuha' },
      {
        icon: {
          svg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M21.395 15.035a40 40 0 0 0-.803-2.264l-1.079-2.695c.001-.032.014-.562.014-.836C19.526 4.632 17.351 0 12 0S4.474 4.632 4.474 9.241c0 .274.013.804.014.836l-1.08 2.695a39 39 0 0 0-.802 2.264c-1.021 3.283-.69 4.643-.438 4.673c.54.065 2.103-2.472 2.103-2.472c0 1.469.756 3.387 2.394 4.771c-.612.188-1.363.479-1.845.835c-.434.32-.379.646-.301.778c.343.578 5.883.369 7.482.189c1.6.18 7.14.389 7.483-.189c.078-.132.132-.458-.301-.778c-.483-.356-1.233-.646-1.846-.836c1.637-1.384 2.393-3.302 2.393-4.771c0 0 1.563 2.537 2.103 2.472c.251-.03.581-1.39-.438-4.673"/></svg>'
        },
        link: 'https://qm.qq.com/q/5KbemeWo5a'
      },
      {
        icon: {
          svg: '<svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 20 20"><g fill="currentColor"><path d="M 12.566406 3.507812 C 12.566406 3.507812 11.976562 3.175781 11.398438 3.339844 L 1.933594 6.023438 L 4.449219 1.535156 C 4.449219 1.535156 4.816406 0.800781 6.242188 0.832031 L 14.148438 0.851562 L 12.632812 3.550781 Z M 15.699219 1.691406 L 14.089844 4.558594 C 14.089844 4.558594 14.492188 4.933594 14.609375 5.367188 L 16.015625 10.867188 L 10.582031 12.550781 L 12.542969 9.359375 L 11.933594 6.949219 C 11.933594 6.949219 11.617188 6 10.683594 6.109375 C 10.667969 6.109375 10.648438 6.109375 10.640625 6.109375 C 9.675781 6.257812 0.734375 8.800781 0.734375 8.800781 C 0.734375 8.800781 0.0351562 9 0 9.714844 C 0 9.714844 -0.015625 10.492188 0.441406 11.199219 L 4.410156 18.160156 L 5.867188 15.558594 C 5.867188 15.558594 5.410156 15.132812 5.359375 14.917969 L 3.757812 9.074219 L 9.132812 7.507812 C 9.132812 7.507812 9.425781 7.359375 9.542969 7.617188 L 7.199219 10.617188 L 8 13.300781 C 8 13.300781 8.351562 13.890625 9.167969 13.890625 L 19.492188 11 C 19.492188 11 20.175781 10.867188 19.984375 9.808594 C 19.984375 9.808594 20.015625 9.417969 19.691406 8.765625 L 15.714844 1.675781 Z M 15.699219 1.691406 "/><path d="M 7.25 16.410156 C 7.25 16.410156 7.800781 16.648438 8.160156 16.632812 L 18.132812 13.832031 L 15.839844 17.917969 C 15.839844 17.917969 15.285156 19.058594 13.957031 19.058594 L 5.707031 19.175781 L 7.25 16.417969 Z M 7.25 16.410156 "/></g></svg>'
        },
        link: 'https://forum.smart-teach.cn/t/kazuha'
      },
    ],
    
    footer: {
      message: 'Powered by <a href="https://vitepress.dev/zh/" target="_blank" rel="noopener noreferrer">VitePress</a>',
      copyright: `Copyright © 2025-${currentYear} Seirai Haraguchi`
    },

    outline: {
      level: 'deep',
      label: '页面导航'
    },

    editLink: {
      pattern: 'https://github.com/SECTL/kazuha-docs/edit/main/src/:path',
      text: '在 GitHub 上编辑此页面'
    },

    docFooter: {
      prev: '上一页',
      next: '下一页'
    },

    lastUpdated: {
      text: '最后更新于'
    },

    notFound: {
      title: '页面未找到',
      quote:
        '但如果你不改变方向，并且继续寻找，你可能最终会到达你所前往的地方。',
      linkLabel: '前往首页',
      linkText: '带我回首页'
    },

    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '目录',
    darkModeSwitchLabel: '主题',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式',
    skipToContentLabel: '跳转到内容',
  },

  markdown: {
    config: (md) => {
      md.renderer.rules.heading_close = (tokens, idx, options, env, slf) => {
          let htmlResult = slf.renderToken(tokens, idx, options);
          if (tokens[idx].tag === 'h1') htmlResult += `<ArticleMetadata />`; 
          return htmlResult;
      }
    },
    image: {
      // 开启图片懒加载
      lazyLoading: true
    },
    container: {
      tipLabel: '提示',
      warningLabel: '警告',
      dangerLabel: '危险',
      infoLabel: '信息',
      detailsLabel: '详细信息'
    },
  },
})
