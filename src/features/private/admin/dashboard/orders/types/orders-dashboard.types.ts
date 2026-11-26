import type { z } from 'zod'
import type {
  ordersDashboardQuerySchema,
  ordersDashboardResponseSchema,
} from '../schema/orders-dashboard.schema'

export type OrdersDashboardQuery = z.infer<typeof ordersDashboardQuerySchema>
export type OrdersDashboard = z.infer<typeof ordersDashboardResponseSchema>

export type OrdersDashboardPreset =
  | 'today'
  | 'this_week'
  | 'this_month'
  | 'last_30_days'
  | 'last_month'
  | 'custom'

export type OrdersDashboardFilters = {
  preset: OrdersDashboardPreset
  dateFrom: string
  dateTo: string
}
