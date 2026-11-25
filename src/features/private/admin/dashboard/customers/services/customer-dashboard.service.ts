import { httpClient } from '../../../../../../shared/services/http-client'
import { logError } from '../../../../../../shared/lib/log-error'
import { customerDashboardSchema } from '../schema/customer-dashboard.schema'

export async function getCustomerDashboardService() {
  try {
    const response = await httpClient.get('/subscriptions/admin/customers/dashboard')
    return customerDashboardSchema.parse(response.data)
  } catch (error) {
    logError('getCustomerDashboardService', error)
    throw error
  }
}
