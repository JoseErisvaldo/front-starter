import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getAdminSubscriptionsService } from '../services/get-admin-subscriptions.service'
import { adminSubscriptionsQueryKeys } from '../endpoints-keys/admin-subscriptions.keys'
import type { AdminSubscriptionsQuery } from '../types/admin-subscriptions.types'

export function useAdminSubscriptionsQuery(query: AdminSubscriptionsQuery, enabled: boolean) {
  return useQuery({
    queryKey: adminSubscriptionsQueryKeys.subscriptionList(query),
    queryFn: () => getAdminSubscriptionsService(query),
    placeholderData: keepPreviousData,
    enabled,
  })
}
