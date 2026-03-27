<script setup lang="ts">
import { computed, watch, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTabsStore } from '@/stores/tabs'

const route = useRoute()
const router = useRouter()
const tabsStore = useTabsStore()

// 标签列表
const tabList = computed(() => tabsStore.tabList)

// 当前激活标签
const activeTab = computed({
  get: () => route.path,
  set: () => {}
})

// 右键菜单
const contextMenuVisible = ref(false)
const contextMenuPosition = ref({ x: 0, y: 0 })
const selectedTab = ref<string>('')

// 监听路由变化，添加标签
watch(
  () => route.path,
  () => {
    if (route.meta?.title && !route.meta?.hidden) {
      tabsStore.addTab({
        path: route.path,
        title: route.meta.title as string,
        name: route.name as string,
        icon: route.meta.icon as string
      })
    }
  },
  { immediate: true }
)

// 点击标签
const handleClick = (path: string) => {
  router.push(path)
}

// 右键菜单
const handleContextMenu = (e: MouseEvent, path: string) => {
  e.preventDefault()
  contextMenuVisible.value = true
  contextMenuPosition.value = { x: e.clientX, y: e.clientY }
  selectedTab.value = path
}

// 关闭右键菜单
const closeContextMenu = () => {
  contextMenuVisible.value = false
}

// 关闭标签
const handleClose = (path: string) => {
  tabsStore.removeTab(path)
  // 如果关闭的是当前页面，跳转到最后一个标签
  if (route.path === path) {
    const lastTab = tabList.value[tabList.value.length - 1]
    if (lastTab) {
      router.push(lastTab.path)
    } else {
      router.push('/dashboard')
    }
  }
}

// 关闭其他
const closeOther = () => {
  if (!selectedTab.value) return
  tabsStore.closeOtherTabs(selectedTab.value)
  if (route.path !== selectedTab.value) {
    router.push(selectedTab.value)
  }
  closeContextMenu()
}

// 关闭左侧
const closeLeft = () => {
  if (!selectedTab.value) return
  tabsStore.closeLeftTabs(selectedTab.value)
  closeContextMenu()
}

// 关闭右侧
const closeRight = () => {
  if (!selectedTab.value) return
  tabsStore.closeRightTabs(selectedTab.value)
  closeContextMenu()
}

// 关闭所有
const closeAll = () => {
  tabsStore.closeAllTabs()
  router.push('/dashboard')
  closeContextMenu()
}

// 刷新当前页
const refreshPage = () => {
  router.go(0)
  closeContextMenu()
}

// 点击其他地方关闭菜单
document.addEventListener('click', () => {
  closeContextMenu()
})
</script>

<template>
  <div class="tabs-container">
    <el-scrollbar class="tabs-scroll">
      <div class="tabs-wrapper">
        <div
          v-for="tab in tabList"
          :key="tab.path"
          :class="['tab-item', { 'is-active': activeTab === tab.path }]"
          @click="handleClick(tab.path)"
          @contextmenu="(e) => handleContextMenu(e, tab.path)"
        >
          <el-icon v-if="tab.icon" class="tab-icon">
            <component :is="tab.icon" />
          </el-icon>
          <span class="tab-title">{{ tab.title }}</span>
          <el-icon
            v-if="tabList.length > 1"
            class="tab-close"
            @click.stop="handleClose(tab.path)"
          >
            <Close />
          </el-icon>
        </div>
      </div>
    </el-scrollbar>

    <!-- 右键菜单 -->
    <Transition name="fade">
      <div
        v-if="contextMenuVisible"
        class="context-menu"
        :style="{ left: `${contextMenuPosition.x}px`, top: `${contextMenuPosition.y}px` }"
      >
        <div class="menu-item" @click="refreshPage">
          <el-icon><Refresh /></el-icon>
          <span>刷新</span>
        </div>
        <div class="menu-item" @click="closeOther">
          <el-icon><FolderRemove /></el-icon>
          <span>关闭其他</span>
        </div>
        <div class="menu-item" @click="closeLeft">
          <el-icon><Back /></el-icon>
          <span>关闭左侧</span>
        </div>
        <div class="menu-item" @click="closeRight">
          <el-icon><Right /></el-icon>
          <span>关闭右侧</span>
        </div>
        <div class="menu-divider"></div>
        <div class="menu-item danger" @click="closeAll">
          <el-icon><CircleClose /></el-icon>
          <span>关闭所有</span>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.tabs-container {
  display: flex;
  align-items: center;
  height: 30px;
  padding: 0 8px;
  background-color: var(--tabs-bg);
  border-top: 1px solid var(--border-color);
  position: relative;
}

.tabs-scroll {
  flex: 1;
  overflow: hidden;
}

.tabs-wrapper {
  display: flex;
  align-items: center;
  gap: 4px;
  white-space: nowrap;
}

.tab-item {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 0 12px;
  height: 26px;
  border-radius: var(--border-radius);
  cursor: pointer;
  background-color: var(--bg-color);
  border: 1px solid var(--border-color);
  color: var(--tabs-text-color);
  transition: all 0.2s;
  user-select: none;
}

.tab-item:hover {
  background-color: var(--el-color-primary-light-9);
}

.tab-item.is-active {
  background-color: var(--el-color-primary);
  border-color: var(--el-color-primary);
  color: #fff;
}

.tab-icon {
  font-size: 14px;
  color: inherit;
}

.tab-title {
  font-size: 12px;
  color: inherit;
}

.tab-close {
  font-size: 12px;
  border-radius: 50%;
  transition: all 0.2s;
  color: inherit;
}

.tab-close:hover {
  background-color: rgba(0, 0, 0, 0.1);
}

.tab-item.is-active .tab-close:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

/* 右键菜单 */
.context-menu {
  position: fixed;
  z-index: 9999;
  background-color: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.12);
  padding: 4px 0;
  min-width: 120px;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  cursor: pointer;
  color: var(--text-color-primary);
  transition: background-color 0.2s;
}

.menu-item:hover {
  background-color: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
}

.menu-item.danger:hover {
  background-color: var(--el-color-danger-light-9);
  color: var(--el-color-danger);
}

.menu-item .el-icon {
  font-size: 14px;
  color: inherit;
}

.menu-divider {
  height: 1px;
  background-color: var(--border-color);
  margin: 4px 0;
}

/* 过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>