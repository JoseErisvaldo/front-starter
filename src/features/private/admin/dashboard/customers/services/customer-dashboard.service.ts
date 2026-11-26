import { httpClient } from '../../../../../../shared/services/http-client'
import { logError } from '../../../../../../shared/lib/log-error'
import { customerDashboardSchema } from '../schema/customer-dashboard.schema'
import type { CustomerDashboard } from '../types/customer-dashboard.types'

export async function getCustomerDashboardService(): Promise<CustomerDashboard> {
  try {
    const response = await httpClient.get('/subscriptions/admin/customers/dashboard')
    return customerDashboardSchema.parse(response.data)
  } catch (error) {
    logError('getCustomerDashboardService', error)
    throw error
  }
}
