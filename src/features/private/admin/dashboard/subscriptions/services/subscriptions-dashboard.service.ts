import { httpClient } from '../../../../../../shared/services/http-client'
import { logError } from '../../../../../../shared/lib/log-error'
import {
  subscriptionsDashboardQuerySchema,
  subscriptionsDashboardResponseSchema,
  type SubscriptionsDashboardQuery,
} from '../schema/subscriptions-dashboard.schema'

export async function getSubscriptionsDashboardService(query: SubscriptionsDashboardQuery) {
  try {
    const params = subscriptionsDashboardQuerySchema.parse(query)
    const response = await httpClient.get('/subscriptions/admin/dashboard', { params })
    return subscriptionsDashboardResponseSchema.parse(response.data)
  } catch (error) {
    logError('getSubscriptionsDashboardService', error)
    throw error
  }
}
