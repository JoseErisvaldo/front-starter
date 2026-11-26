import { httpClient } from '../../../../../shared/services/http-client'
import { logError } from '../../../../../shared/lib/log-error'
import { createSubscriptionInputSchema, createSubscriptionResponseSchema } from '../schema/subscription-plans.schema'
import type { CreateSubscriptionInput } from '../types/subscription-plans.types'

export async function createSubscriptionService(input: CreateSubscriptionInput) {
  try {
    const request = createSubscriptionInputSchema.parse(input)
    const response = await httpClient.post('/subscriptions/mine', request)
    return createSubscriptionResponseSchema.parse(response.data).subscription
  } catch (error) {
    logError('createSubscriptionService', error)
    throw error
  }
}
