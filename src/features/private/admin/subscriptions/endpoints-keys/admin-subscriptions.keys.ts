import type {
  AdminPlanListQuery,
  AdminSubscriptionsQuery,
} from '../types/admin-subscriptions.types'

export const adminSubscriptionsQueryKeys = {
  all: ['subscription-admin'] as const,
  plans: () => [...adminSubscriptionsQueryKeys.all, 'plans'] as const,
  planList: (query: AdminPlanListQuery) => [...adminSubscriptionsQueryKeys.plans(), query] as const,
  subscriptions: () => [...adminSubscriptionsQueryKeys.all, 'subscriptions'] as const,
  subscriptionList: (query: AdminSubscriptionsQuery) =>
    [...adminSubscriptionsQueryKeys.subscriptions(), query] as const,
}
