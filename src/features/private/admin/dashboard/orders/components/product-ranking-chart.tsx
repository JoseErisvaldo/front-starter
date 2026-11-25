import { Typography } from '@mui/material'
import { BarChart } from '@mui/x-charts/BarChart'
import type { OrdersDashboard } from '../schema/orders-dashboard.schema'
import { formatBrazilianCurrency, formatOrdersChartCurrency } from '../utils/orders-dashboard-formatters'
import { MultilineBarLabel } from './multiline-bar-label'

type ProductRanking = OrdersDashboard['topProductsByOrders']

export function ProductRankingChart({ data, metric }: {
  data: ProductRanking
  metric: 'orders' | 'revenue'
}) {
  if (data.length === 0) {
    return <Typography color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>Nenhuma venda paga neste período.</Typography>
  }

  const chartData = data.map((item) => ({
    productName: item.productName,
    value: metric === 'orders' ? item.orderCount : item.paidAmount,
    orderCount: item.orderCount,
    paidAmount: item.paidAmount,
    percentage: item.percentage,
  }))
  const maxValue = Math.max(...chartData.map(({ value }) => value))

  return (
    <BarChart
      height={220}
      hideLegend
      dataset={chartData}
      xAxis={[{
        scaleType: 'band',
        dataKey: 'productName',
        valueFormatter: (name: string) => name.length > 10 ? `${name.slice(0, 9)}…` : name,
        tickLabelStyle: { fontSize: 10 },
      }]}
      yAxis={[{
        min: 0,
        max: maxValue > 0 ? maxValue * 1.35 : undefined,
        width: metric === 'revenue' ? 76 : 36,
        tickMinStep: metric === 'orders' ? 1 : undefined,
        valueFormatter: (value: number) => metric === 'orders' ? String(value) : formatOrdersChartCurrency(value),
      }]}
      series={[{
        dataKey: 'value',
        label: metric === 'orders' ? 'Pedidos pagos' : 'Valor pago',
        color: metric === 'orders' ? '#31845c' : '#568bb8',
        barLabel: (item) => {
          const product = chartData[item.dataIndex]
          return `${product.percentage.toFixed(1)}%|${product.orderCount} Ped.|${formatBrazilianCurrency(product.paidAmount)}`
        },
        barLabelPlacement: 'outside',
        valueFormatter: (_value: number | null, context) => {
          const product = data[context.dataIndex]
          return `${formatBrazilianCurrency(product.paidAmount)} · ${product.orderCount} Ped. · ${product.percentage.toFixed(1)}%`
        },
      }]}
      slots={{ barLabel: MultilineBarLabel }}
      slotProps={{ tooltip: { trigger: 'axis' } }}
      grid={{ horizontal: true }}
      margin={{ left: 0, right: 4, top: 64, bottom: 36 }}
    />
  )
}
