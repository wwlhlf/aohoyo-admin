<script setup lang="ts">
import { computed, watch, ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useTabsStore } from '@/stores/tabs'
import { useThemeStore } from '@/stores/theme'

const { t } = useI18n()
const themeStore = useThemeStore()
const route = useRoute()
const router = useRouter()
const tabsStore = useTabsStore()

const tabList = computed(() => tabsStore.tabList)

const activeTab = computed({
  get: () => route.path,
  set: () => {}
})

const contextMenuVisible = ref(false)
const contextMenuPosition = ref({ x: 0, y: 0 })
const selectedTab = ref<string>('')

let storeRestored = false

watch(
  () => route.path,
  () => {
    if (!storeRestored) {
      storeRestored = true
      return
    }
    if (route.meta?.title && !route.meta?.hidden) {
      tabsStore.addTab({
        path: route.path,
        title: t(route.meta.title as string),
        name: route.name as string,
        icon: route.meta.icon as string
      })
    }
  },
  { immediate: true }
)

const handleClick = (path: string) => router.push(path)

const handleContextMenu = (e: MouseEvent, path: string) => {
  e.preventDefault()
  contextMenuVisible.value = true
  contextMenuPosition.value = { x: e.clientX, y: e.clientY }
  selectedTab.value = path
}

const closeContextMenu = () => {
  contextMenuVisible.value = false
}

const handleClose = (path: string) => {
  tabsStore.removeTab(path)
  if (route.path === path) {
    const last = tabList.value[tabList.value.length - 1]
    router.push(last?.path || '/dashboard')
  }
}

const closeOther = () => {
  if (!selectedTab.value) return
  tabsStore.closeOtherTabs(selectedTab.value)
  if (route.path !== selectedTab.value) router.push(selectedTab.value)
  closeContextMenu()
}

const closeLeft = () => {
  if (!selectedTab.value) return
  tabsStore.closeLeftTabs(selectedTab.value)
  closeContextMenu()
}

const closeRight = () => {
  if (!selectedTab.value) return
  tabsStore.closeRightTabs(selectedTab.value)
  closeContextMenu()
}

const closeAll = () => {
  tabsStore.closeAllTabs()
  router.push('/dashboard')
  closeContextMenu()
}

const refreshPage = () => {
  router.go(0)
  closeContextMenu()
}

onMounted(() => document.addEventListener('click', closeContextMenu))
onUnmounted(() => document.removeEventListener('click', closeContextMenu))
</script>

<template>
  <div v-if="tabList.length > 0" class="tabs-container">
    <div class="tabs-wrapper">
      <el-tabs
        v-model:active-name="activeTab"
        type="card"
        class="custom-tabs"
        @tab-click="(tab: any) => handleClick(tab.name)"
      >
        <el-tab-pane v-for="tab in tabList" :key="tab.path" :label="tab.title" :name="tab.path">
          <template #label>
            <span
              class="tab-label"
              @contextmenu="(e: MouseEvent) => handleContextMenu(e, tab.path)"
            >
              <el-icon v-if="tab.icon"><component :is="tab.icon" /></el-icon>
              {{ tab.title }}
              <el-icon
                v-if="tabList.length > 1"
                class="tab-close"
                @click.stop="handleClose(tab.path)"
              >
                <Close />
              </el-icon>
            </span>
          </template>
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- 标签栏操作 -->
    <div class="tabs-actions">
      <el-dropdown
        trigger="click"
        @command="
          (cmd: string) => {
            if (cmd === 'refresh') refreshPage()
            else if (cmd === 'closeAll') closeAll()
          }
        "
      >
        <el-icon :size="16"><MoreFilled /></el-icon>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="refresh">刷新当前页</el-dropdown-item>
            <el-dropdown-item command="closeAll">关闭所有</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>

    <!-- 右键菜单 -->
    <Teleport to="body">
      <div
        v-show="contextMenuVisible"
        class="context-menu"
        :style="{ left: contextMenuPosition.x + 'px', top: contextMenuPosition.y + 'px' }"
      >
        <div class="context-item" @click="refreshPage">刷新当前页</div>
        <el-divider style="margin: 4px 0" />
        <div class="context-item" @click="handleClose(selectedTab)">关闭</div>
        <div class="context-item" @click="closeOther">关闭其他</div>
        <div class="context-item" @click="closeLeft">关闭左侧</div>
        <div class="context-item" @click="closeRight">关闭右侧</div>
        <el-divider style="margin: 4px 0" />
        <div class="context-item" @click="closeAll">关闭所有</div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.tabs-container {
  display: flex;
  align-items: center;
  height: 40px;
  padding: 0 12px;
  background: var(--el-bg-color-page);
  border-bottom: 1px solid var(--el-border-color-light);
  gap: 8px;
}

.tabs-wrapper {
  flex: 1;
  overflow: hidden;
}

.custom-tabs {
  height: 38px;
}

.custom-tabs :deep(.el-tabs__header) {
  margin: 0;
  border-bottom: none;
}

.custom-tabs :deep(.el-tabs__nav) {
  border: none;
}

.custom-tabs :deep(.el-tabs__item) {
  height: 32px;
  line-height: 32px;
  border: 1px solid var(--el-border-color-light) !important;
  border-radius: 4px;
  margin-right: 4px;
  background: var(--el-fill-color-light);
  font-size: 13px;
}

.custom-tabs :deep(.el-tabs__item.is-active) {
  background: var(--el-color-primary);
  color: #fff;
  border-color: var(--el-color-primary) !important;
}

.tab-label {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 0 4px;
}

.tab-close {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  transition: background-color 0.2s;
}

.tab-close:hover {
  background-color: rgba(255, 255, 255, 0.3);
}

.tabs-actions {
  display: flex;
  align-items: center;
  color: var(--el-text-color-secondary);
  cursor: pointer;
}

.tabs-actions:hover {
  color: var(--el-color-primary);
}

.context-menu {
  position: fixed;
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color);
  border-radius: 6px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.12);
  padding: 4px 0;
  z-index: 9999;
  min-width: 140px;
}

.context-item {
  padding: 6px 16px;
  font-size: 13px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.context-item:hover {
  background-color: var(--el-fill-color-light);
  color: var(--el-color-primary);
}
</style>
