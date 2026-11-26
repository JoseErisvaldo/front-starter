import { LineChart } from '@mui/x-charts/LineChart'
import { formatBrazilianDayMonthLabel } from '../../../../../../shared/utils/format-brazilian-date'
import type { OrdersDashboard } from '../types/orders-dashboard.types'
import { getOrderStatusColor, getOrderStatusLabel } from '../utils/orders-dashboard-formatters'

export function OrdersByStatusByDayChart({ data, statuses }: {
  data: OrdersDashboard['daily']
  statuses: OrdersDashboard['statuses']
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
      height={260}
      dataset={chartData}
      xAxis={[{ scaleType: 'point', dataKey: 'day', tickLabelStyle: { fontSize: 11 } }]}
      yAxis={[{ min: 0, tickMinStep: 1 }]}
      series={statuses.map((item, index) => ({
        dataKey: `status_${item.status}`,
        label: getOrderStatusLabel(item.status),
        color: getOrderStatusColor(item.status, index),
        showMark: true,
        valueFormatter: (value: number | null) => `${value ?? 0} pedidos`,
      }))}
      slotProps={{ tooltip: { trigger: 'axis' } }}
      grid={{ horizontal: true }}
      margin={{ left: 8, right: 12, top: 24, bottom: 36 }}
    />
  )
}
