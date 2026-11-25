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

export const adminPlansResponseSchema = z.object({ plans: z.array(subscriptionPlanSchema) })
export const subscriptionsResponseSchema = z.object({ subscriptions: z.array(subscriptionRecordSchema) })

export type SubscriptionPlan = z.infer<typeof subscriptionPlanSchema>
export type PublicSubscriptionPlan = z.infer<typeof publicSubscriptionPlanSchema>
export type PlanInput = z.infer<typeof planInputSchema>
export type SubscriptionRecord = z.infer<typeof subscriptionRecordSchema>
