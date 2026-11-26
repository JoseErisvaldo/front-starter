import type { AdminProductsQuery } from '../types/admin-products.types'

export const adminProductsQueryKeys = {
  all: ['admin-products'] as const,
  list: (query: AdminProductsQuery) => [...adminProductsQueryKeys.all, query] as const,
}
