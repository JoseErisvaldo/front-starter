import { Box, Stack, Typography } from '@mui/material'
import { PieChart } from '@mui/x-charts/PieChart'
import type { SubscriptionsDashboard } from '../schema/subscriptions-dashboard.schema'
import { getSubscriptionStatusColor, getSubscriptionStatusLabel } from '../utils/subscription-dashboard-formatters'

export function SubscriptionsByStatusChart({ data }: { data: SubscriptionsDashboard['statuses'] }) {
  const chartData = data.map((item, index) => ({
    id: item.status,
    label: getSubscriptionStatusLabel(item.status),
    value: item.count,
    color: getSubscriptionStatusColor(item.status, index),
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
            const status = data.find(({ status }) => status === item.id)
            return status ? `${status.percentage.toFixed(1)}%` : ''
          },
          valueFormatter: (_value, context) => {
            const status = data[context.dataIndex]
            return `${status.count} assinaturas · ${status.percentage.toFixed(1)}%`
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
              <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: getSubscriptionStatusColor(item.status, index), flexShrink: 0 }} />
              <Typography variant="body2" noWrap>{getSubscriptionStatusLabel(item.status)}</Typography>
            </Stack>
            <Stack sx={{ alignItems: 'flex-end', flexShrink: 0 }}>
              <Typography variant="body2" sx={{ fontWeight: 700 }}>{item.count}</Typography>
              <Typography variant="caption" color="text.secondary">{item.percentage.toFixed(1)}%</Typography>
            </Stack>
          </Stack>
        ))}
      </Stack>
    </Stack>
  )
}
