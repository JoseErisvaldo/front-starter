import { useQuery } from '@tanstack/react-query'
import { adminCustomersQueryKeys } from '../endpoints-keys/admin-customers.keys'
import { getAdminCustomerDetailsService } from '../services/admin-customers.service'

export function useAdminCustomerDetailsQuery(customerId: string) {
  return useQuery({
    queryKey: adminCustomersQueryKeys.detail(customerId),
    queryFn: () => getAdminCustomerDetailsService(customerId),
  })
}
