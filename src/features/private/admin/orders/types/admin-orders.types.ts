import type { z } from 'zod'
import type {
  adminOrderDetailsResponseSchema,
  adminOrdersQuerySchema,
  adminOrdersResponseSchema,
} from '../schema/admin-orders.schema'

export type AdminOrder = z.infer<typeof adminOrdersResponseSchema>['payments'][number]
export type AdminOrderDetails = z.infer<typeof adminOrderDetailsResponseSchema>['payment']
export type AdminOrdersQuery = z.infer<typeof adminOrdersQuerySchema>

export type AdminOrdersFilters = {
  search: string
  customerName: string
  paymentMethod: '' | 'pix' | 'card'
  status: '' | 'paid' | 'pending' | 'failed' | 'cancelled' | 'expired'
  dateFrom: string
  dateTo: string
}

export const emptyAdminOrdersFilters: AdminOrdersFilters = {
  search: '',
  customerName: '',
  paymentMethod: '',
  status: '',
  dateFrom: '',
  dateTo: '',
}
