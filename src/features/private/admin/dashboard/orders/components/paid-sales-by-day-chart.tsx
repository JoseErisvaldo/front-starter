import { BarChart } from '@mui/x-charts/BarChart'
import { formatBrazilianDayMonthLabel } from '../../../../../../shared/utils/format-brazilian-date'
import type { OrdersDashboard } from '../types/orders-dashboard.types'
import { formatBrazilianCurrency, formatOrdersChartCurrency } from '../utils/orders-dashboard-formatters'
import { MultilineBarLabel } from './multiline-bar-label'

export function PaidSalesByDayChart({ data }: { data: OrdersDashboard['daily'] }) {
  const maxSales = Math.max(0, ...data.map((item) => item.sales))
  const chartData = data.map((item) => ({
    day: formatBrazilianDayMonthLabel(item.date),
    sales: item.sales,
    paidOrders: item.paidOrders,
  }))

  return (
    <BarChart
      height={260}
      dataset={chartData}
      xAxis={[{ scaleType: 'band', dataKey: 'day', tickLabelStyle: { fontSize: 11 } }]}
      series={[{
        dataKey: 'sales',
        label: 'Vendas pagas',
        color: '#31845c',
        barLabel: (item) => {
          const point = chartData[item.dataIndex]
          const daily = data[item.dataIndex]
          return `${daily.salesPercentage.toFixed(1)}%|${point.paidOrders} Ped.|${formatBrazilianCurrency(item.value ?? 0)}`
        },
        barLabelPlacement: 'outside',
        valueFormatter: (value: number | null, context) => {
          const point = data[context.dataIndex]
          return `${formatBrazilianCurrency(value ?? 0)} · ${point.paidOrders} Ped. · ${point.salesPercentage.toFixed(1)}%`
        },
      }]}
      slots={{ barLabel: MultilineBarLabel }}
      slotProps={{ tooltip: { trigger: 'axis' } }}
      yAxis={[{
        width: 64,
        max: maxSales > 0 ? maxSales * 1.35 : undefined,
        valueFormatter: (value: number) => formatOrdersChartCurrency(value),
      }]}
      grid={{ horizontal: true }}
      margin={{ left: 4, right: 12, top: 64, bottom: 36 }}
    />
  )
}
