import { Stack, Typography } from '@mui/material'
import { BarChart } from '@mui/x-charts/BarChart'
import type { SubscriptionsDashboard } from '../types/subscriptions-dashboard.types'
import { formatBrazilianCurrency } from '../utils/subscription-dashboard-formatters'

export function TopSubscriptionPlansChart({ data }: { data: SubscriptionsDashboard['plans'] }) {
  return (
    <>
      <BarChart
        height={280}
        dataset={data}
        xAxis={[{
          scaleType: 'band',
          dataKey: 'name',
          valueFormatter: (name: string) => name.length > 12 ? `${name.slice(0, 11)}…` : name,
          tickLabelStyle: { fontSize: 10 },
        }]}
        yAxis={[{ min: 0, tickMinStep: 1 }]}
        series={[{
          dataKey: 'count',
          label: 'Assinaturas',
          color: '#568bb8',
          valueFormatter: (value: number | null, context) => {
            const plan = data[context.dataIndex]
            return `${value ?? 0} assinaturas · ${plan.percentage.toFixed(1)}% · ${formatBrazilianCurrency(plan.contractedAmount)}`
          },
        }]}
        slotProps={{ tooltip: { trigger: 'axis' } }}
        grid={{ horizontal: true }}
        margin={{ left: 8, right: 12, top: 24, bottom: 52 }}
      />
      <Stack spacing={0.75} sx={{ mt: 1 }}>
        {data.map((plan) => (
          <Stack
            key={plan.name}
            direction={{ xs: 'column', sm: 'row' }}
            spacing={0.5}
            sx={{ alignItems: { sm: 'center' }, justifyContent: 'space-between', borderTop: '1px solid', borderColor: 'divider', pt: 0.75 }}
          >
            <Typography variant="body2" sx={{ fontWeight: 600 }}>{plan.name}</Typography>
            <Stack direction="row" spacing={1.5} sx={{ flexShrink: 0 }}>
              <Typography variant="caption" color="text.secondary">{plan.count} assinaturas</Typography>
              <Typography variant="caption" sx={{ fontWeight: 700 }}>{formatBrazilianCurrency(plan.contractedAmount)}</Typography>
            </Stack>
          </Stack>
        ))}
      </Stack>
    </>
  )
}
