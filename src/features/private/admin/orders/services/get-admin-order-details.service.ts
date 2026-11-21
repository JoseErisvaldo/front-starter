import { httpClient } from '../../../../../shared/services/http-client'
import { logError } from '../../../../../shared/lib/log-error'
import { adminOrderDetailsResponseSchema } from '../schema/admin-orders.schema'

export async function getAdminOrderDetailsService(paymentId: string) {
  try {
    const response = await httpClient.get(
      `/payments/manage/${encodeURIComponent(paymentId)}`,
    )
    return adminOrderDetailsResponseSchema.parse(response.data).payment
  } catch (error) {
    logError('getAdminOrderDetailsService', error)
    throw error
  }
}
