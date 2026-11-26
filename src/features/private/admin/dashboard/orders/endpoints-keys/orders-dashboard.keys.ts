import type { OrdersDashboardQuery } from '../types/orders-dashboard.types'

export const ordersDashboardQueryKeys = {
  all: ['admin-orders-dashboard'] as const,
  overview: (query: OrdersDashboardQuery) => [...ordersDashboardQueryKeys.all, query] as const,
  comparison: (query: OrdersDashboardQuery) =>
    [...ordersDashboardQueryKeys.all, query, 'comparison'] as const,
}
