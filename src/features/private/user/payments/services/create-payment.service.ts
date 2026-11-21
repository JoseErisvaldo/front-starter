import { httpClient } from '../../../../../shared/services/http-client'
import { logError } from '../../../../../shared/lib/log-error'
import { paymentResponseSchema } from '../schema/payment.schema'
import type { CreatePaymentInput, PaymentResponse } from '../types/payment.types'

export async function createPaymentService(input: CreatePaymentInput): Promise<PaymentResponse> {
  try {
    const response = await httpClient.post('/payments/orders', input)
    return paymentResponseSchema.parse(response.data)
  } catch (error) {
    logError('createPaymentService', error)
    throw error
  }
}
