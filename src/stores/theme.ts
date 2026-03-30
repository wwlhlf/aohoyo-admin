import { defineStore } from 'pinia'
import defaultSettings from '@/config/settings'
import { encode, decode } from '@/utils/crypto'

type ThemeMode = 'light' | 'dark'

interface ThemeState {
  mode: ThemeMode
  primaryColor: string
  borderRadius: number
  grayMode: boolean
  colorWeak: boolean
  animation: boolean
  // 功能开关
  tabsEnabled: boolean
  tabsShowIcon: boolean
  fullscreenEnabled: boolean
  lockScreenEnabled: boolean
  notificationEnabled: boolean
  refreshEnabled: boolean
  languageEnabled: boolean
  // 锁屏状态
  isLocked: boolean
  lockPassword: string
}

export const useThemeStore = defineStore('theme', {
  state: (): ThemeState => ({
    mode: defaultSettings.theme.mode,
    primaryColor: defaultSettings.theme.primaryColor,
    borderRadius: defaultSettings.theme.borderRadius,
    grayMode: defaultSettings.theme.grayMode,
    colorWeak: defaultSettings.theme.colorWeak,
    animation: defaultSettings.theme.animation,
    tabsEnabled: defaultSettings.tabs.enabled,
    tabsShowIcon: defaultSettings.tabs.showIcon,
    fullscreenEnabled: defaultSettings.features.fullscreen,
    lockScreenEnabled: defaultSettings.features.lockScreen,
    notificationEnabled: defaultSettings.features.notification,
    refreshEnabled: defaultSettings.features.refresh,
    languageEnabled: defaultSettings.features.language ?? true,
    isLocked: false,
    lockPassword: ''
  }),

  getters: {
    isDark: state => state.mode === 'dark',
    presets: () => defaultSettings.theme.presets
  },

  actions: {
    // 暗黑模式
    toggleDark() {
      this.mode = this.mode === 'light' ? 'dark' : 'light'
      this.applyTheme()
    },

    // 主题色
    setPrimaryColor(color: string) {
      this.primaryColor = color
      this.applyPrimaryColor()
    },

    // 圆角
    setBorderRadius(radius: number) {
      this.borderRadius = radius
      document.documentElement.style.setProperty('--border-radius', `${radius}px`)
    },

    // 特殊模式
    toggleGrayMode() {
      this.grayMode = !this.grayMode
      document.documentElement.classList.toggle('gray-mode', this.grayMode)
    },
    toggleColorWeak() {
      this.colorWeak = !this.colorWeak
      document.documentElement.classList.toggle('color-weak', this.colorWeak)
    },
    toggleAnimation() {
      this.animation = !this.animation
    },

    // 功能开关
    toggleTabs() {
      this.tabsEnabled = !this.tabsEnabled
    },
    toggleTabsIcon() {
      this.tabsShowIcon = !this.tabsShowIcon
    },
    toggleFullscreen() {
      this.fullscreenEnabled = !this.fullscreenEnabled
    },
    toggleLockScreen() {
      this.lockScreenEnabled = !this.lockScreenEnabled
    },
    toggleNotification() {
      this.notificationEnabled = !this.notificationEnabled
    },
    toggleRefresh() {
      this.refreshEnabled = !this.refreshEnabled
    },
    toggleLanguage() {
      this.languageEnabled = !this.languageEnabled
    },

    // 锁屏
    lock() {
      this.isLocked = true
    },
    unlock(password: string): boolean {
      // 未设置密码，直接解锁
      if (!this.lockPassword) {
        this.$patch({ isLocked: false })
        return true
      }

      // 验证密码
      const storedPassword = decode(this.lockPassword)
      if (storedPassword === password) {
        this.$patch({ isLocked: false })
        return true
      }
      return false
    },
    setLockPassword(password: string) {
      this.lockPassword = encode(password)
    },
    // 清除锁屏密码
    clearLockPassword() {
      this.$patch({ lockPassword: '', isLocked: false })
    },

    // 应用主题
    applyTheme() {
      const html = document.documentElement
      html.classList.toggle('dark', this.mode === 'dark')
      this.applyPrimaryColor()
    },

    applyPrimaryColor() {
      const html = document.documentElement
      html.style.setProperty('--el-color-primary', this.primaryColor)

      const lighten = (color: string, amount: number) => {
        const num = parseInt(color.replace('#', ''), 16)
        const r = Math.min(255, Math.floor((num >> 16) + (255 - (num >> 16)) * amount))
        const g = Math.min(
          255,
          Math.floor(((num >> 8) & 0x00ff) + (255 - ((num >> 8) & 0x00ff)) * amount)
        )
        const b = Math.min(255, Math.floor((num & 0x0000ff) + (255 - (num & 0x0000ff)) * amount))
        return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
      }

      for (let i = 1; i <= 9; i++) {
        html.style.setProperty(
          `--el-color-primary-light-${10 - i}`,
          lighten(this.primaryColor, i * 0.1)
        )
      }
    },

    initTheme() {
      this.applyTheme()
      this.setBorderRadius(this.borderRadius)
      if (this.grayMode) document.documentElement.classList.add('gray-mode')
      if (this.colorWeak) document.documentElement.classList.add('color-weak')
    }
  },

  persist: true
})
