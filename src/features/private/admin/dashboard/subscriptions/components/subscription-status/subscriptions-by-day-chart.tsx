import { LineChart } from '@mui/x-charts/LineChart'
import { formatBrazilianDayMonthLabel } from '../../../../../../../shared/utils/format-brazilian-date'
import type { SubscriptionsDashboard } from '../../types/subscriptions-dashboard.types'
import { getSubscriptionStatusColor, getSubscriptionStatusLabel } from '../../utils/subscription-dashboard-formatters'

export function SubscriptionsByDayChart({ data, statuses }: {
  data: SubscriptionsDashboard['daily']
  statuses: SubscriptionsDashboard['statuses']
}) {
  const chartData = data.map((day) => ({
    day: formatBrazilianDayMonthLabel(day.date),
    ...Object.fromEntries(statuses.map(({ status }) => [
      `status_${status}`,
      day.statuses[status] ?? 0,
    ])),
  }))

  return (
    <LineChart
      height={300}
      dataset={chartData}
      xAxis={[{ scaleType: 'point', dataKey: 'day', tickLabelStyle: { fontSize: 11 } }]}
      yAxis={[{ min: 0, tickMinStep: 1 }]}
      series={statuses.map((item, index) => ({
        dataKey: `status_${item.status}`,
        label: getSubscriptionStatusLabel(item.status),
        color: getSubscriptionStatusColor(item.status, index),
        showMark: true,
        valueFormatter: (value: number | null) => `${value ?? 0} assinaturas`,
      }))}
      slotProps={{ tooltip: { trigger: 'axis' } }}
      grid={{ horizontal: true }}
      margin={{ left: 8, right: 12, top: 24, bottom: 36 }}
    />
  )
}
