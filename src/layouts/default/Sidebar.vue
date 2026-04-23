<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAppStore } from '@/stores/app'
import defaultSettings from '@/config/settings'
import type { RouteRecordRaw } from 'vue-router'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const appStore = useAppStore()

// 递归过滤路由，只显示需要显示的菜单
const filterMenus = (routes: RouteRecordRaw[]): RouteRecordRaw[] => {
  return routes
    .filter(r => !r.meta?.hidden)
    .map(r => {
      if (r.children && r.children.length > 0) {
        return {
          ...r,
          children: filterMenus(r.children)
        }
      }
      return r
    })
    .filter(r => {
      if (r.children && r.children.length === 0) return false
      return true
    })
}

const menuItems = computed(() => {
  const routes = router.options.routes
  const menus = routes.filter(r => !r.meta?.hidden && r.component)
  return filterMenus(menus)
})

const activeMenu = computed(() => route.path)
const isCollapsed = computed(() => appStore.sidebarCollapsed)
const isMobile = computed(() => appStore.device === 'mobile')
const showLogo = computed(() => defaultSettings.layout.showLogo)
const title = computed(() => defaultSettings.title)
const logo = computed(() => defaultSettings.logo)

const handleSelect = (path: string) => {
  router.push(path)
  if (isMobile.value) {
    appStore.closeMobileSidebar()
  }
}

const toggleCollapse = () => {
  appStore.toggleSidebar()
}
</script>

<template>
  <div class="sidebar-container">
    <div v-if="showLogo" class="sidebar-logo" @click="router.push('/dashboard')">
      <img :src="logo" alt="Logo" class="logo-img" />
      <span v-show="!isCollapsed || isMobile" class="logo-text">{{ title }}</span>
    </div>

    <el-scrollbar class="sidebar-menu-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="!isMobile && isCollapsed"
        :collapse-transition="false"
        :unique-opened="true"
        :router="false"
        background-color="transparent"
        text-color="var(--sidebar-text-color)"
        active-text-color="var(--el-color-primary)"
        @select="handleSelect"
      >
        <template v-for="item in menuItems" :key="item.path">
          <!-- 有子菜单 -->
          <el-sub-menu v-if="item.children && item.children.length > 0" :index="item.path">
            <template #title>
              <el-icon v-if="item.meta?.icon"><component :is="item.meta.icon" /></el-icon>
              <span>{{ t(item.meta?.title as string) }}</span>
            </template>

            <template v-for="child in item.children" :key="child.path">
              <!-- 三级菜单 -->
              <el-sub-menu
                v-if="child.children && child.children.length > 0"
                :index="`${item.path}/${child.path}`"
              >
                <template #title>
                  <el-icon v-if="child.meta?.icon">
                    <component :is="child.meta.icon" />
                  </el-icon>
                  <span>{{ t(child.meta?.title as string) }}</span>
                </template>
                <el-menu-item
                  v-for="subChild in child.children"
                  :key="subChild.path"
                  :index="`${item.path}/${child.path}/${subChild.path}`"
                >
                  <el-icon v-if="subChild.meta?.icon">
                    <component :is="subChild.meta.icon" />
                  </el-icon>
                  <span>{{ t(subChild.meta?.title as string) }}</span>
                </el-menu-item>
              </el-sub-menu>

              <!-- 普通二级菜单 -->
              <el-menu-item
                v-else
                :index="item.path === '/' ? `/${child.path}` : `${item.path}/${child.path}`"
              >
                <el-icon v-if="child.meta?.icon">
                  <component :is="child.meta.icon" />
                </el-icon>
                <template #title>{{ t(child.meta?.title as string) }}</template>
              </el-menu-item>
            </template>
          </el-sub-menu>

          <!-- 无子菜单 -->
          <el-menu-item v-else :index="(item.redirect || item.path) as string">
            <el-icon v-if="item.meta?.icon"><component :is="item.meta.icon" /></el-icon>
            <template #title>{{ t(item.meta?.title as string) }}</template>
          </el-menu-item>
        </template>
      </el-menu>
    </el-scrollbar>

    <!-- 折叠按钮 -->
    <div v-if="!isMobile" class="sidebar-collapse-btn" @click="toggleCollapse">
      <el-icon :size="18">
        <component :is="isCollapsed ? 'ArrowRight' : 'ArrowLeft'" />
      </el-icon>
    </div>
  </div>
</template>

<style scoped>
.sidebar-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: var(--sidebar-bg-color);
}

.sidebar-logo {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  cursor: pointer;
  overflow: hidden;
  white-space: nowrap;
}

.logo-img {
  width: 28px;
  height: 28px;
  margin-right: 10px;
  object-fit: contain;
}

.logo-text {
  font-size: 16px;
  font-weight: 600;
  color: var(--sidebar-text-color);
  overflow: hidden;
  text-overflow: ellipsis;
}

.sidebar-menu-wrapper {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
}

.sidebar-menu-wrapper :deep(.el-scrollbar__wrap) {
  overflow-x: hidden;
}

.sidebar-collapse-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 12px 0;
  cursor: pointer;
  border-top: 1px solid var(--sidebar-border-color);
  color: var(--sidebar-text-color);
  transition: background-color 0.3s;
}

.sidebar-collapse-btn:hover {
  background-color: var(--sidebar-hover-bg-color);
}
</style>
