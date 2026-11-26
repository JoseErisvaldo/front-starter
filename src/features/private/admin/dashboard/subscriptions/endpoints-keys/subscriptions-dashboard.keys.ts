import type { SubscriptionsDashboardQuery } from '../types/subscriptions-dashboard.types'

export const subscriptionsDashboardQueryKeys = {
  all: ['admin-subscriptions-dashboard'] as const,
  overview: (query: SubscriptionsDashboardQuery) =>
    [...subscriptionsDashboardQueryKeys.all, query] as const,
  comparison: (query: SubscriptionsDashboardQuery) =>
    [...subscriptionsDashboardQueryKeys.all, query, 'comparison'] as const,
}
