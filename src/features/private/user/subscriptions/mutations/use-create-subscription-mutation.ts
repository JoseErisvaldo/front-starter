import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createSubscriptionService } from '../services/create-subscription.service'
import { mySubscriptionsQueryKeys } from '../../my-subscriptions/endpoints-keys/my-subscriptions.keys'
import type { CreatedSubscription, CreateSubscriptionInput } from '../types/subscription-plans.types'

export function useCreateSubscriptionMutation(onSuccess: (subscription: CreatedSubscription) => void) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateSubscriptionInput) => createSubscriptionService(input),
    onSuccess: async (subscription) => {
      await queryClient.invalidateQueries({ queryKey: mySubscriptionsQueryKeys.all })
      onSuccess(subscription)
    },
  })
}
