import { httpClient } from '../../../../../shared/services/http-client'
import { logError } from '../../../../../shared/lib/log-error'
import { adminOrdersResponseSchema } from '../schema/admin-orders.schema'

export async function getAdminOrdersService(page: number, pageSize: number) {
  try {
    const response = await httpClient.get('/payments/manage', {
      params: { page, pageSize },
    })
    return adminOrdersResponseSchema.parse(response.data)
  } catch (error) {
    logError('getAdminOrdersService', error)
    throw error
  }
}
