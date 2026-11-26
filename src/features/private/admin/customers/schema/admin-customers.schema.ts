import { z } from 'zod'

export const adminCustomersQuerySchema = z.object({
  page: z.number().int().min(0),
  pageSize: z.number().int().min(1).max(100),
  sortBy: z.enum(['name', 'email', 'createdAt']),
  sortOrder: z.enum(['asc', 'desc']),
  search: z.string().optional(),
  status: z.enum(['active', 'cancelled', 'never_subscribed']).optional(),
  createdAtFrom: z.string().optional(),
  createdAtTo: z.string().optional(),
})

export const adminCustomersResponseSchema = z.object({
  customers: z.array(z.object({
    id: z.string().uuid(),
    name: z.string(),
    email: z.string().email(),
    createdAt: z.string(),
    subscriptionStatus: z.enum(['active', 'cancelled', 'never_subscribed']),
    subscriptionCount: z.number().int(),
    latestSubscriptionAt: z.string().nullable(),
  })),
  pagination: z.object({
    page: z.number().int(),
    pageSize: z.number().int(),
    total: z.number().int(),
  }),
})

export const adminCustomerDetailsSchema = z.object({
  customer: z.object({
    id: z.string().uuid(),
    name: z.string(),
    email: z.string().email(),
    createdAt: z.string(),
  }),
  subscriptions: z.array(z.object({
    id: z.string().uuid(),
    status: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
    nextPaymentDate: z.string().nullable(),
    nextPaymentCountdown: z.string().nullable(),
    plan: z.object({
      name: z.string(),
      tier: z.enum(['BASIC', 'INTERMEDIATE', 'ADVANCED']),
      recurrence: z.enum(['WEEKLY', 'MONTHLY', 'QUARTERLY', 'YEARLY']),
      amount: z.number(),
      currency: z.string(),
    }),
    charges: z.array(z.object({
      id: z.string().uuid(),
      providerPaymentId: z.string(),
      amount: z.number().nullable(),
      currency: z.string().nullable(),
      status: z.string(),
      statusDetail: z.string().nullable(),
      paidAt: z.string().nullable(),
      createdAt: z.string(),
    })),
  })),
})
