import { useQuery } from '@tanstack/react-query'
import { getAdminOrderDetailsService } from '../services/get-admin-order-details.service'
import { adminOrdersQueryKeys } from './admin-orders.keys'

export function useAdminOrderDetailsQuery(paymentId: string) {
  return useQuery({
    queryKey: adminOrdersQueryKeys.detail(paymentId),
    queryFn: () => getAdminOrderDetailsService(paymentId),
  })
}
