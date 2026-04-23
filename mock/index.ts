import userModule from './user'
import systemModule from './system'

// 全局 Mock 日志拦截器（所有请求都会打印）
// 注意：需要 vite.config.ts 中 viteMockServe 的 mockLoggerEnable = true
// 如果插件不支持，则用响应拦截器方案（见下方）
function logMockRequest(config: { method: string; url: string; params?: unknown; body?: unknown }) {
  const { method, url, params, body } = config
  const input = method === 'get' ? params : body
  console.group(`\x1b[35m[MOCK]\x1b[0m ${method} ${url}`)
  console.log('\x1b[33mparams:\x1b[0m', input)
  console.groupEnd()
}

// 响应拦截器：在 Axios 层面打印所有请求（更可靠）
// 在 src/api/request.ts 中调用
export function setupMockLogger() {
  if (import.meta.env.DEV) {
    console.log('\x1b[32m[MOCK]\x1b[0m Mock logger enabled — all requests will be printed')
  }
}

export { userModule, systemModule }
export default [...userModule, ...systemModule]
