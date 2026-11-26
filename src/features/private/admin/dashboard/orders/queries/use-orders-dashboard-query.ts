import { useQuery } from '@tanstack/react-query'
import { getOrdersDashboardService } from '../services/orders-dashboard.service'
import { ordersDashboardQueryKeys } from '../endpoints-keys/orders-dashboard.keys'
import type { OrdersDashboardQuery } from '../types/orders-dashboard.types'

export function useOrdersDashboardQuery(query: OrdersDashboardQuery) {
  return useQuery({
    queryKey: ordersDashboardQueryKeys.overview(query),
    queryFn: () => getOrdersDashboardService(query),
  })
}
