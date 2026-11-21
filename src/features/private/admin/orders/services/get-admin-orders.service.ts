import { httpClient } from '../../../../../shared/services/http-client'
import { logError } from '../../../../../shared/lib/log-error'
import {
  adminOrdersQuerySchema,
  adminOrdersResponseSchema,
  type AdminOrdersQuery,
} from '../schema/admin-orders.schema'

export async function getAdminOrdersService(query: AdminOrdersQuery) {
  try {
    const response = await httpClient.get('/payments/manage', {
      params: adminOrdersQuerySchema.parse(query),
    })
    return adminOrdersResponseSchema.parse(response.data)
  } catch (error) {
    logError('getAdminOrdersService', error)
    throw error
  }
}
