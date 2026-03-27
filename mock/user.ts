import type { MockMethod } from 'vite-plugin-mock'

export default [
  // 登录
  {
    url: '/api/auth/login',
    method: 'post',
    response: ({ body }: { body: { username: string; password: string } }) => {
      const { username, password } = body

      if (username === 'admin' && password === 'admin123') {
        return {
          code: 200,
          data: {
            token: 'mock-token-' + Date.now(),
            userInfo: {
              id: 1,
              username: 'admin',
              nickname: '超级管理员',
              email: 'admin@aohoyo.com',
              phone: '13800138000',
              avatar: '',
              roles: ['admin'],
              permissions: ['*']
            }
          },
          message: '登录成功'
        }
      }

      return {
        code: 401,
        data: null,
        message: '用户名或密码错误'
      }
    }
  },

  // 获取用户信息
  {
    url: '/api/user/info',
    method: 'get',
    response: () => {
      return {
        code: 200,
        data: {
          id: 1,
          username: 'admin',
          nickname: '超级管理员',
          email: 'admin@aohoyo.com',
          phone: '13800138000',
          avatar: '',
          roles: ['admin'],
          permissions: ['*']
        },
        message: 'success'
      }
    }
  },

  // 退出登录
  {
    url: '/api/auth/logout',
    method: 'post',
    response: () => {
      return {
        code: 200,
        data: null,
        message: '退出成功'
      }
    }
  }
] as MockMethod[]