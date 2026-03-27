/**
 * 本地存储工具
 */

const PREFIX = 'aohoyo_'

/**
 * 存储数据
 */
export function setStorage<T>(key: string, value: T): void {
  const data = JSON.stringify(value)
  localStorage.setItem(PREFIX + key, data)
}

/**
 * 读取数据
 */
export function getStorage<T>(key: string, defaultValue?: T): T | null {
  const data = localStorage.getItem(PREFIX + key)
  if (data === null) {
    return defaultValue ?? null
  }
  try {
    return JSON.parse(data) as T
  } catch {
    return defaultValue ?? null
  }
}

/**
 * 删除数据
 */
export function removeStorage(key: string): void {
  localStorage.removeItem(PREFIX + key)
}

/**
 * 清空所有数据
 */
export function clearStorage(): void {
  const keys = Object.keys(localStorage)
  keys.forEach(key => {
    if (key.startsWith(PREFIX)) {
      localStorage.removeItem(key)
    }
  })
}

/**
 * Session 存储数据
 */
export function setSession<T>(key: string, value: T): void {
  const data = JSON.stringify(value)
  sessionStorage.setItem(PREFIX + key, data)
}

/**
 * Session 读取数据
 */
export function getSession<T>(key: string, defaultValue?: T): T | null {
  const data = sessionStorage.getItem(PREFIX + key)
  if (data === null) {
    return defaultValue ?? null
  }
  try {
    return JSON.parse(data) as T
  } catch {
    return defaultValue ?? null
  }
}

/**
 * Session 删除数据
 */
export function removeSession(key: string): void {
  sessionStorage.removeItem(PREFIX + key)
}

/**
 * Session 清空所有数据
 */
export function clearSession(): void {
  const keys = Object.keys(sessionStorage)
  keys.forEach(key => {
    if (key.startsWith(PREFIX)) {
      sessionStorage.removeItem(key)
    }
  })
}