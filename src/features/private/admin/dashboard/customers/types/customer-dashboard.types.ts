import type { z } from 'zod'
import type { customerDashboardSchema } from '../schema/customer-dashboard.schema'

export type CustomerDashboard = z.infer<typeof customerDashboardSchema>
export type CustomerDashboardPeriod = 'daily' | 'monthly'
