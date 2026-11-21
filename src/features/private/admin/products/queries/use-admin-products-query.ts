import { keepPreviousData, useQuery } from '@tanstack/react-query'
import type { AdminProductsQuery } from '../schema/admin-products.schema'
import { adminProductsQueryKeys } from '../endpoints-keys/admin-products.keys'
import { getAdminProductsService } from '../services/get-admin-products.service'

export function useAdminProductsQuery(query: AdminProductsQuery) {
  return useQuery({
    queryKey: adminProductsQueryKeys.list(query),
    queryFn: () => getAdminProductsService(query),
    placeholderData: keepPreviousData,
  })
}
