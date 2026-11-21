import { z } from 'zod'

const customerSchema = z.object({
  name: z.string(),
  email: z.string().email(),
})

export const adminOrdersResponseSchema = z.object({
  payments: z.array(z.object({
    id: z.string().uuid(),
    amount: z.number(),
    paymentMethod: z.string(),
    status: z.string(),
    statusDetail: z.string().nullable(),
    providerOrderId: z.string().nullable(),
    productSummary: z.string(),
    createdAt: z.string().datetime(),
    customer: customerSchema,
  })),
  pagination: z.object({
    page: z.number().int(),
    pageSize: z.number().int(),
    total: z.number().int(),
  }),
})

export const adminOrderDetailsResponseSchema = z.object({
  payment: z.object({
    id: z.string().uuid(),
    amount: z.number(),
    paymentMethod: z.string(),
    status: z.string(),
    statusDetail: z.string().nullable(),
    providerOrderId: z.string().nullable(),
    externalReference: z.string(),
    createdAt: z.string().datetime(),
    customer: z.object({
      id: z.string().uuid(),
      name: z.string(),
      email: z.string().email(),
    }),
    items: z.array(z.object({
      productName: z.string(),
      quantity: z.number().int(),
      unitPrice: z.number(),
      lineTotal: z.number(),
      currency: z.string().length(3),
    })),
  }),
})

export type AdminOrder = z.infer<typeof adminOrdersResponseSchema>['payments'][number]
export type AdminOrderDetails = z.infer<typeof adminOrderDetailsResponseSchema>['payment']
