import { defineStore } from 'pinia'
import defaultSettings from '@/config/settings'

interface AppState {
  title: string
  logo: string
  sidebarCollapsed: boolean
  device: 'desktop' | 'mobile'
  fullscreen: boolean
}

export const useAppStore = defineStore('app', {
  state: (): AppState => ({
    title: defaultSettings.title,
    logo: defaultSettings.logo,
    sidebarCollapsed: false,
    device: 'desktop',
    fullscreen: false
  }),

  actions: {
    // 切换侧边栏
    toggleSidebar() {
      this.sidebarCollapsed = !this.sidebarCollapsed
    },

    // 设置设备类型
    setDevice(device: 'desktop' | 'mobile') {
      this.device = device
    },

    // 切换全屏
    toggleFullscreen() {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen()
        this.fullscreen = true
      } else {
        document.exitFullscreen()
        this.fullscreen = false
      }
    }
  },

  persist: true
})