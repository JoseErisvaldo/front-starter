import { httpClient } from '../../../../../../shared/services/http-client'
import { logError } from '../../../../../../shared/lib/log-error'
import {
  subscriptionsDashboardQuerySchema,
  subscriptionsDashboardResponseSchema,
} from '../schema/subscriptions-dashboard.schema'
import type { SubscriptionsDashboardQuery } from '../types/subscriptions-dashboard.types'

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
