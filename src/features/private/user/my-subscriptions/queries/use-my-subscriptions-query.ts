import { useQuery } from '@tanstack/react-query'
import { mySubscriptionsQueryKeys } from '../endpoints-keys/my-subscriptions.keys'
import { getMySubscriptionsService } from '../services/get-my-subscriptions.service'

export function useMySubscriptionsQuery(enabled: boolean, polling: boolean) {
  return useQuery({
    queryKey: mySubscriptionsQueryKeys.all,
    queryFn: getMySubscriptionsService,
    refetchInterval: polling ? 2500 : false,
    enabled,
  })
}
