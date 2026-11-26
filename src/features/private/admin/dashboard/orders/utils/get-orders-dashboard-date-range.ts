import type { OrdersDashboardPreset } from '../types/orders-dashboard.types'

export function formatOrdersDashboardLocalDate(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function getOrdersDashboardDateRange(preset: OrdersDashboardPreset, from: string, to: string) {
  if (preset === 'custom') return { dateFrom: from, dateTo: to }
  const today = new Date()
  if (preset === 'today') return { dateFrom: formatOrdersDashboardLocalDate(today), dateTo: formatOrdersDashboardLocalDate(today) }
  if (preset === 'last_30_days') {
    const start = new Date(today)
    start.setDate(today.getDate() - 29)
    return { dateFrom: formatOrdersDashboardLocalDate(start), dateTo: formatOrdersDashboardLocalDate(today) }
  }
  if (preset === 'last_month') {
    const start = new Date(today.getFullYear(), today.getMonth() - 1, 1)
    const end = new Date(today.getFullYear(), today.getMonth(), 0)
    return { dateFrom: formatOrdersDashboardLocalDate(start), dateTo: formatOrdersDashboardLocalDate(end) }
  }
  if (preset === 'this_month') {
    return {
      dateFrom: formatOrdersDashboardLocalDate(new Date(today.getFullYear(), today.getMonth(), 1)),
      dateTo: formatOrdersDashboardLocalDate(today),
    }
  }
  const monday = new Date(today)
  monday.setDate(today.getDate() - ((today.getDay() + 6) % 7))
  return { dateFrom: formatOrdersDashboardLocalDate(monday), dateTo: formatOrdersDashboardLocalDate(today) }
}
