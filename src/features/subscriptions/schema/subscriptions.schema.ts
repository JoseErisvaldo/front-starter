import { z } from 'zod'

export const subscriptionPlanSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  tier: z.enum(['BASIC', 'SIMPLE', 'PRO']),
  recurrence: z.enum(['WEEKLY', 'MONTHLY', 'QUARTERLY', 'YEARLY']),
  amount: z.number().nonnegative(),
  currency: z.string().length(3),
  active: z.boolean(),
  providerPlanId: z.string().nullable(),
  checkoutUrl: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export const publicSubscriptionPlanSchema = subscriptionPlanSchema.omit({
  providerPlanId: true,
  checkoutUrl: true,
})

export const subscriptionChargeSchema = z.object({
  id: z.string().uuid(),
  providerPaymentId: z.string(),
  amount: z.number().nullable(),
  currency: z.string().nullable(),
  status: z.string(),
  statusDetail: z.string().nullable(),
  paidAt: z.string().nullable(),
  createdAt: z.string(),
})

export const subscriptionRecordSchema = z.object({
  id: z.string().uuid(),
  externalReference: z.string().optional(),
  providerSubscriptionId: z.string().nullable().optional(),
  status: z.string(),
  nextPaymentDate: z.string().nullable(),
  nextPaymentCountdown: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  plan: subscriptionPlanSchema,
  user: z.object({ id: z.string().uuid(), name: z.string(), email: z.string().email() }).optional(),
  charges: z.array(subscriptionChargeSchema),
})

export const planInputSchema = z.object({
  name: z.string().trim().min(1).max(100),
  tier: z.enum(['BASIC', 'SIMPLE', 'PRO']),
  recurrence: z.enum(['WEEKLY', 'MONTHLY', 'QUARTERLY', 'YEARLY']),
  amount: z.number().positive().max(999999.99),
  active: z.boolean(),
})

export const adminPlanListQuerySchema = z.object({
  page: z.number().int().min(0),
  pageSize: z.number().int().min(1).max(100),
  sortBy: z.enum(['name', 'tier', 'recurrence', 'amount', 'active', 'createdAt']),
  sortOrder: z.enum(['asc', 'desc']),
  search: z.string().optional(),
  tier: z.enum(['BASIC', 'SIMPLE', 'PRO']).optional(),
  recurrence: z.enum(['WEEKLY', 'MONTHLY', 'QUARTERLY', 'YEARLY']).optional(),
  active: z.enum(['true', 'false']).optional(),
})

export const adminSubscriptionsQuerySchema = z.object({
  page: z.number().int().min(0),
  pageSize: z.number().int().min(1).max(100),
  sortBy: z.enum(['customer', 'email', 'plan', 'status', 'nextPaymentDate', 'createdAt', 'amount']),
  sortOrder: z.enum(['asc', 'desc']),
  search: z.string().optional(),
  status: z.string().optional(),
  tier: z.enum(['BASIC', 'SIMPLE', 'PRO']).optional(),
  recurrence: z.enum(['WEEKLY', 'MONTHLY', 'QUARTERLY', 'YEARLY']).optional(),
  createdAtFrom: z.string().optional(),
  createdAtTo: z.string().optional(),
  nextPaymentDateFrom: z.string().optional(),
  nextPaymentDateTo: z.string().optional(),
})

const adminPaginationSchema = z.object({
  page: z.number().int(),
  pageSize: z.number().int(),
  total: z.number().int(),
})

export const adminPlansResponseSchema = z.object({
  plans: z.array(subscriptionPlanSchema),
  pagination: adminPaginationSchema,
})
export const subscriptionsResponseSchema = z.object({
  subscriptions: z.array(subscriptionRecordSchema),
  pagination: adminPaginationSchema,
})

export type SubscriptionPlan = z.infer<typeof subscriptionPlanSchema>
export type PublicSubscriptionPlan = z.infer<typeof publicSubscriptionPlanSchema>
export type PlanInput = z.infer<typeof planInputSchema>
export type AdminPlanListQuery = z.infer<typeof adminPlanListQuerySchema>
export type AdminSubscriptionsQuery = z.infer<typeof adminSubscriptionsQuerySchema>
export type SubscriptionRecord = z.infer<typeof subscriptionRecordSchema>
