import type { Router } from 'vue-router'
import { useUserStore } from '@/stores/user'
import defaultSettings from '@/config/settings'

// 白名单路由
const whiteList = ['/login', '/404']

/**
 * 设置路由守卫
 */
export function setupRouterGuards(router: Router) {
  // 前置守卫
  router.beforeEach((to, _from, next) => {
    // 设置页面标题
    const title = to.meta?.title
    if (title) {
      document.title = `${title} | ${defaultSettings.title}`
    } else {
      document.title = defaultSettings.title
    }

    const userStore = useUserStore()
    const token = userStore.token

    if (token) {
      // 已登录
      if (to.path === '/login') {
        // 已登录，去登录页 -> 重定向到首页
        next({ path: '/' })
      } else {
        // 已登录，正常访问
        // TODO: 检查权限
        next()
      }
    } else {
      // 未登录
      if (whiteList.includes(to.path)) {
        // 在白名单中，直接进入
        next()
      } else {
        // 不在白名单，重定向到登录页
        next({ path: '/login', query: { redirect: to.fullPath } })
      }
    }
  })

  // 后置守卫
  router.afterEach(() => {
    // 关闭页面加载进度条（如果有的话）
    // NProgress.done()
  })

  // 错误处理
  router.onError((error) => {
    console.error('路由错误:', error)
  })
}