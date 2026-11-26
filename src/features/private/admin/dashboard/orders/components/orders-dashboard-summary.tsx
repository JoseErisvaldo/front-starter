import { Card, CardContent, Skeleton, Stack, Typography } from '@mui/material'
import { formatBrazilianCurrency } from '../../../../../../shared/utils/format-brazilian-currency'
import { ordersDashboardMetrics } from '../constants/orders-dashboard-metrics'
import type { OrdersDashboard } from '../types/orders-dashboard.types'

function PeriodChange({ current, previous }: { current: number; previous: number }) {
  if (previous === 0 && current !== 0) {
    return <Typography variant="caption" color="text.secondary">Novo no período</Typography>
  }
  const change = previous === 0 ? 0 : ((current - previous) / Math.abs(previous)) * 100
  const color = change > 0 ? 'success.main' : change < 0 ? 'error.main' : 'text.secondary'
  const sign = change > 0 ? '+' : ''
  return <Typography variant="caption" sx={{ color }}>{sign}{change.toFixed(1)}% vs. período anterior</Typography>
}

export function OrdersDashboardSummary({
  data,
  previousData,
}: {
  data?: OrdersDashboard
  previousData?: OrdersDashboard
}) {
  return (
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ flexWrap: 'wrap' }}>
      {ordersDashboardMetrics.map((metric) => {
        const value = data?.summary[metric.key]
        const previousValue = previousData?.summary[metric.key]
        return (
          <Card key={metric.key} variant="outlined" sx={{ flex: '1 1 210px' }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary">{metric.title}</Typography>
              {value !== undefined
                ? (
                  <Typography
                    variant="h4"
                    sx={{ mt: 1, fontWeight: 700, ...('color' in metric ? { color: metric.color } : {}) }}
                  >
                    {metric.format === 'currency' ? formatBrazilianCurrency(value) : value}
                  </Typography>
                )
                : <Skeleton variant="text" width={metric.format === 'currency' ? 180 : 100} height={48} />}
              {value !== undefined && previousValue !== undefined
                ? <PeriodChange current={value} previous={previousValue} />
                : <Skeleton variant="text" width={150} />}
            </CardContent>
          </Card>
        )
      })}
    </Stack>
  )
}
