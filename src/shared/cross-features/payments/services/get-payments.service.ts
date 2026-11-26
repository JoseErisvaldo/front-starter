import { httpClient } from '../../../services/http-client'
import { logError } from '../../../lib/log-error'
import { paymentListResponseSchema } from '../schema/payment.schema'

export async function getPaymentsService(page: number, pageSize: number) {
  try {
    const response = await httpClient.get('/payments', {
      params: { page, pageSize },
    })
    return paymentListResponseSchema.parse(response.data)
  } catch (error) {
    logError('getPaymentsService', error)
    throw error
  }
}
