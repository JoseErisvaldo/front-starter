import { httpClient } from '../../../../../shared/services/http-client'
import { logError } from '../../../../../shared/lib/log-error'

export async function cancelSubscriptionService(id: string) {
  try {
    await httpClient.post(`/subscriptions/mine/${id}/cancel`)
  } catch (error) {
    logError('cancelSubscriptionService', error)
    throw error
  }
}
