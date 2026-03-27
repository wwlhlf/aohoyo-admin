<script setup lang="ts">
import { computed } from 'vue'
import { useAppStore } from '@/stores/app'
import { useThemeStore } from '@/stores/theme'
import Sidebar from './Sidebar.vue'
import Header from './Header.vue'
import Tabs from './Tabs.vue'
import defaultSettings from '@/config/settings'

const appStore = useAppStore()
const themeStore = useThemeStore()

// 布局配置
const sidebarWidth = computed(() =>
  appStore.sidebarCollapsed
    ? defaultSettings.layout.sidebarCollapsedWidth
    : defaultSettings.layout.sidebarWidth
)

const fixedSidebar = computed(() => defaultSettings.layout.fixedSidebar)
const showFooter = computed(() => defaultSettings.layout.showFooter)
const tabsEnabled = computed(() => defaultSettings.tabs.enabled)

// 侧边栏主题类
const sidebarThemeClass = computed(() => 
  `sidebar-${themeStore.sidebarTheme}`
)

// 头部主题类
const headerThemeClass = computed(() => 
  `header-${themeStore.headerTheme}`
)
</script>

<template>
  <el-container class="layout-container">
    <!-- 侧边栏 -->
    <el-aside
      :width="`${sidebarWidth}px`"
      :class="['layout-sidebar', sidebarThemeClass, { 'is-fixed': fixedSidebar }]"
    >
      <Sidebar />
    </el-aside>

    <!-- 主内容区 -->
    <el-container 
      class="layout-main"
      :style="fixedSidebar ? { marginLeft: `${sidebarWidth}px` } : {}"
    >
      <!-- 头部 -->
      <el-header
        :class="['layout-header', headerThemeClass]"
        :height="tabsEnabled ? '80px' : '50px'"
      >
        <Header />
        <Tabs v-if="tabsEnabled" />
      </el-header>

      <!-- 内容区 -->
      <el-main class="layout-content">
        <router-view v-slot="{ Component, route }">
          <transition
            :name="defaultSettings.theme.animation ? 'fade-slide' : ''"
            mode="out-in"
          >
            <keep-alive :include="[]">
              <component :is="Component" :key="route.path" />
            </keep-alive>
          </transition>
        </router-view>
      </el-main>

      <!-- 页脚 -->
      <el-footer v-if="showFooter" class="layout-footer" height="40px">
        <span>© 2026 Aohoyo Admin. Made with ❤️</span>
      </el-footer>
    </el-container>
  </el-container>
</template>

<style scoped>
.layout-container {
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.layout-sidebar {
  background-color: var(--sidebar-bg);
  border-right: 1px solid var(--border-color, #e4e7ed);
  transition: width 0.3s ease, background-color 0.3s ease;
  overflow: hidden;
  flex-shrink: 0;
}

.layout-sidebar.is-fixed {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  z-index: 100;
}

.layout-main {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
  background-color: var(--bg-color-page);
  transition: margin-left 0.3s ease;
}

.layout-header {
  display: flex;
  flex-direction: column;
  background-color: var(--header-bg);
  border-bottom: 1px solid var(--border-color, #e4e7ed);
  padding: 0;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  z-index: 99;
  transition: background-color 0.3s ease;
}

.layout-content {
  flex: 1;
  padding: 16px;
  overflow: auto;
  background-color: var(--bg-color-page);
}

.layout-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  color: var(--text-color-secondary, #909399);
  font-size: 12px;
}

/* 过渡动画 */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(10px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}
</style>