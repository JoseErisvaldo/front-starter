import { Box, Stack, Typography } from '@mui/material'
import { PieChart } from '@mui/x-charts/PieChart'
import { formatBrazilianCurrency } from '../../../../../../shared/utils/format-brazilian-currency'
import type { OrdersDashboard } from '../schema/orders-dashboard.schema'
import { getOrderStatusColor, getOrderStatusLabel } from '../utils/orders-dashboard-formatters'

export function OrdersByStatusChart({ data }: { data: OrdersDashboard['statuses'] }) {
  const chartData = data.map((item, index) => ({
    id: item.status,
    label: getOrderStatusLabel(item.status),
    value: item.count,
    percentage: item.percentage,
    color: getOrderStatusColor(item.status, index),
  }))

  return (
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ alignItems: 'center' }}>
      <PieChart
        height={250}
        hideLegend
        series={[{
          data: chartData,
          innerRadius: 58,
          outerRadius: 105,
          paddingAngle: 2,
          arcLabel: (item) => {
            const percentage = data.find(({ status }) => status === item.id)?.percentage
            return percentage === undefined ? '' : `${percentage.toFixed(1)}%`
          },
          valueFormatter: (_value, context) => {
            const item = data[context.dataIndex]
            return `${formatBrazilianCurrency(item.orderValue)} · ${item.count} Ped. · ${item.percentage.toFixed(1)}%`
          },
          arcLabelMinAngle: 15,
        }]}
        colors={chartData.map(({ color }) => color)}
        sx={{ width: { xs: '100%', sm: '55%' }, maxWidth: 330 }}
      />
      <Stack spacing={1.25} sx={{ width: { xs: '100%', sm: '45%' } }}>
        {data.map((item, index) => (
          <Stack key={item.status} direction="row" spacing={1} sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center', minWidth: 0 }}>
              <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: getOrderStatusColor(item.status, index), flexShrink: 0 }} />
              <Typography variant="body2" noWrap>{getOrderStatusLabel(item.status)}</Typography>
            </Stack>
            <Stack sx={{ alignItems: 'flex-end', flexShrink: 0 }}>
              <Typography variant="body2" sx={{ fontWeight: 700 }}>{item.percentage.toFixed(1)}%</Typography>
              <Typography variant="caption" color="text.secondary">{item.count} Ped.</Typography>
              <Typography variant="caption" color="text.secondary">{formatBrazilianCurrency(item.orderValue)}</Typography>
            </Stack>
          </Stack>
        ))}
      </Stack>
    </Stack>
  )
}
