import { useState } from 'react'
import type { GridPaginationModel, GridSortModel } from '@mui/x-data-grid'
import { useAdminPlansQuery } from '../queries/use-admin-plans-query'
import { useAdminSubscriptionsQuery } from '../queries/use-admin-subscriptions-query'
import {
  emptyPlanFilters,
  emptySubscriptionFilters,
  type AdminPlanFilters,
  type AdminPlanListQuery,
  type AdminSubscriptionFilters,
  type AdminSubscriptionsQuery,
  type SubscriptionPlan,
  type SubscriptionRecord,
} from '../types/admin-subscriptions.types'
import { useDeactivateSubscriptionPlanMutation } from '../mutations/use-deactivate-subscription-plan-mutation'
import { useActivateSubscriptionPlanMutation } from '../mutations/use-activate-subscription-plan-mutation'

function getPlanSortField(field?: string): AdminPlanListQuery['sortBy'] {
  switch (field) {
    case 'tier':
    case 'recurrence':
    case 'amount':
    case 'active':
      return field
    default:
      return 'name'
  }
}

function getSubscriptionSortField(field?: string): AdminSubscriptionsQuery['sortBy'] {
  switch (field) {
    case 'customer':
    case 'email':
    case 'plan':
    case 'status':
    case 'nextPaymentDate':
    case 'amount':
      return field
    default:
      return 'createdAt'
  }
}

export function useAdminSubscriptionsPage(isSubscribersPage: boolean) {
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null)
  const [selectedSubscription, setSelectedSubscription] = useState<SubscriptionRecord | null>(null)
  const [planPaginationModel, setPlanPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: 10 })
  const [subscriptionPaginationModel, setSubscriptionPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: 10 })
  const [planSortModel, setPlanSortModel] = useState<GridSortModel>([{ field: 'name', sort: 'asc' }])
  const [subscriptionSortModel, setSubscriptionSortModel] = useState<GridSortModel>([{ field: 'createdAt', sort: 'desc' }])
  const [planFilters, setPlanFilters] = useState<AdminPlanFilters>(emptyPlanFilters)
  const [subscriptionFilters, setSubscriptionFilters] = useState<AdminSubscriptionFilters>(emptySubscriptionFilters)
  const planSort = planSortModel[0]
  const subscriptionSort = subscriptionSortModel[0]
  const planQuery: AdminPlanListQuery = {
    page: planPaginationModel.page,
    pageSize: planPaginationModel.pageSize,
    sortBy: getPlanSortField(planSort?.field),
    sortOrder: planSort?.sort === 'desc' ? 'desc' : 'asc',
    ...(planFilters.search ? { search: planFilters.search } : {}),
    ...(planFilters.tier ? { tier: planFilters.tier } : {}),
    ...(planFilters.recurrence ? { recurrence: planFilters.recurrence } : {}),
    ...(planFilters.active !== '' ? { active: planFilters.active } : {}),
  }
  const subscriptionQuery: AdminSubscriptionsQuery = {
    page: subscriptionPaginationModel.page,
    pageSize: subscriptionPaginationModel.pageSize,
    sortBy: getSubscriptionSortField(subscriptionSort?.field),
    sortOrder: subscriptionSort?.sort === 'asc' ? 'asc' : 'desc',
    ...(subscriptionFilters.search ? { search: subscriptionFilters.search } : {}),
    ...(subscriptionFilters.status ? { status: subscriptionFilters.status } : {}),
    ...(subscriptionFilters.tier ? { tier: subscriptionFilters.tier } : {}),
    ...(subscriptionFilters.recurrence ? { recurrence: subscriptionFilters.recurrence } : {}),
    ...(subscriptionFilters.createdAtFrom ? { createdAtFrom: subscriptionFilters.createdAtFrom } : {}),
    ...(subscriptionFilters.createdAtTo ? { createdAtTo: subscriptionFilters.createdAtTo } : {}),
    ...(subscriptionFilters.nextPaymentDateFrom ? { nextPaymentDateFrom: subscriptionFilters.nextPaymentDateFrom } : {}),
    ...(subscriptionFilters.nextPaymentDateTo ? { nextPaymentDateTo: subscriptionFilters.nextPaymentDateTo } : {}),
  }
  const plans = useAdminPlansQuery(planQuery, !isSubscribersPage)
  const subscriptions = useAdminSubscriptionsQuery(subscriptionQuery, isSubscribersPage)
  const deactivatePlan = useDeactivateSubscriptionPlanMutation()
  const activatePlan = useActivateSubscriptionPlanMutation()

  function applyPlanFilters(filters: AdminPlanFilters) {
    setPlanFilters(filters)
    setPlanPaginationModel((current) => ({ ...current, page: 0 }))
  }

  function applySubscriptionFilters(filters: AdminSubscriptionFilters) {
    setSubscriptionFilters(filters)
    setSubscriptionPaginationModel((current) => ({ ...current, page: 0 }))
  }

  function changePlanSort(model: GridSortModel) {
    setPlanSortModel(model)
    setPlanPaginationModel((current) => ({ ...current, page: 0 }))
  }

  function changeSubscriptionSort(model: GridSortModel) {
    setSubscriptionSortModel(model)
    setSubscriptionPaginationModel((current) => ({ ...current, page: 0 }))
  }

  function togglePlan(plan: SubscriptionPlan) {
    if (plan.active) deactivatePlan.mutate(plan.id)
    else activatePlan.mutate(plan)
  }

  return {
    editingPlan,
    setEditingPlan,
    selectedSubscription,
    setSelectedSubscription,
    planFilters,
    applyPlanFilters,
    subscriptionFilters,
    applySubscriptionFilters,
    planPaginationModel,
    setPlanPaginationModel,
    subscriptionPaginationModel,
    setSubscriptionPaginationModel,
    planSortModel,
    changePlanSort,
    subscriptionSortModel,
    changeSubscriptionSort,
    plans,
    subscriptions,
    isPlanMutationPending: deactivatePlan.isPending || activatePlan.isPending,
    isPlanMutationError: deactivatePlan.isError || activatePlan.isError,
    togglePlan,
  }
}
