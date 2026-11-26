import { BarPlot, ChartsContainer, ChartsGrid, ChartsReferenceLine, ChartsTooltip, ChartsXAxis, ChartsYAxis } from '@mui/x-charts'
import { formatBrazilianDayMonthLabel, formatBrazilianMonthLabel } from '../../../../../../shared/utils/format-brazilian-date'
import type { CustomerDashboard } from '../types/customer-dashboard.types'

export function RegistrationChart({ data }: {
  data: CustomerDashboard['daily'] | CustomerDashboard['monthly']
}) {
  const average = data[0]?.average ?? 0
  const chartData = data.map((item) => ({
    label: 'date' in item
      ? formatBrazilianDayMonthLabel(item.date)
      : formatBrazilianMonthLabel(item.month),
    registrations: item.count,
  }))

  return (
    <ChartsContainer
      height={360}
      dataset={chartData}
      xAxis={[{ scaleType: 'band', dataKey: 'label', tickLabelStyle: { fontSize: 11 } }]}
      yAxis={[{ min: 0, width: 40 }]}
      series={[{
        type: 'bar',
        dataKey: 'registrations',
        label: 'Novos clientes',
        color: '#31845c',
        barLabel: 'value',
        barLabelPlacement: 'outside',
      }]}
      margin={{ left: 8, right: 16, top: 40, bottom: 40 }}
    >
      <ChartsGrid horizontal />
      <BarPlot />
      <ChartsReferenceLine
        y={average}
        label={`Média: ${average.toFixed(1)}`}
        labelAlign="end"
        lineStyle={{ stroke: '#000000', strokeWidth: 2 }}
        labelStyle={{ fill: '#000000', fontSize: 12, fontWeight: 700 }}
      />
      <ChartsXAxis />
      <ChartsYAxis />
      <ChartsTooltip />
    </ChartsContainer>
  )
}
