import type { MockMethod } from 'vite-plugin-mock'

// 模拟用户数据
const users = [
  { id: 1, username: 'admin', nickname: '超级管理员', email: 'admin@aohoyo.com', phone: '13800138000', status: 1, createTime: '2026-01-01 00:00:00', roles: ['admin'] },
  { id: 2, username: 'zhangsan', nickname: '张三', email: 'zhangsan@aohoyo.com', phone: '13800138001', status: 1, createTime: '2026-02-01 10:00:00', roles: ['user'] },
  { id: 3, username: 'lisi', nickname: '李四', email: 'lisi@aohoyo.com', phone: '13800138002', status: 1, createTime: '2026-02-15 14:30:00', roles: ['user'] },
  { id: 4, username: 'wangwu', nickname: '王五', email: 'wangwu@aohoyo.com', phone: '13800138003', status: 0, createTime: '2026-03-01 09:00:00', roles: ['user'] }
]

// 模拟角色数据
const roles = [
  { id: 1, name: '超级管理员', code: 'admin', description: '拥有所有权限', status: 1, permissions: ['*'], createTime: '2026-01-01 00:00:00' },
  { id: 2, name: '普通用户', code: 'user', description: '普通用户权限', status: 1, permissions: ['dashboard:view', 'profile:view'], createTime: '2026-01-01 00:00:00' }
]

// 模拟菜单数据
const menus = [
  { id: 1, parentId: 0, name: '首页', path: '/dashboard', icon: 'ep:home-filled', sort: 1, status: 1 },
  { id: 2, parentId: 0, name: '系统管理', path: '/system', icon: 'ep:setting', sort: 2, status: 1 },
  { id: 3, parentId: 2, name: '用户管理', path: '/system/user', icon: 'ep:user', sort: 1, status: 1 },
  { id: 4, parentId: 2, name: '角色管理', path: '/system/role', icon: 'ep:user-filled', sort: 2, status: 1 },
  { id: 5, parentId: 2, name: '菜单管理', path: '/system/menu', icon: 'ep:menu', sort: 3, status: 1 },
  { id: 6, parentId: 0, name: '示例页面', path: '/example', icon: 'ep:document', sort: 3, status: 1 },
  { id: 7, parentId: 6, name: '表格示例', path: '/example/table', icon: 'ep:grid', sort: 1, status: 1 },
  { id: 8, parentId: 6, name: '表单示例', path: '/example/form', icon: 'ep:edit-pen', sort: 2, status: 1 }
]

export default [
  // 用户列表
  {
    url: '/api/system/user/list',
    method: 'get',
    response: ({ query }: { query: { page: number; pageSize: number; keyword?: string } }) => {
      const { page = 1, pageSize = 10, keyword } = query

      let list = users
      if (keyword) {
        list = list.filter(u => u.username.includes(keyword) || u.nickname.includes(keyword))
      }

      return {
        code: 200,
        data: {
          list: list.slice((page - 1) * pageSize, page * pageSize),
          total: list.length
        },
        message: 'success'
      }
    }
  },

  // 角色列表
  {
    url: '/api/system/role/list',
    method: 'get',
    response: ({ query }: { query: { page: number; pageSize: number } }) => {
      const { page = 1, pageSize = 10 } = query

      return {
        code: 200,
        data: {
          list: roles.slice((page - 1) * pageSize, page * pageSize),
          total: roles.length
        },
        message: 'success'
      }
    }
  },

  // 菜单列表
  {
    url: '/api/system/menu/list',
    method: 'get',
    response: () => {
      return {
        code: 200,
        data: menus,
        message: 'success'
      }
    }
  }
] as MockMethod[]