import { httpClient } from '../../../../../shared/services/http-client'
import { logError } from '../../../../../shared/lib/log-error'
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
