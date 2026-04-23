import type { MockMethod } from 'vite-plugin-mock'

const mockUsers = [
  {
    id: 1,
    username: 'admin',
    nickname: '超级管理员',
    email: 'admin@aohoyo.com',
    phone: '13800138000',
    status: 1,
    roles: ['admin'],
    createTime: '2026-01-01 00:00:00'
  },
  {
    id: 2,
    username: 'zhangsan',
    nickname: '张三',
    email: 'zhangsan@aohoyo.com',
    phone: '13800138001',
    status: 1,
    roles: ['user'],
    createTime: '2026-02-01 10:00:00'
  },
  {
    id: 3,
    username: 'lisi',
    nickname: '李四',
    email: 'lisi@aohoyo.com',
    phone: '13800138002',
    status: 1,
    roles: ['user'],
    createTime: '2026-02-15 14:30:00'
  },
  {
    id: 4,
    username: 'wangwu',
    nickname: '王五',
    email: 'wangwu@aohoyo.com',
    phone: '13800138003',
    status: 0,
    roles: ['user'],
    createTime: '2026-03-01 09:00:00'
  }
]

export default [
  {
    url: '/api/auth/login',
    method: 'post',
    response: ({ body }: { body: { username: string; password: string } }) => {
      if (body.username === 'admin' && body.password === 'admin123') {
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
      return { code: 401, data: null, message: '用户名或密码错误' }
    }
  },
  {
    url: '/api/user/info',
    method: 'get',
    response: () => ({
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
    })
  },
  {
    url: '/api/auth/logout',
    method: 'post',
    response: () => ({ code: 200, data: null, message: '退出成功' })
  }
] as MockMethod[]
