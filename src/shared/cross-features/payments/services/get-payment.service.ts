import { httpClient } from '../../../services/http-client'
import { logError } from '../../../lib/log-error'
import { paymentResponseSchema } from '../schema/payment.schema'

export async function getPaymentService(id: string) {
  try {
    const response = await httpClient.get(`/payments/${encodeURIComponent(id)}`)
    return paymentResponseSchema.parse(response.data)
  } catch (error) {
    logError('getPaymentService', error)
    throw error
  }
}
