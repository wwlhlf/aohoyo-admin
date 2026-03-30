import { defineStore } from 'pinia'
import defaultSettings from '@/config/settings'

interface AppState {
  title: string
  logo: string
  sidebarCollapsed: boolean
  device: 'desktop' | 'mobile'
}

export const useAppStore = defineStore('app', {
  state: (): AppState => ({
    title: defaultSettings.title,
    logo: defaultSettings.logo,
    sidebarCollapsed: false,
    device: 'desktop'
  }),

  actions: {
    // 切换侧边栏
    toggleSidebar() {
      this.sidebarCollapsed = !this.sidebarCollapsed
    },

    // 设置设备类型
    setDevice(device: 'desktop' | 'mobile') {
      this.device = device
    }
  },

  persist: true
})
