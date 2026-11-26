import type { z } from 'zod'
import type {
  adminPlanListQuerySchema,
  adminSubscriptionsQuerySchema,
  planInputSchema,
  subscriptionPlanSchema,
  subscriptionRecordSchema,
} from '../schema/admin-subscriptions.schema'

export type AdminPlanListQuery = z.infer<typeof adminPlanListQuerySchema>
export type AdminSubscriptionsQuery = z.infer<typeof adminSubscriptionsQuerySchema>
export type PlanInput = z.infer<typeof planInputSchema>
export type SubscriptionPlan = z.infer<typeof subscriptionPlanSchema>
export type SubscriptionRecord = z.infer<typeof subscriptionRecordSchema>

export type AdminPlanFilters = {
  search: string
  tier: AdminPlanListQuery['tier'] | ''
  recurrence: AdminPlanListQuery['recurrence'] | ''
  active: AdminPlanListQuery['active'] | ''
}

export type AdminSubscriptionFilters = {
  search: string
  status: string
  tier: AdminSubscriptionsQuery['tier'] | ''
  recurrence: AdminSubscriptionsQuery['recurrence'] | ''
  createdAtFrom: string
  createdAtTo: string
  nextPaymentDateFrom: string
  nextPaymentDateTo: string
}

export const emptyPlanFilters: AdminPlanFilters = {
  search: '',
  tier: '',
  recurrence: '',
  active: '',
}

export const emptySubscriptionFilters: AdminSubscriptionFilters = {
  search: '',
  status: '',
  tier: '',
  recurrence: '',
  createdAtFrom: '',
  createdAtTo: '',
  nextPaymentDateFrom: '',
  nextPaymentDateTo: '',
}
