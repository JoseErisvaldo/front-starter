import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getAdminOrdersService } from '../services/get-admin-orders.service'
import { adminOrdersQueryKeys } from './admin-orders.keys'

export function useAdminOrdersQuery(page: number, pageSize: number) {
  return useQuery({
    queryKey: adminOrdersQueryKeys.list(page, pageSize),
    queryFn: () => getAdminOrdersService(page, pageSize),
    placeholderData: keepPreviousData,
  })
}
