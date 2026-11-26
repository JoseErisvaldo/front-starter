import type { z } from 'zod'
import type {
  adminCustomerDetailsSchema,
  adminCustomersQuerySchema,
  adminCustomersResponseSchema,
} from '../schema/admin-customers.schema'

export type AdminCustomersQuery = z.infer<typeof adminCustomersQuerySchema>
export type AdminCustomersResponse = z.infer<typeof adminCustomersResponseSchema>
export type AdminCustomer = AdminCustomersResponse['customers'][number]
export type AdminCustomerDetails = z.infer<typeof adminCustomerDetailsSchema>

export type AdminCustomersFilters = {
  search: string
  status: '' | 'active' | 'cancelled' | 'never_subscribed'
  createdAtFrom: string
  createdAtTo: string
}

export const emptyAdminCustomersFilters: AdminCustomersFilters = {
  search: '',
  status: '',
  createdAtFrom: '',
  createdAtTo: '',
}
