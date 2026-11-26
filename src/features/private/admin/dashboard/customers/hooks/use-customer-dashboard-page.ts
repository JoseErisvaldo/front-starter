import { useState } from 'react'
import { useCustomerDashboardQuery } from '../queries/use-customer-dashboard-query'
import type { CustomerDashboardPeriod } from '../types/customer-dashboard.types'

export function useCustomerDashboardPage() {
  const [period, setPeriod] = useState<CustomerDashboardPeriod>('daily')
  const dashboard = useCustomerDashboardQuery()

  return { period, setPeriod, dashboard }
}
