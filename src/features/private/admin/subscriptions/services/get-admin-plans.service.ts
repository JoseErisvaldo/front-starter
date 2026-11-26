import { httpClient } from '../../../../../shared/services/http-client'
import { logError } from '../../../../../shared/lib/log-error'
import { adminPlanListQuerySchema, adminPlansResponseSchema } from '../schema/admin-subscriptions.schema'
import type { AdminPlanListQuery } from '../types/admin-subscriptions.types'

export async function getAdminPlansService(query: AdminPlanListQuery) {
  try {
    const response = await httpClient.get('/subscriptions/admin/plans', {
      params: adminPlanListQuerySchema.parse(query),
    })
    return adminPlansResponseSchema.parse(response.data)
  } catch (error) {
    logError('getAdminPlansService', error)
    throw error
  }
}
