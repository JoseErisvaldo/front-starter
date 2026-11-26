import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deactivateSubscriptionPlanService } from '../services/deactivate-subscription-plan.service'
import { adminSubscriptionsQueryKeys } from '../endpoints-keys/admin-subscriptions.keys'

export function useDeactivateSubscriptionPlanMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deactivateSubscriptionPlanService,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: adminSubscriptionsQueryKeys.plans() }),
  })
}
