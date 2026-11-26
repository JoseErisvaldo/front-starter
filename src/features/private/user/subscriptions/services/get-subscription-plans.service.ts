import { httpClient } from '../../../../../shared/services/http-client'
import { logError } from '../../../../../shared/lib/log-error'
import { publicSubscriptionPlansResponseSchema } from '../schema/subscription-plans.schema'

export async function getSubscriptionPlansService() {
  try {
    const response = await httpClient.get('/subscriptions/plans')
    return publicSubscriptionPlansResponseSchema.parse(response.data).plans
  } catch (error) {
    logError('getSubscriptionPlansService', error)
    throw error
  }
}
