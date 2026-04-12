import { createI18n } from 'vue-i18n'
import zhCN from './zh-CN'
import enUS from './en-US'

type AppLocale = 'zh-CN' | 'en-US'

// 获取存储的语言或浏览器语言
function getLocale(): string {
  const stored = localStorage.getItem('locale')
  if (stored) return stored

  const browserLang = navigator.language.toLowerCase()
  if (browserLang.startsWith('zh')) return 'zh-CN'
  return 'en-US'
}

const i18n = createI18n({
  locale: getLocale(),
  fallbackLocale: 'zh-CN',
  legacy: false,
  globalInjection: true,
  messages: {
    'zh-CN': zhCN,
    'en-US': enUS
  }
})

// 切换语言
export function setLocale(locale: string): void {
  i18n.global.locale.value = locale as AppLocale
  localStorage.setItem('locale', locale)
  document.documentElement.setAttribute('lang', locale)
}

// 获取当前语言
export function getLocaleValue(): string {
  return i18n.global.locale.value as string
}

export default i18n
