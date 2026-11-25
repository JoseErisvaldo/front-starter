import { httpClient } from '../../../../../shared/services/http-client'
import { logError } from '../../../../../shared/lib/log-error'
import {
  adminPlansResponseSchema,
  planInputSchema,
  subscriptionsResponseSchema,
  type PlanInput,
} from '../../../../subscriptions/schema/subscriptions.schema'

export async function getAdminPlansService() {
  try {
    const response = await httpClient.get('/subscriptions/admin/plans')
    return adminPlansResponseSchema.parse(response.data).plans
  } catch (error) {
    logError('getAdminPlansService', error)
    throw error
  }
}

export async function saveSubscriptionPlanService(input: { id?: string; plan: PlanInput }) {
  try {
    const plan = planInputSchema.parse(input.plan)
    const response = input.id
      ? await httpClient.patch(`/subscriptions/admin/plans/${input.id}`, plan)
      : await httpClient.post('/subscriptions/admin/plans', plan)
    return response.data
  } catch (error) {
    logError('saveSubscriptionPlanService', error)
    throw error
  }
}

export async function updateSubscriptionPlanService(input: { id: string; plan: PlanInput }) {
  return saveSubscriptionPlanService(input)
}

export async function deactivateSubscriptionPlanService(id: string) {
  try {
    await httpClient.delete(`/subscriptions/admin/plans/${id}`)
  } catch (error) {
    logError('deactivateSubscriptionPlanService', error)
    throw error
  }
}

export async function getAdminSubscriptionsService() {
  try {
    const response = await httpClient.get('/subscriptions/admin')
    return subscriptionsResponseSchema.parse(response.data).subscriptions
  } catch (error) {
    logError('getAdminSubscriptionsService', error)
    throw error
  }
}
