import { useMutation, useQueryClient } from '@tanstack/react-query'
import { mySubscriptionsQueryKeys } from '../endpoints-keys/my-subscriptions.keys'
import { cancelSubscriptionService } from '../services/cancel-subscription.service'

export function useCancelSubscriptionMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: cancelSubscriptionService,
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: mySubscriptionsQueryKeys.all }),
  })
}
