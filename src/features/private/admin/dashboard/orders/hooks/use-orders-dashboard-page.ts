import { useState } from 'react'
import { useOrdersDashboardComparisonQuery } from '../queries/use-orders-dashboard-comparison-query'
import { useOrdersDashboardQuery } from '../queries/use-orders-dashboard-query'
import type { OrdersDashboardFilters } from '../types/orders-dashboard.types'
import { getOrdersDashboardDateRange } from '../utils/get-orders-dashboard-date-range'
import { getPreviousOrdersDashboardDateRange } from '../utils/get-previous-orders-dashboard-date-range'
import { getOrdersDashboardPeriodLabel } from '../utils/get-orders-dashboard-period-label'

export function useOrdersDashboardPage() {
  const [filters, setFilters] = useState<OrdersDashboardFilters>(() => ({
    preset: 'this_month',
    ...getOrdersDashboardDateRange('this_month', '', ''),
  }))
  const query = getOrdersDashboardDateRange(filters.preset, filters.dateFrom, filters.dateTo)
  const previousQuery = getPreviousOrdersDashboardDateRange(query)
  const dashboard = useOrdersDashboardQuery(query)
  const previousDashboard = useOrdersDashboardComparisonQuery({
    ...previousQuery,
    comparison: true,
  })

  return {
    filters,
    setFilters,
    query,
    previousQuery,
    dashboard,
    previousDashboard,
    periodLabel: getOrdersDashboardPeriodLabel(filters),
  }
}
