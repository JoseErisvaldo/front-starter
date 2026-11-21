export const adminOrdersQueryKeys = {
  all: ['admin-orders'] as const,
  list: (page: number, pageSize: number) =>
    [...adminOrdersQueryKeys.all, 'list', page, pageSize] as const,
  detail: (paymentId: string) =>
    [...adminOrdersQueryKeys.all, 'detail', paymentId] as const,
}
