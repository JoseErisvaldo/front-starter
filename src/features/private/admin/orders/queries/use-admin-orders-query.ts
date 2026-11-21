import { keepPreviousData, useQuery } from '@tanstack/react-query'
import type { AdminOrdersQuery } from '../schema/admin-orders.schema'
import { getAdminOrdersService } from '../services/get-admin-orders.service'
import { adminOrdersQueryKeys } from './admin-orders.keys'

export function useAdminOrdersQuery(query: AdminOrdersQuery) {
  return useQuery({
    queryKey: adminOrdersQueryKeys.list(query),
    queryFn: () => getAdminOrdersService(query),
    placeholderData: keepPreviousData,
  })
}
