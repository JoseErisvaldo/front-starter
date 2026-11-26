import { useState } from 'react'
import type { OrdersDashboardFilters } from '../../orders/types/orders-dashboard.types'
import { getOrdersDashboardDateRange } from '../../orders/utils/get-orders-dashboard-date-range'
import { getOrdersDashboardPeriodLabel } from '../../orders/utils/get-orders-dashboard-period-label'
import { getPreviousOrdersDashboardDateRange } from '../../orders/utils/get-previous-orders-dashboard-date-range'
import { useSubscriptionsDashboardComparisonQuery } from '../queries/use-subscriptions-dashboard-comparison-query'
import { useSubscriptionsDashboardQuery } from '../queries/use-subscriptions-dashboard-query'

export function useSubscriptionsDashboardPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [upcomingPage, setUpcomingPage] = useState(1)
  const [upcomingPageSize, setUpcomingPageSize] = useState(10)
  const [filters, setFilters] = useState<OrdersDashboardFilters>(() => ({
    preset: 'this_month',
    ...getOrdersDashboardDateRange('this_month', '', ''),
  }))
  const query = getOrdersDashboardDateRange(filters.preset, filters.dateFrom, filters.dateTo)
  const previousQuery = getPreviousOrdersDashboardDateRange(query)
  const dashboard = useSubscriptionsDashboardQuery({
    ...query,
    upcomingPage,
    upcomingPageSize,
  })
  const previousDashboard = useSubscriptionsDashboardComparisonQuery({
    ...previousQuery,
    comparison: true,
  })

  function changeFilters(nextFilters: OrdersDashboardFilters) {
    setFilters(nextFilters)
    setUpcomingPage(1)
  }

  function changeUpcomingPageSize(pageSize: number) {
    setUpcomingPageSize(pageSize)
    setUpcomingPage(1)
  }

  return {
    activeTab,
    setActiveTab,
    setUpcomingPage,
    changeUpcomingPageSize,
    filters,
    setFilters: changeFilters,
    previousQuery,
    dashboard,
    previousDashboard,
    periodLabel: getOrdersDashboardPeriodLabel(filters),
  }
}
