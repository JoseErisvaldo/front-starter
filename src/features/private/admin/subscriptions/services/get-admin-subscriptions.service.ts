import { httpClient } from '../../../../../shared/services/http-client'
import { logError } from '../../../../../shared/lib/log-error'
import { adminSubscriptionsQuerySchema, subscriptionsResponseSchema } from '../schema/admin-subscriptions.schema'
import type { AdminSubscriptionsQuery } from '../types/admin-subscriptions.types'

export async function getAdminSubscriptionsService(query: AdminSubscriptionsQuery) {
  try {
    const response = await httpClient.get('/subscriptions/admin', {
      params: adminSubscriptionsQuerySchema.parse(query),
    })
    return subscriptionsResponseSchema.parse(response.data)
  } catch (error) {
    logError('getAdminSubscriptionsService', error)
    throw error
  }
}
