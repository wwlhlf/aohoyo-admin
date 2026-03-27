<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import { useThemeStore } from '@/stores/theme'
import { useTabsStore } from '@/stores/tabs'
import GlobalLoading from '@/components/GlobalLoading/index.vue'

const themeStore = useThemeStore()
const tabsStore = useTabsStore()

// 应用启动时初始化
onMounted(() => {
  // 初始化主题
  themeStore.initTheme()
  // 迁移标签图标格式
  tabsStore.migrateAllIcons()
})
</script>

<template>
  <RouterView />
  <GlobalLoading />
</template>

<style>
#app {
  width: 100%;
  height: 100%;
}
</style>