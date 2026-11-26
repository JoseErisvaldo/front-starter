import { z } from 'zod'
import { publicSubscriptionPlanSchema } from '../../../../subscriptions/schema/subscriptions.schema'

export const publicSubscriptionPlansResponseSchema = z.object({
  plans: z.array(publicSubscriptionPlanSchema),
})

export const createSubscriptionInputSchema = z.object({
  planId: z.string().uuid(),
  cardToken: z.string().min(1),
})

export const createSubscriptionResponseSchema = z.object({
  subscription: z.object({
    id: z.string().uuid(),
    status: z.string(),
    initPoint: z.string().url().nullable(),
    nextPaymentDate: z.string().nullable(),
  }),
})
