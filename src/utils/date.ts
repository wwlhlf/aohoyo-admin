import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import relativeTime from 'dayjs/plugin/relativeTime'

// 配置 dayjs
dayjs.locale('zh-cn')
dayjs.extend(relativeTime)

/**
 * 格式化日期
 */
export function formatDate(date: string | Date | number, format = 'YYYY-MM-DD HH:mm:ss'): string {
  if (!date) return ''
  return dayjs(date).format(format)
}

/**
 * 获取相对时间
 */
export function fromNow(date: string | Date | number): string {
  if (!date) return ''
  return dayjs(date).fromNow()
}

/**
 * 获取今天日期
 */
export function getToday(format = 'YYYY-MM-DD'): string {
  return dayjs().format(format)
}

/**
 * 获取本周第一天
 */
export function getWeekStart(format = 'YYYY-MM-DD'): string {
  return dayjs().startOf('week').format(format)
}

/**
 * 获取本月第一天
 */
export function getMonthStart(format = 'YYYY-MM-DD'): string {
  return dayjs().startOf('month').format(format)
}

/**
 * 日期比较
 */
export function isBefore(date1: string | Date, date2: string | Date): boolean {
  return dayjs(date1).isBefore(dayjs(date2))
}

/**
 * 日期加法
 */
export function addDate(date: string | Date, value: number, unit: dayjs.ManipulateType = 'day'): string {
  return dayjs(date).add(value, unit).format('YYYY-MM-DD')
}

/**
 * 日期减法
 */
export function subtractDate(date: string | Date, value: number, unit: dayjs.ManipulateType = 'day'): string {
  return dayjs(date).subtract(value, unit).format('YYYY-MM-DD')
}

export { dayjs }