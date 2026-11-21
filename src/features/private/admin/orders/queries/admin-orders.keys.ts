import type { AdminOrdersQuery } from '../schema/admin-orders.schema'

export const adminOrdersQueryKeys = {
  all: ['admin-orders'] as const,
  list: (query: AdminOrdersQuery) =>
    [...adminOrdersQueryKeys.all, 'list', query] as const,
  detail: (paymentId: string) =>
    [...adminOrdersQueryKeys.all, 'detail', paymentId] as const,
}
