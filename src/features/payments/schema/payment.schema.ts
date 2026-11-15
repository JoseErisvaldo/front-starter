import { z } from 'zod'

const identificationSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('CPF'), number: z.string().regex(/^\d{11}$/, 'Informe um CPF com 11 dígitos') }),
  z.object({ type: z.literal('CNPJ'), number: z.string().regex(/^\d{14}$/, 'Informe um CNPJ com 14 dígitos') }),
])

const itemsSchema = z.array(
  z.object({
    productId: z.string().min(1),
    quantity: z.number().int().min(1).max(99),
  }),
).min(1).max(50)

export const createPaymentInputSchema = z.discriminatedUnion('method', [
  z.object({
    method: z.literal('card'),
    items: itemsSchema,
    token: z.string().min(1),
    paymentMethodId: z.string().min(1),
    paymentTypeId: z.enum(['credit_card', 'debit_card', 'prepaid_card']),
    installments: z.number().int().min(1).max(24),
    identification: identificationSchema.optional(),
  }),
  z.object({
    method: z.literal('pix'),
    items: itemsSchema,
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
    items: z.array(z.object({
      productName: z.string(),
      quantity: z.number().int(),
      unitPrice: z.number(),
      lineTotal: z.number(),
      currency: z.string(),
    })),
    currency: z.string().optional(),
    createdAt: z.string().optional(),
    providerOrderId: z.string().nullable(),
    paymentMethod: z.string(),
    qrCode: z.string().nullable(),
    qrCodeBase64: z.string().nullable(),
    ticketUrl: z.string().nullable(),
    expiresAt: z.string().nullable(),
    providerOrderDetails: z.object({
      id: z.string(),
      type: z.string().nullable(),
      processingMode: z.string().nullable(),
      status: z.string().nullable(),
      statusDetail: z.string().nullable(),
      externalReference: z.string().nullable(),
      updatedAt: z.string().nullable(),
      currency: z.string().nullable(),
      captureMode: z.string().nullable(),
      countryCode: z.string().nullable(),
      createdAt: z.string().nullable(),
      totalAmount: z.number().nullable(),
      totalPaidAmount: z.number().nullable(),
      payment: z.object({
        id: z.string().nullable(),
        amount: z.number().nullable(),
        status: z.string().nullable(),
        statusDetail: z.string().nullable(),
        referenceId: z.string().nullable(),
        expirationTime: z.string().nullable(),
        method: z.string().nullable(),
        methodType: z.string().nullable(),
        expiresAt: z.string().nullable(),
      }).nullable(),
    }).nullable().optional(),
  }),
})

export const paymentListResponseSchema = z.object({
  payments: z.array(
    z.object({
      id: z.string(),
      amount: z.number(),
      paymentMethod: z.string(),
      status: z.string(),
      statusDetail: z.string().nullable(),
      providerOrderId: z.string().nullable(),
      productName: z.string(),
      items: z.array(z.object({
        productName: z.string(),
        quantity: z.number().int(),
        unitPrice: z.number(),
        lineTotal: z.number(),
        currency: z.string(),
      })),
      currency: z.string(),
      createdAt: z.string(),
      expiresAt: z.string().nullable(),
    }),
  ),
  pagination: z.object({
    page: z.number().int(),
    pageSize: z.number().int(),
    total: z.number().int(),
  }),
})
