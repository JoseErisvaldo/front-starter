import { useQuery } from '@tanstack/react-query'
import { getSubscriptionsDashboardService } from '../services/subscriptions-dashboard.service'
import { subscriptionsDashboardQueryKeys } from '../endpoints-keys/subscriptions-dashboard.keys'
import type { SubscriptionsDashboardQuery } from '../types/subscriptions-dashboard.types'

export function useSubscriptionsDashboardComparisonQuery(query: SubscriptionsDashboardQuery) {
  return useQuery({
    queryKey: subscriptionsDashboardQueryKeys.comparison(query),
    queryFn: () => getSubscriptionsDashboardService(query),
  })
}
