<script setup lang="ts">
import { onMounted, defineAsyncComponent } from 'vue'
import { RouterView } from 'vue-router'
import { useThemeStore } from '@/stores/theme'
import { useTabsStore } from '@/stores/tabs'

// 异步加载全局组件（减少首屏加载时间）
const GlobalLoading = defineAsyncComponent(() => import('@/components/GlobalLoading/index.vue'))
const LockScreen = defineAsyncComponent(() => import('@/components/LockScreen/index.vue'))

const themeStore = useThemeStore()
const tabsStore = useTabsStore()

onMounted(() => {
  themeStore.initTheme()
  tabsStore.migrateAllIcons()
})
</script>

<template>
  <RouterView />
  <GlobalLoading />
  <LockScreen />
</template>

<style>
#app {
  width: 100%;
  height: 100%;
}
</style>
