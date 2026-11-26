import { httpClient } from '../../../../../shared/services/http-client'
import { logError } from '../../../../../shared/lib/log-error'
import { planInputSchema, subscriptionPlanResponseSchema } from '../schema/admin-subscriptions.schema'
import type { PlanInput } from '../types/admin-subscriptions.types'

export async function createSubscriptionPlanService(plan: PlanInput) {
  try {
    const response = await httpClient.post(
      '/subscriptions/admin/plans',
      planInputSchema.parse(plan),
    )
    return subscriptionPlanResponseSchema.parse(response.data).plan
  } catch (error) {
    logError('createSubscriptionPlanService', error)
    throw error
  }
}
