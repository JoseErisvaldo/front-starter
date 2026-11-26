import type { z } from 'zod'
import type {
  subscriptionsDashboardQuerySchema,
  subscriptionsDashboardResponseSchema,
} from '../schema/subscriptions-dashboard.schema'

export type SubscriptionsDashboardQuery = z.input<typeof subscriptionsDashboardQuerySchema>
export type SubscriptionsDashboard = z.infer<typeof subscriptionsDashboardResponseSchema>
