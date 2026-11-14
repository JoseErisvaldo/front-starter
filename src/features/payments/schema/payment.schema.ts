import { z } from 'zod'

const identificationSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('CPF'), number: z.string().regex(/^\d{11}$/, 'Informe um CPF com 11 dígitos') }),
  z.object({ type: z.literal('CNPJ'), number: z.string().regex(/^\d{14}$/, 'Informe um CNPJ com 14 dígitos') }),
])

export const createPaymentInputSchema = z.discriminatedUnion('method', [
  z.object({
    method: z.literal('card'),
    productId: z.string().min(1),
    token: z.string().min(1),
    paymentMethodId: z.string().min(1),
    paymentTypeId: z.enum(['credit_card', 'debit_card', 'prepaid_card']),
    installments: z.number().int().min(1).max(24),
    identification: identificationSchema.optional(),
  }),
  z.object({
    method: z.literal('pix'),
    productId: z.string().min(1),
    identification: identificationSchema,
  }),
])

export const paymentResponseSchema = z.object({
  payment: z.object({
    id: z.string(),
    status: z.string(),
    statusDetail: z.string().nullable(),
    amount: z.number(),
    productName: z.string(),
    providerOrderId: z.string().nullable(),
    paymentMethod: z.string(),
    qrCode: z.string().nullable(),
    qrCodeBase64: z.string().nullable(),
    ticketUrl: z.string().nullable(),
  }),
})
