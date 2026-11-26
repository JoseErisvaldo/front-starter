import { BarChart } from '@mui/x-charts/BarChart'
import { formatBrazilianDayMonthLabel } from '../../../../../../shared/utils/format-brazilian-date'
import type { SubscriptionsDashboard } from '../types/subscriptions-dashboard.types'
import { formatBrazilianCurrency, formatSubscriptionChartCurrency } from '../utils/subscription-dashboard-formatters'

export function SubscriptionRevenueByDayChart({ data }: { data: SubscriptionsDashboard['daily'] }) {
  const chartData = data.map((item) => ({
    day: formatBrazilianDayMonthLabel(item.date),
    revenue: item.paidRevenue,
    paidCharges: item.paidCharges,
  }))
  const maxRevenue = Math.max(0, ...chartData.map(({ revenue }) => revenue))

  return (
    <BarChart
      height={280}
      dataset={chartData}
      xAxis={[{ scaleType: 'band', dataKey: 'day', tickLabelStyle: { fontSize: 11 } }]}
      yAxis={[{
        width: 64,
        max: maxRevenue > 0 ? maxRevenue * 1.2 : undefined,
        valueFormatter: (value: number) => formatSubscriptionChartCurrency(value),
      }]}
      series={[{
        dataKey: 'revenue',
        label: 'Cobranças pagas',
        color: '#31845c',
        valueFormatter: (value: number | null, context) => {
          const point = chartData[context.dataIndex]
          return `${formatBrazilianCurrency(value ?? 0)} · ${point.paidCharges} cobranças`
        },
      }]}
      slotProps={{ tooltip: { trigger: 'axis' } }}
      grid={{ horizontal: true }}
      margin={{ left: 8, right: 12, top: 24, bottom: 36 }}
    />
  )
}
