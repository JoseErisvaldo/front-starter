import type { AdminCustomersQuery } from '../types/admin-customers.types'

export const adminCustomersQueryKeys = {
  all: ['admin-customers'] as const,
  lists: () => [...adminCustomersQueryKeys.all, 'list'] as const,
  list: (query: AdminCustomersQuery) => [...adminCustomersQueryKeys.lists(), query] as const,
  details: () => [...adminCustomersQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...adminCustomersQueryKeys.details(), id] as const,
}
