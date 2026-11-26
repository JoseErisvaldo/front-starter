export const paymentQueryKeys = {
  all: ['payments'] as const,
  list: (page: number, pageSize: number) =>
    [...paymentQueryKeys.all, 'list', page, pageSize] as const,
  detail: (id: string) => [...paymentQueryKeys.all, 'detail', id] as const,
}
