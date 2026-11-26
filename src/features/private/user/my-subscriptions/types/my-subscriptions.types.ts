import type { z } from 'zod'
import type { SubscriptionRecord } from '../../../../subscriptions/schema/subscriptions.schema'
import type { mySubscriptionsResponseSchema } from '../schema/my-subscriptions.schema'

export type MySubscription = SubscriptionRecord
export type MySubscriptions = z.infer<typeof mySubscriptionsResponseSchema>['subscriptions']
