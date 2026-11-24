import { httpClient } from '../../../../../shared/services/http-client'
import { logError } from '../../../../../shared/lib/log-error'
import { paymentResponseSchema } from '../schema/payment.schema'
import type { CreatePaymentInput, PaymentResponse } from '../types/payment.types'

export async function createPaymentService(
  request: { input: CreatePaymentInput; idempotencyKey: string },
): Promise<PaymentResponse> {
  try {
    const response = await httpClient.post('/payments/orders', request.input, {
      headers: { 'Idempotency-Key': request.idempotencyKey },
    })
    return paymentResponseSchema.parse(response.data)
  } catch (error) {
    logError('createPaymentService', error)
    throw error
  }
}
