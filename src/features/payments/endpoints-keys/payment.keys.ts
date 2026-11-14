export const paymentQueryKeys = {
  all: ['payments'] as const,
  detail: (id: string) => [...paymentQueryKeys.all, 'detail', id] as const,
}
