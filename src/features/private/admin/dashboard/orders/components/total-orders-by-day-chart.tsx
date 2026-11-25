import { BarChart } from '@mui/x-charts/BarChart'
import { formatBrazilianDayMonthLabel } from '../../../../../../shared/utils/format-brazilian-date'
import type { OrdersDashboard } from '../schema/orders-dashboard.schema'
import { formatOrdersChartCurrency } from '../utils/orders-dashboard-formatters'
import { MultilineBarLabel } from './multiline-bar-label'

export function TotalOrdersByDayChart({ data }: { data: OrdersDashboard['daily'] }) {
  const maxOrders = Math.max(0, ...data.map((item) => item.orders))
  const chartData = data.map((item) => ({
    day: formatBrazilianDayMonthLabel(item.date),
    orders: item.orders,
    orderValue: item.orderValue,
    percentage: item.orderPercentage,
  }))

  return (
    <BarChart
      height={260}
      dataset={chartData}
      xAxis={[{ scaleType: 'band', dataKey: 'day', tickLabelStyle: { fontSize: 11 } }]}
      series={[{
        dataKey: 'orders',
        label: 'Total de pedidos',
        color: '#528cbd',
        barLabel: (item) => {
          const point = chartData[item.dataIndex]
          return `${point.percentage.toFixed(1)}%|${item.value ?? 0} Ped.|${formatOrdersChartCurrency(point.orderValue)}`
        },
        barLabelPlacement: 'outside',
        valueFormatter: (value, context) => {
          const point = chartData[context.dataIndex]
          return `${formatOrdersChartCurrency(point.orderValue)} · ${value ?? 0} Ped. · ${point.percentage.toFixed(1)}%`
        },
      }]}
      slots={{ barLabel: MultilineBarLabel }}
      slotProps={{ tooltip: { trigger: 'axis' } }}
      yAxis={[{ min: 0, max: maxOrders > 0 ? maxOrders * 1.35 : undefined, tickMinStep: 1 }]}
      grid={{ horizontal: true }}
      margin={{ left: 4, right: 12, top: 64, bottom: 36 }}
    />
  )
}
