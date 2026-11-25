import { BarPlot, ChartsContainer, ChartsGrid, ChartsLegend, ChartsTooltip, ChartsXAxis, ChartsYAxis, LinePlot } from '@mui/x-charts'
import { formatBrazilianDayMonthLabel } from '../../../../../../shared/utils/format-brazilian-date'
import type { SubscriptionsDashboard } from '../schema/subscriptions-dashboard.schema'
import { formatBrazilianCurrency, formatSubscriptionChartCurrency } from '../utils/subscription-dashboard-formatters'

export function SubscriptionsForecastChart({ data }: {
  data: SubscriptionsDashboard['forecast']['daily']
}) {
  const chartData = data.map((item) => ({
    day: formatBrazilianDayMonthLabel(item.date),
    expectedAmount: item.expectedAmount,
    expectedCharges: item.expectedCharges,
  }))

  return (
    <ChartsContainer
      height={360}
      dataset={chartData}
      xAxis={[{ id: 'day', scaleType: 'band', dataKey: 'day', tickLabelStyle: { fontSize: 11 } }]}
      yAxis={[
        {
          id: 'amount',
          position: 'left',
          min: 0,
          width: 72,
          valueFormatter: (value: number) => formatSubscriptionChartCurrency(value),
        },
        {
          id: 'charges',
          position: 'right',
          min: 0,
          tickMinStep: 1,
          width: 40,
        },
      ]}
      series={[
        {
          type: 'bar',
          dataKey: 'expectedAmount',
          label: 'Valor previsto',
          color: '#31845c',
          xAxisId: 'day',
          yAxisId: 'amount',
          valueFormatter: (value) => formatBrazilianCurrency(value ?? 0),
        },
        {
          type: 'line',
          dataKey: 'expectedCharges',
          label: 'Cobranças previstas',
          color: '#568bb8',
          xAxisId: 'day',
          yAxisId: 'charges',
          showMark: true,
          valueFormatter: (value) => `${value ?? 0} cobranças`,
        },
      ]}
      margin={{ left: 8, right: 12, top: 24, bottom: 36 }}
    >
      <ChartsGrid horizontal />
      <BarPlot />
      <LinePlot />
      <ChartsXAxis axisId="day" />
      <ChartsYAxis axisId="amount" />
      <ChartsYAxis axisId="charges" />
      <ChartsTooltip trigger="axis" />
      <ChartsLegend />
    </ChartsContainer>
  )
}
