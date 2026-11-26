import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateSubscriptionPlanService } from '../services/update-subscription-plan.service'
import { adminSubscriptionsQueryKeys } from '../endpoints-keys/admin-subscriptions.keys'
import type { SubscriptionPlan } from '../types/admin-subscriptions.types'

export function useActivateSubscriptionPlanMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (plan: SubscriptionPlan) => updateSubscriptionPlanService({
      id: plan.id,
      plan: {
        name: plan.name,
        tier: plan.tier,
        recurrence: plan.recurrence,
        amount: plan.amount,
        active: true,
      },
    }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: adminSubscriptionsQueryKeys.plans() }),
  })
}
