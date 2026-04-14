import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { hasPermission } from '@/utils/permission'
import type { Router } from 'vue-router'
import { useUserStore } from '@/stores/user'
import i18n from '@/locales'
import defaultSettings from '@/config/settings'

// 白名单路由
const whiteList = ['/login', '/404']

/**
 * 设置路由守卫
 */
export function setupRouterGuards(router: Router) {
  // 前置守卫
  router.beforeEach((to, _from, next) => {
    NProgress.start()

    // 设置页面标题
    const title = to.meta?.title
    if (title) {
      document.title = `${i18n.global.t(title as string)} | ${defaultSettings.title}`
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
        // 检查页面所需权限
        const requiredPermission = to.meta?.permission as string | string[]
        if (requiredPermission && !hasPermission(requiredPermission)) {
          next('/404')
          return
        }
        next()
      }
    } else {
      // 未登录
      if (whiteList.includes(to.path)) {
        // 在白名单中，直接进入
        next()
      } else {
        // 不在白名单，重定向到登录页
        // 防止 redirect 指向自身导致循环
        const redirect = to.path === '/login' ? undefined : to.fullPath
        next({ path: '/login', ...(redirect ? { query: { redirect } } : {}) })
      }
    }
  })

  // 后置守卫
  router.afterEach(() => {
    NProgress.done()
  })

  // 错误处理
  router.onError(error => {
    console.error('路由错误:', error)
  })
}
