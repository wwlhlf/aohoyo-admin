/**
 * 全局配置
 * 可在应用启动时覆盖
 */
export default {
  // 基础配置
  title: 'Aohoyo Admin',
  logo: '/logo.svg',
  baseUrl: '/api',

  // 标签页配置
  tabs: {
    enabled: true,          // 是否启用标签页
    cache: true,            // 是否缓存页面
    maxCount: 10,           // 最大标签数
    style: 'card' as const  // card / chrome / plain
  },

  // 布局配置
  layout: {
    mode: 'sidebar' as const,        // sidebar / top / mix
    sidebarWidth: 220,               // 侧边栏宽度
    sidebarCollapsedWidth: 64,       // 侧边栏折叠宽度
    showLogo: true,                  // 显示Logo
    showBreadcrumb: true,            // 显示面包屑
    showFooter: true,                // 显示页脚
    fixedHeader: true,               // 固定头部
    fixedSidebar: true               // 固定侧边栏
  },

  // 主题配置
  theme: {
    // 模式
    mode: 'light' as 'light' | 'dark' | 'auto',

    // 预设主题色
    primaryColor: '#F37021',     // 爱马仕橙
    successColor: '#67c23a',
    warningColor: '#e6a23c',
    dangerColor: '#f56c6c',
    infoColor: '#909399',

    // 主题预设
    presets: [
      { name: '爱马仕橙', primary: '#F37021' },
      { name: '科技蓝', primary: '#1677ff' },
      { name: '翡翠绿', primary: '#00a870' },
      { name: '玫瑰金', primary: '#c41d7f' },
      { name: '星空紫', primary: '#722ed1' }
    ],

    // 侧边栏主题
    sidebarTheme: 'light' as 'light' | 'dark',

    // 头部主题
    headerTheme: 'light' as 'light' | 'dark',

    // 圆角
    borderRadius: 4,

    // 字体大小
    fontSize: 14 as 12 | 14 | 16,

    // 灰色模式
    grayMode: false,

    // 色弱模式
    colorWeak: false,

    // 动画
    animation: true,
    transition: 'fade' as 'fade' | 'slide' | 'zoom',
  },

  // Mock
  mock: true,

  // 国际化
  locale: 'zh-CN'
}

// 类型导出
export type TabsConfig = typeof defaultSettings.tabs
export type LayoutConfig = typeof defaultSettings.layout
export type ThemeConfig = typeof defaultSettings.theme

const defaultSettings = {
  tabs: {
    enabled: true,
    cache: true,
    maxCount: 10,
    style: 'card' as const
  },
  layout: {
    mode: 'sidebar' as const,
    sidebarWidth: 220,
    sidebarCollapsedWidth: 64,
    showLogo: true,
    showBreadcrumb: true,
    showFooter: true,
    fixedHeader: true,
    fixedSidebar: true
  },
  theme: {
    mode: 'light' as 'light' | 'dark' | 'auto',
    primaryColor: '#F37021',
    successColor: '#67c23a',
    warningColor: '#e6a23c',
    dangerColor: '#f56c6c',
    infoColor: '#909399',
    presets: [
      { name: '爱马仕橙', primary: '#F37021' },
      { name: '科技蓝', primary: '#1677ff' },
      { name: '翡翠绿', primary: '#00a870' },
      { name: '玫瑰金', primary: '#c41d7f' },
      { name: '星空紫', primary: '#722ed1' }
    ],
    sidebarTheme: 'light' as 'light' | 'dark',
    headerTheme: 'light' as 'light' | 'dark',
    borderRadius: 4,
    fontSize: 14 as 12 | 14 | 16,
    grayMode: false,
    colorWeak: false,
    animation: true,
    transition: 'fade' as 'fade' | 'slide' | 'zoom',
  }
}