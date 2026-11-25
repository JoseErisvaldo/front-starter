import { httpClient } from '../../../../../shared/services/http-client'
import { logError } from '../../../../../shared/lib/log-error'
import {
  adminCustomersQuerySchema,
  adminCustomersResponseSchema,
  adminCustomerDetailsSchema,
  type AdminCustomersQuery,
} from '../schema/admin-customers.schema'

export async function getAdminCustomersService(query: AdminCustomersQuery) {
  try {
    const params = adminCustomersQuerySchema.parse(query)
    const response = await httpClient.get('/subscriptions/admin/customers', { params })
    return adminCustomersResponseSchema.parse(response.data)
  } catch (error) {
    logError('getAdminCustomersService', error)
    throw error
  }
}

export async function getAdminCustomerDetailsService(id: string) {
  try {
    const response = await httpClient.get(`/subscriptions/admin/customers/${id}`)
    return adminCustomerDetailsSchema.parse(response.data)
  } catch (error) {
    logError('getAdminCustomerDetailsService', error)
    throw error
  }
}
