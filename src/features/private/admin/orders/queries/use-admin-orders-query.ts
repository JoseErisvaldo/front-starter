import { keepPreviousData, useQuery } from '@tanstack/react-query'
import type { AdminOrdersQuery } from '../types/admin-orders.types'
import { getAdminOrdersService } from '../services/get-admin-orders.service'
import { adminOrdersQueryKeys } from '../endpoints-keys/admin-orders.keys'

export function useAdminOrdersQuery(query: AdminOrdersQuery) {
  return useQuery({
    queryKey: adminOrdersQueryKeys.list(query),
    queryFn: () => getAdminOrdersService(query),
    placeholderData: keepPreviousData,
  })
}
