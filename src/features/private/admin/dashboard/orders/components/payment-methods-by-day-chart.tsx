import { BarChart } from '@mui/x-charts/BarChart'
import { formatBrazilianCurrency } from '../../../../../../shared/utils/format-brazilian-currency'
import { formatBrazilianDayMonthLabel } from '../../../../../../shared/utils/format-brazilian-date'
import type { OrdersDashboard } from '../types/orders-dashboard.types'
import { formatOrdersChartCurrency, getPaymentMethodLabel } from '../utils/orders-dashboard-formatters'
import { MultilineBarLabel } from './multiline-bar-label'

export function PaymentMethodsByDayChart({ data, paymentMethods }: {
  data: OrdersDashboard['daily']
  paymentMethods: OrdersDashboard['paymentMethods']
}) {
  const maxSales = Math.max(0, ...data.flatMap((day) =>
    Object.values(day.paymentMethods).map(({ sales }) => sales),
  ))
  const chartData = data.map((item) => ({
    day: formatBrazilianDayMonthLabel(item.date),
    ...Object.fromEntries(
      Object.entries(item.paymentMethods).flatMap(([method, values]) => [
        [method, values.sales],
        [`${method}Orders`, values.orders],
        [`${method}Percentage`, values.percentage],
      ]),
    ),
  }))

  return (
    <BarChart
      height={260}
      dataset={chartData}
      xAxis={[{ scaleType: 'band', dataKey: 'day', tickLabelStyle: { fontSize: 11 } }]}
      series={paymentMethods.map((item, index) => ({
        dataKey: item.paymentMethod,
        label: getPaymentMethodLabel(item.paymentMethod),
        color: ['#31845c', '#568bb8', '#e3a23b', '#8a6bb8', '#d46b6b'][index % 5],
        barLabel: (bar: { value: number | null; dataIndex: number }) => {
          const values = data[bar.dataIndex]?.paymentMethods[item.paymentMethod]
          return `${(values?.percentage ?? 0).toFixed(1)}%|${values?.orders ?? 0} Ped.|${formatOrdersChartCurrency(bar.value ?? 0)}`
        },
        barLabelPlacement: 'outside' as const,
        valueFormatter: (value: number | null, context) => {
          const values = data[context.dataIndex]?.paymentMethods[item.paymentMethod]
          return `${formatBrazilianCurrency(value ?? 0)} · ${values?.orders ?? 0} Ped. · ${(values?.percentage ?? 0).toFixed(1)}%`
        },
      }))}
      slots={{ barLabel: MultilineBarLabel }}
      slotProps={{ tooltip: { trigger: 'axis' } }}
      yAxis={[{ width: 64, max: maxSales > 0 ? maxSales * 1.35 : undefined, valueFormatter: (value: number) => formatOrdersChartCurrency(value) }]}
      grid={{ horizontal: true }}
      margin={{ left: 4, right: 12, top: 64, bottom: 36 }}
    />
  )
}
