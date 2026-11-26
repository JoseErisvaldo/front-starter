import { z } from 'zod'

const dateOnlySchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine((value) => {
  const date = new Date(`${value}T00:00:00.000Z`)
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value
})

const tierSchema = z.enum(['BASIC', 'INTERMEDIATE', 'ADVANCED'])
const recurrenceSchema = z.enum(['WEEKLY', 'MONTHLY', 'QUARTERLY', 'YEARLY'])
const paginationSchema = z.object({
  page: z.number().int().min(0),
  pageSize: z.number().int().min(1),
  total: z.number().int().min(0),
})

export const subscriptionPlanSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  tier: tierSchema,
  recurrence: recurrenceSchema,
  amount: z.number().nonnegative(),
  currency: z.string().length(3),
  active: z.boolean(),
  providerPlanId: z.string().nullable(),
  checkoutUrl: z.string().url().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

export const subscriptionChargeSchema = z.object({
  id: z.string().uuid(),
  providerPaymentId: z.string(),
  amount: z.number().nullable(),
  currency: z.string().nullable(),
  status: z.string(),
  statusDetail: z.string().nullable(),
  paidAt: z.string().datetime().nullable(),
  createdAt: z.string().datetime(),
})

export const subscriptionRecordSchema = z.object({
  id: z.string().uuid(),
  externalReference: z.string().nullable().optional(),
  providerSubscriptionId: z.string().nullable().optional(),
  status: z.string(),
  nextPaymentDate: z.string().datetime().nullable(),
  nextPaymentCountdown: z.string().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  plan: subscriptionPlanSchema,
  user: z.object({
    id: z.string().uuid(),
    name: z.string(),
    email: z.string().email(),
  }).nullable().optional(),
  charges: z.array(subscriptionChargeSchema),
})

export const adminPlanListQuerySchema = z.object({
  page: z.number().int().min(0),
  pageSize: z.number().int().min(1).max(100),
  sortBy: z.enum(['name', 'tier', 'recurrence', 'amount', 'active', 'createdAt']),
  sortOrder: z.enum(['asc', 'desc']),
  search: z.string().trim().min(1).max(100).optional(),
  tier: tierSchema.optional(),
  recurrence: recurrenceSchema.optional(),
  active: z.enum(['true', 'false']).optional(),
}).strict()

export const adminSubscriptionsQuerySchema = z.object({
  page: z.number().int().min(0),
  pageSize: z.number().int().min(1).max(100),
  sortBy: z.enum(['customer', 'email', 'plan', 'status', 'nextPaymentDate', 'createdAt', 'amount']),
  sortOrder: z.enum(['asc', 'desc']),
  search: z.string().trim().min(1).max(100).optional(),
  status: z.string().trim().min(1).max(40).optional(),
  tier: tierSchema.optional(),
  recurrence: recurrenceSchema.optional(),
  createdAtFrom: dateOnlySchema.optional(),
  createdAtTo: dateOnlySchema.optional(),
  nextPaymentDateFrom: dateOnlySchema.optional(),
  nextPaymentDateTo: dateOnlySchema.optional(),
}).strict().superRefine((query, context) => {
  const ranges = [
    { from: query.createdAtFrom, to: query.createdAtTo, label: 'Data da assinatura' },
    { from: query.nextPaymentDateFrom, to: query.nextPaymentDateTo, label: 'Data da próxima cobrança' },
  ]

  for (const range of ranges) {
    if (range.from && range.to && range.from > range.to) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: `${range.label}: a data inicial deve ser anterior ou igual à data final.`,
      })
    }
  }
})

export const planInputSchema = z.object({
  name: z.string().trim().min(1).max(100),
  tier: tierSchema,
  recurrence: recurrenceSchema,
  amount: z.number().positive().max(999999.99),
  active: z.boolean().default(true),
})

export const adminPlansResponseSchema = z.object({
  plans: z.array(subscriptionPlanSchema),
  pagination: paginationSchema,
})

export const subscriptionsResponseSchema = z.object({
  subscriptions: z.array(subscriptionRecordSchema),
  pagination: paginationSchema,
})

export const subscriptionPlanResponseSchema = z.object({
  plan: subscriptionPlanSchema,
})

export const planIdSchema = z.string().uuid()
