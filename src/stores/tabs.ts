import { defineStore } from 'pinia'

export interface TabItem {
  path: string
  title: string
  name?: string
  icon?: string
}

interface TabsState {
  tabList: TabItem[]
  cachedViews: string[]
}

// 图标格式迁移：旧格式 ep:xxx → 新格式 Xxx
const migrateIcon = (icon?: string): string | undefined => {
  if (!icon) return undefined
  // 如果是旧格式 ep:xxx，转换为新格式
  if (icon.startsWith('ep:')) {
    const parts = icon.split(':')
    const name = parts[1] || ''
    // kebab-case 转 PascalCase: user-filled → UserFilled
    return name
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join('')
  }
  return icon
}

export const useTabsStore = defineStore('tabs', {
  state: (): TabsState => ({
    tabList: [],
    cachedViews: []
  }),

  actions: {
    // 添加标签
    addTab(tab: TabItem) {
      const exists = this.tabList.find(item => item.path === tab.path)
      if (!exists) {
        // 迁移图标格式
        const migratedTab = {
          ...tab,
          icon: migrateIcon(tab.icon)
        }
        this.tabList.push(migratedTab)
      }
    },

    // 移除标签
    removeTab(path: string) {
      const index = this.tabList.findIndex(item => item.path === path)
      if (index > -1) {
        this.tabList.splice(index, 1)
        // 同步移除缓存
        const cachedIndex = this.cachedViews.indexOf(path)
        if (cachedIndex > -1) {
          this.cachedViews.splice(cachedIndex, 1)
        }
      }
    },

    // 关闭其他标签
    closeOtherTabs(path: string) {
      this.tabList = this.tabList.filter(item => item.path === path)
      this.cachedViews = this.cachedViews.filter(view => view === path)
    },

    // 关闭左侧标签
    closeLeftTabs(path: string) {
      const index = this.tabList.findIndex(item => item.path === path)
      if (index > -1) {
        this.tabList = this.tabList.slice(index)
        this.cachedViews = this.cachedViews.filter(view =>
          this.tabList.some(tab => tab.path === view)
        )
      }
    },

    // 关闭右侧标签
    closeRightTabs(path: string) {
      const index = this.tabList.findIndex(item => item.path === path)
      if (index > -1) {
        this.tabList = this.tabList.slice(0, index + 1)
        this.cachedViews = this.cachedViews.filter(view =>
          this.tabList.some(tab => tab.path === view)
        )
      }
    },

    // 关闭所有标签
    closeAllTabs() {
      this.tabList = []
      this.cachedViews = []
    },

    // 迁移所有标签的图标格式
    migrateAllIcons() {
      this.tabList = this.tabList.map(tab => ({
        ...tab,
        icon: migrateIcon(tab.icon)
      }))
    }
  },

  persist: true
})
