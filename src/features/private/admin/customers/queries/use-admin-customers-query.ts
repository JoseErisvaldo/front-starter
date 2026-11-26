import { keepPreviousData, useQuery } from '@tanstack/react-query'
import type { AdminCustomersQuery } from '../types/admin-customers.types'
import { adminCustomersQueryKeys } from '../endpoints-keys/admin-customers.keys'
import { getAdminCustomersService } from '../services/admin-customers.service'

export function useAdminCustomersQuery(query: AdminCustomersQuery) {
  return useQuery({
    queryKey: adminCustomersQueryKeys.list(query),
    queryFn: () => getAdminCustomersService(query),
    placeholderData: keepPreviousData,
  })
}
