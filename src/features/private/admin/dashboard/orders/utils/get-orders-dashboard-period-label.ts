import type { OrdersDashboardFilters } from '../types/orders-dashboard.types'

export function getOrdersDashboardPeriodLabel(filters: OrdersDashboardFilters) {
  switch (filters.preset) {
    case 'today': return 'Hoje'
    case 'this_week': return 'Esta semana'
    case 'this_month': return 'Este mês'
    case 'last_30_days': return 'Últimos 30 dias'
    case 'last_month': return 'Mês passado'
    default: return `${filters.dateFrom} a ${filters.dateTo}`
  }
}
