import type { z } from 'zod'
import type { createPaymentInputSchema, paymentResponseSchema } from '../schema/payment.schema'

export type CreatePaymentInput = z.infer<typeof createPaymentInputSchema>
export type PaymentResponse = z.infer<typeof paymentResponseSchema>
