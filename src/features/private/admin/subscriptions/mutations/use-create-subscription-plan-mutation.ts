import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createSubscriptionPlanService } from '../services/create-subscription-plan.service'
import { adminSubscriptionsQueryKeys } from '../endpoints-keys/admin-subscriptions.keys'

export function useCreateSubscriptionPlanMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createSubscriptionPlanService,
    meta: { skipGlobalError: true },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: adminSubscriptionsQueryKeys.plans() }),
  })
}
