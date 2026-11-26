import { useQuery } from '@tanstack/react-query'
import { getOrdersDashboardService } from '../services/orders-dashboard.service'
import { ordersDashboardQueryKeys } from '../endpoints-keys/orders-dashboard.keys'
import type { OrdersDashboardQuery } from '../types/orders-dashboard.types'

export function useOrdersDashboardComparisonQuery(query: OrdersDashboardQuery) {
  return useQuery({
    queryKey: ordersDashboardQueryKeys.comparison(query),
    queryFn: () => getOrdersDashboardService(query),
  })
}
