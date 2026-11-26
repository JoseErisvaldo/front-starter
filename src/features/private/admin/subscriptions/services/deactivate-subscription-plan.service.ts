import { httpClient } from '../../../../../shared/services/http-client'
import { logError } from '../../../../../shared/lib/log-error'
import { planIdSchema } from '../schema/admin-subscriptions.schema'

export async function deactivateSubscriptionPlanService(id: string) {
  try {
    await httpClient.delete(`/subscriptions/admin/plans/${planIdSchema.parse(id)}`)
  } catch (error) {
    logError('deactivateSubscriptionPlanService', error)
    throw error
  }
}
