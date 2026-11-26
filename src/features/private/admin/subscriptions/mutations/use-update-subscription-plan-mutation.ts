import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateSubscriptionPlanService } from '../services/update-subscription-plan.service'
import { adminSubscriptionsQueryKeys } from '../endpoints-keys/admin-subscriptions.keys'

export function useUpdateSubscriptionPlanMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateSubscriptionPlanService,
    meta: { skipGlobalError: true },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: adminSubscriptionsQueryKeys.plans() }),
  })
}
