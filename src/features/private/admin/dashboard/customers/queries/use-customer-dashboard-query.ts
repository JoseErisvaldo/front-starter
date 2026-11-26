import { useQuery } from '@tanstack/react-query'
import { getCustomerDashboardService } from '../services/customer-dashboard.service'
import { customerDashboardQueryKeys } from '../endpoints-keys/customer-dashboard.keys'

export function useCustomerDashboardQuery() {
  return useQuery({
    queryKey: customerDashboardQueryKeys.overview(),
    queryFn: getCustomerDashboardService,
  })
}
