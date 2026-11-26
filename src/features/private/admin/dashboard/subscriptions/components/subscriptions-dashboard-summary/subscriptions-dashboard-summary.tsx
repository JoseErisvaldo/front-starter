import { Stack } from '@mui/material'
import { formatBrazilianCurrency } from '../../../../../../../shared/utils/format-brazilian-currency'
import { subscriptionsDashboardMetrics } from '../../constants/subscriptions-dashboard-metrics'
import type { SubscriptionsDashboard } from '../../types/subscriptions-dashboard.types'
import { MetricCard } from './metric-card'

export function SubscriptionsDashboardSummary({
  data,
  comparison,
}: {
  data?: SubscriptionsDashboard
  comparison?: SubscriptionsDashboard
}) {
  return (
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ flexWrap: 'wrap' }}>
      {subscriptionsDashboardMetrics.map((metric) => {
        const current = data?.summary[metric.key]
        const previous = comparison?.summary[metric.key]
        const value = current === undefined
          ? undefined
          : 'format' in metric
            ? formatBrazilianCurrency(current)
            : current
        return (
          <MetricCard
            key={metric.key}
            title={metric.title}
            value={value}
            current={metric.compare ? current : undefined}
            previous={metric.compare ? previous : undefined}
            loading={!data}
          />
        )
      })}
    </Stack>
  )
}
