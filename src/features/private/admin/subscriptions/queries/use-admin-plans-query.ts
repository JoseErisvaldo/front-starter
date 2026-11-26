import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getAdminPlansService } from '../services/get-admin-plans.service'
import { adminSubscriptionsQueryKeys } from '../endpoints-keys/admin-subscriptions.keys'
import type { AdminPlanListQuery } from '../types/admin-subscriptions.types'

export function useAdminPlansQuery(query: AdminPlanListQuery, enabled: boolean) {
  return useQuery({
    queryKey: adminSubscriptionsQueryKeys.planList(query),
    queryFn: () => getAdminPlansService(query),
    placeholderData: keepPreviousData,
    enabled,
  })
}
