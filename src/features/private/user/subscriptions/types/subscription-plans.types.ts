import type { z } from 'zod'
import type { PublicSubscriptionPlan } from '../../../../subscriptions/schema/subscriptions.schema'
import type {
  createSubscriptionInputSchema,
  createSubscriptionResponseSchema,
} from '../schema/subscription-plans.schema'

export type { PublicSubscriptionPlan }
export type CreateSubscriptionInput = z.infer<typeof createSubscriptionInputSchema>
export type CreatedSubscription = z.infer<typeof createSubscriptionResponseSchema>['subscription']
export type CheckoutState = 'success' | 'error' | 'pending'
