import type { z } from 'zod'
import type {
  createPaymentInputSchema,
  paymentListResponseSchema,
  paymentResponseSchema,
} from '../schema/payment.schema'

export type CreatePaymentInput = z.infer<typeof createPaymentInputSchema>
export type PaymentResponse = z.infer<typeof paymentResponseSchema>
export type PaymentListResponse = z.infer<typeof paymentListResponseSchema>
