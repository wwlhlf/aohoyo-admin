import request from '../request'
import type { UserInfo } from '@/stores/user'

// 登录参数
export interface LoginParams {
  username: string
  password: string
}

// 登录响应
export interface LoginResponse {
  token: string
  userInfo: UserInfo
}

/**
 * 用户登录
 */
export function login(data: LoginParams) {
  return request.post<LoginResponse>('/auth/login', data)
}

/**
 * 获取用户信息
 */
export function getUserInfo() {
  return request.get<UserInfo>('/user/info')
}

/**
 * 退出登录
 */
export function logout() {
  return request.post('/auth/logout')
}

/**
 * 刷新 Token
 */
export function refreshToken() {
  return request.post<{ token: string }>('/auth/refresh')
}
