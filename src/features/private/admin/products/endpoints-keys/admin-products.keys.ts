import type { AdminProductsQuery } from '../schema/admin-products.schema'

export const adminProductsQueryKeys = {
  all: ['admin-products'] as const,
  list: (query: AdminProductsQuery) => [...adminProductsQueryKeys.all, query] as const,
}
