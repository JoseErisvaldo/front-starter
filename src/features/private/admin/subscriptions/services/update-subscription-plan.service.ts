import { httpClient } from '../../../../../shared/services/http-client'
import { logError } from '../../../../../shared/lib/log-error'
import {
  planIdSchema,
  planInputSchema,
  subscriptionPlanResponseSchema,
} from '../schema/admin-subscriptions.schema'
import type { PlanInput } from '../types/admin-subscriptions.types'

export async function updateSubscriptionPlanService(input: { id: string; plan: PlanInput }) {
  try {
    const response = await httpClient.patch(
      `/subscriptions/admin/plans/${planIdSchema.parse(input.id)}`,
      planInputSchema.parse(input.plan),
    )
    return subscriptionPlanResponseSchema.parse(response.data).plan
  } catch (error) {
    logError('updateSubscriptionPlanService', error)
    throw error
  }
}
