import { z } from 'zod'

export const adminOrdersQuerySchema = z.object({
  page: z.number().int().min(1),
  pageSize: z.number().int().min(1).max(100),
  search: z.string().optional(),
  customerName: z.string().optional(),
  paymentMethod: z.enum(['pix', 'card']).optional(),
  status: z.enum(['paid', 'pending', 'failed', 'cancelled', 'expired']).optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  sortBy: z.enum(['createdAt', 'amount', 'status']),
  sortOrder: z.enum(['asc', 'desc']),
})

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
