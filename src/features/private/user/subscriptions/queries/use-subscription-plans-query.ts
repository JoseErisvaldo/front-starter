import { useQuery } from '@tanstack/react-query'
import { subscriptionPlansQueryKeys } from '../endpoints-keys/subscription-plans.keys'
import { getSubscriptionPlansService } from '../services/get-subscription-plans.service'

export function useSubscriptionPlansQuery(enabled: boolean) {
  return useQuery({
    queryKey: subscriptionPlansQueryKeys.all,
    queryFn: getSubscriptionPlansService,
    enabled,
  })
}
