import { defineStore } from 'pinia'

export interface UserInfo {
  id?: number
  username?: string
  nickname?: string
  avatar?: string
  email?: string
  phone?: string
  roles?: string[]
  permissions?: string[]
}

interface UserState {
  token: string
  userInfo: UserInfo
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    token: '',
    userInfo: {}
  }),

  getters: {
    // 是否已登录
    isLogin: state => !!state.token,
    // 用户名
    username: state => state.userInfo.username || '游客',
    // 头像
    avatar: state => state.userInfo.avatar || '',
    // 角色
    roles: state => state.userInfo.roles || [],
    // 权限
    permissions: state => state.userInfo.permissions || []
  },

  actions: {
    // 设置 Token
    setToken(token: string) {
      this.token = token
    },

    // 设置用户信息
    setUserInfo(userInfo: UserInfo) {
      this.userInfo = userInfo
    },

    // 登录
    async login(username: string, _password: string) {
      // TODO: 调用登录接口
      // 模拟登录
      const token = 'mock-token-' + Date.now()
      this.setToken(token)
      this.setUserInfo({
        id: 1,
        username: username,
        nickname: '管理员',
        avatar: '',
        email: 'admin@aohoyo.com',
        roles: ['admin'],
        permissions: ['*']
      })
      return { token, userInfo: this.userInfo }
    },

    // 获取用户信息
    async getUserInfo() {
      // TODO: 调用获取用户信息接口
      return this.userInfo
    },

    // 退出登录 / 重置
    logout() {
      this.token = ''
      this.userInfo = {}
    }
  },

  persist: true
})
