<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useAppStore } from '@/stores/app'
import defaultSettings from '@/config/settings'
import ThemeSetting from '@/components/ThemeSetting/index.vue'

const router = useRouter()
const userStore = useUserStore()
const appStore = useAppStore()

// 主题设置组件
const themeSettingRef = ref()

// 配置
const showBreadcrumb = computed(() => defaultSettings.layout.showBreadcrumb)
const title = computed(() => defaultSettings.title)

// 用户信息
const userInfo = computed(() => userStore.userInfo)
const username = computed(() => userInfo.value?.username || '管理员')
const avatar = computed(() => userInfo.value?.avatar || '')

// 下拉菜单
const handleCommand = (command: string) => {
  switch (command) {
    case 'profile':
      router.push('/profile')
      break
    case 'settings':
      themeSettingRef.value?.open()
      break
    case 'logout':
      handleLogout()
      break
  }
}

// 退出登录
const handleLogout = () => {
  userStore.logout()
  router.push('/login')
}

// 面包屑数据
const breadcrumbs = computed(() => {
  const matched = router.currentRoute.value.matched.filter(
    item => item.meta && item.meta.title
  )
  return matched.map(item => ({
    title: item.meta?.title as string,
    path: item.path
  }))
})

// 打开主题设置
const openThemeSetting = () => {
  themeSettingRef.value?.open()
}
</script>

<template>
  <div class="header-container">
    <!-- 左侧：面包屑 -->
    <div class="header-left">
      <el-breadcrumb v-if="showBreadcrumb" separator="/">
        <el-breadcrumb-item v-for="item in breadcrumbs" :key="item.path">
          <router-link v-if="item.path" :to="item.path" class="breadcrumb-link">
            {{ item.title }}
          </router-link>
          <span v-else>{{ item.title }}</span>
        </el-breadcrumb-item>
      </el-breadcrumb>
      <span v-else class="header-title">{{ title }}</span>
    </div>

    <!-- 右侧：工具栏 -->
    <div class="header-right">
      <!-- 全屏 -->
      <el-tooltip content="全屏" placement="bottom">
        <el-icon class="header-icon" @click="appStore.toggleFullscreen">
          <FullScreen />
        </el-icon>
      </el-tooltip>

      <!-- 主题切换 -->
      <el-tooltip content="主题设置" placement="bottom">
        <el-icon class="header-icon" @click="openThemeSetting">
          <Setting />
        </el-icon>
      </el-tooltip>

      <!-- 用户下拉菜单 -->
      <el-dropdown class="header-user" trigger="click" @command="handleCommand">
        <div class="user-info">
          <el-avatar :size="32" :src="avatar">
            {{ username.charAt(0).toUpperCase() }}
          </el-avatar>
          <span class="username">{{ username }}</span>
          <el-icon><ArrowDown /></el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="profile">
              <el-icon><User /></el-icon>
              个人中心
            </el-dropdown-item>
            <el-dropdown-item command="settings">
              <el-icon><Setting /></el-icon>
              主题设置
            </el-dropdown-item>
            <el-dropdown-item divided command="logout">
              <el-icon><SwitchButton /></el-icon>
              退出登录
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>

    <!-- 主题设置面板 -->
    <ThemeSetting ref="themeSettingRef" />
  </div>
</template>

<style scoped>
.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 50px;
  padding: 0 16px;
  background-color: var(--header-bg);
}

.header-left {
  display: flex;
  align-items: center;
}

.header-title {
  font-size: 16px;
  font-weight: 500;
  color: var(--header-text-color);
}

.breadcrumb-link {
  color: var(--text-color-regular);
  text-decoration: none;
  transition: color 0.2s;
}

.breadcrumb-link:hover {
  color: var(--el-color-primary);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-icon {
  font-size: 18px;
  cursor: pointer;
  color: var(--header-text-color);
  transition: color 0.3s;
}

.header-icon:hover {
  color: var(--el-color-primary);
}

.header-user {
  cursor: pointer;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.username {
  font-size: 14px;
  color: var(--header-text-color);
}

/* 下拉菜单图标 */
:deep(.el-dropdown-menu__item) {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>