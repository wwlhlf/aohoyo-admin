import { defineStore } from 'pinia'
import defaultSettings from '@/config/settings'

type ThemeMode = 'light' | 'dark' | 'auto'

interface ThemeState {
  mode: ThemeMode
  primaryColor: string
  sidebarTheme: 'light' | 'dark'
  headerTheme: 'light' | 'dark'
  borderRadius: number
  fontSize: 12 | 14 | 16
  grayMode: boolean
  colorWeak: boolean
  animation: boolean
}

export const useThemeStore = defineStore('theme', {
  state: (): ThemeState => ({
    mode: defaultSettings.theme.mode,
    primaryColor: defaultSettings.theme.primaryColor,
    sidebarTheme: defaultSettings.theme.sidebarTheme,
    headerTheme: defaultSettings.theme.headerTheme,
    borderRadius: defaultSettings.theme.borderRadius,
    fontSize: defaultSettings.theme.fontSize,
    grayMode: defaultSettings.theme.grayMode,
    colorWeak: defaultSettings.theme.colorWeak,
    animation: defaultSettings.theme.animation
  }),

  getters: {
    // 是否暗黑模式
    isDark: state => state.mode === 'dark',
    // 主题预设
    presets: () => defaultSettings.theme.presets
  },

  actions: {
    // 设置主题模式
    setMode(mode: ThemeMode) {
      this.mode = mode
      this.applyTheme()
    },

    // 切换暗黑模式
    toggleDark() {
      this.mode = this.mode === 'light' ? 'dark' : 'light'
      this.applyTheme()
    },

    // 设置主色调
    setPrimaryColor(color: string) {
      this.primaryColor = color
      this.applyPrimaryColor()
    },

    // 设置侧边栏主题
    setSidebarTheme(theme: 'light' | 'dark') {
      this.sidebarTheme = theme
      this.applySidebarTheme()
    },

    // 设置头部主题
    setHeaderTheme(theme: 'light' | 'dark') {
      this.headerTheme = theme
      this.applyHeaderTheme()
    },

    // 设置圆角
    setBorderRadius(radius: number) {
      this.borderRadius = radius
      const html = document.documentElement
      
      // Element Plus 圆角变量
      html.style.setProperty('--el-border-radius-base', `${radius}px`)
      html.style.setProperty('--el-border-radius-small', `${Math.max(0, radius - 2)}px`)
      html.style.setProperty('--el-border-radius-round', `${radius * 2}px`)
      html.style.setProperty('--el-border-radius-circle', '50%')
      
      // 自定义圆角变量
      html.style.setProperty('--border-radius', `${radius}px`)
      html.style.setProperty('--border-radius-sm', `${Math.max(0, radius - 2)}px`)
      html.style.setProperty('--border-radius-lg', `${radius + 4}px`)
    },

    // 设置字号
    setFontSize(size: 12 | 14 | 16) {
      this.fontSize = size
      document.documentElement.style.setProperty('--el-font-size-base', `${size}px`)
    },

    // 切换灰色模式
    toggleGrayMode() {
      this.grayMode = !this.grayMode
      document.documentElement.classList.toggle('gray-mode', this.grayMode)
    },

    // 切换色弱模式
    toggleColorWeak() {
      this.colorWeak = !this.colorWeak
      document.documentElement.classList.toggle('color-weak', this.colorWeak)
    },

    // 切换动画
    toggleAnimation() {
      this.animation = !this.animation
    },

    // 应用主题
    applyTheme() {
      const html = document.documentElement

      // 暗黑模式 - 同时添加 Element Plus 的 dark 类
      if (this.mode === 'dark') {
        html.classList.add('dark')
        html.setAttribute('data-theme', 'dark')
      } else {
        html.classList.remove('dark')
        html.setAttribute('data-theme', 'light')
      }

      // 更新 CSS 变量
      this.applyPrimaryColor()
      this.applySidebarTheme()
      this.applyHeaderTheme()
    },

    // 应用侧边栏主题
    applySidebarTheme() {
      const html = document.documentElement
      if (this.sidebarTheme === 'dark') {
        html.classList.add('sidebar-dark')
        html.classList.remove('sidebar-light')
      } else {
        html.classList.add('sidebar-light')
        html.classList.remove('sidebar-dark')
      }
    },

    // 应用头部主题
    applyHeaderTheme() {
      const html = document.documentElement
      if (this.headerTheme === 'dark') {
        html.classList.add('header-dark')
        html.classList.remove('header-light')
      } else {
        html.classList.add('header-light')
        html.classList.remove('header-dark')
      }
    },

    // 应用主色调
    applyPrimaryColor() {
      const html = document.documentElement
      html.style.setProperty('--el-color-primary', this.primaryColor)

      // 生成主色调的亮色系列
      const lighten = (color: string, amount: number) => {
        const num = parseInt(color.replace('#', ''), 16)
        const r = Math.min(255, Math.floor((num >> 16) + (255 - (num >> 16)) * amount))
        const g = Math.min(255, Math.floor(((num >> 8) & 0x00FF) + (255 - ((num >> 8) & 0x00FF)) * amount))
        const b = Math.min(255, Math.floor((num & 0x0000FF) + (255 - (num & 0x0000FF)) * amount))
        return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
      }

      // 生成 Element Plus 需要的颜色变量
      for (let i = 1; i <= 9; i++) {
        html.style.setProperty(
          `--el-color-primary-light-${10 - i}`,
          lighten(this.primaryColor, i * 0.1)
        )
      }
    },

    // 初始化主题
    initTheme() {
      this.applyTheme()
      this.applyPrimaryColor()
      this.setBorderRadius(this.borderRadius)
      this.setFontSize(this.fontSize)

      if (this.grayMode) {
        document.documentElement.classList.add('gray-mode')
      }
      if (this.colorWeak) {
        document.documentElement.classList.add('color-weak')
      }
    }
  },

  persist: true
})