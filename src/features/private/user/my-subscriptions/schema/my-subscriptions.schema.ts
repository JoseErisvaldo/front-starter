import { z } from 'zod'
import { subscriptionRecordSchema } from '../../../../subscriptions/schema/subscriptions.schema'

export const mySubscriptionsResponseSchema = z.object({
  subscriptions: z.array(subscriptionRecordSchema),
})
