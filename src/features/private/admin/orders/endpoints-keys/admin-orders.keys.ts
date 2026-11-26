import type { AdminOrdersQuery } from '../types/admin-orders.types'

export const adminOrdersQueryKeys = {
  all: ['admin-orders'] as const,
  lists: () => [...adminOrdersQueryKeys.all, 'list'] as const,
  list: (query: AdminOrdersQuery) => [...adminOrdersQueryKeys.lists(), query] as const,
  details: () => [...adminOrdersQueryKeys.all, 'detail'] as const,
  detail: (paymentId: string) => [...adminOrdersQueryKeys.details(), paymentId] as const,
}
