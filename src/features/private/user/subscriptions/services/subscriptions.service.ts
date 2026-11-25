import { z } from 'zod'
import { httpClient } from '../../../../../shared/services/http-client'
import { logError } from '../../../../../shared/lib/log-error'
import {
  publicSubscriptionPlanSchema,
  subscriptionRecordSchema,
} from '../../../../subscriptions/schema/subscriptions.schema'

const publicPlansSchema = z.object({ plans: z.array(publicSubscriptionPlanSchema) })
const userSubscriptionsSchema = z.object({ subscriptions: z.array(subscriptionRecordSchema) })
const createSubscriptionResponseSchema = z.object({
  subscription: z.object({
    id: z.string().uuid(),
    status: z.string(),
    initPoint: z.string().url().nullable(),
    nextPaymentDate: z.string().nullable(),
  }),
})

export async function getSubscriptionPlansService() {
  try {
    const response = await httpClient.get('/subscriptions/plans')
    return publicPlansSchema.parse(response.data).plans
  } catch (error) {
    logError('getSubscriptionPlansService', error)
    throw error
  }
}

export async function getMySubscriptionsService() {
  try {
    const response = await httpClient.get('/subscriptions/mine')
    return userSubscriptionsSchema.parse(response.data).subscriptions
  } catch (error) {
    logError('getMySubscriptionsService', error)
    throw error
  }
}

export async function createSubscriptionService(input: { planId: string; cardToken: string }) {
  try {
    const response = await httpClient.post('/subscriptions/mine', input)
    return createSubscriptionResponseSchema.parse(response.data).subscription
  } catch (error) {
    logError('createSubscriptionService', error)
    throw error
  }
}

export async function cancelSubscriptionService(id: string) {
  try {
    await httpClient.post(`/subscriptions/mine/${id}/cancel`)
  } catch (error) {
    logError('cancelSubscriptionService', error)
    throw error
  }
}
