import { httpClient } from '../../../../../../shared/services/http-client'
import { logError } from '../../../../../../shared/lib/log-error'
import {
  ordersDashboardQuerySchema,
  ordersDashboardResponseSchema,
} from '../schema/orders-dashboard.schema'
import type { OrdersDashboardQuery } from '../types/orders-dashboard.types'

export async function getOrdersDashboardService(query: OrdersDashboardQuery) {
  try {
    const params = ordersDashboardQuerySchema.parse(query)
    const response = await httpClient.get('/payments/manage/dashboard', { params })
    return ordersDashboardResponseSchema.parse(response.data)
  } catch (error) {
    logError('getOrdersDashboardService', error)
    throw error
  }
}
