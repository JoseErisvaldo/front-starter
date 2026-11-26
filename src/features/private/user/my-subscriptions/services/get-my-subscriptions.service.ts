import { httpClient } from '../../../../../shared/services/http-client'
import { logError } from '../../../../../shared/lib/log-error'
import { mySubscriptionsResponseSchema } from '../schema/my-subscriptions.schema'

export async function getMySubscriptionsService() {
  try {
    const response = await httpClient.get('/subscriptions/mine')
    return mySubscriptionsResponseSchema.parse(response.data).subscriptions
  } catch (error) {
    logError('getMySubscriptionsService', error)
    throw error
  }
}
