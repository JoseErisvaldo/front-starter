import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Alert, Card, CardContent, CircularProgress, FormControl, MenuItem, Select, Stack, Typography } from '@mui/material'
import { BarPlot, ChartsContainer, ChartsGrid, ChartsReferenceLine, ChartsTooltip, ChartsXAxis, ChartsYAxis } from '@mui/x-charts'
import { LayoutAdmin } from '../../../../../../shared/layout/layout-admin'
import { formatBrazilianDayMonthLabel, formatBrazilianMonthLabel } from '../../../../../../shared/utils/format-brazilian-date'
import { useLogout } from '../../../../../public/auth/hooks/use-logout'
import { getCustomerDashboardService } from '../services/customer-dashboard.service'
import type { CustomerDashboard } from '../schema/customer-dashboard.schema'

type Period = 'daily' | 'monthly'

function RegistrationChart({ data }: { data: CustomerDashboard['daily'] | CustomerDashboard['monthly'] }) {
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
      series={[
        {
          type: 'bar',
          dataKey: 'registrations',
          label: 'Novos clientes',
          color: '#31845c',
          barLabel: 'value',
          barLabelPlacement: 'outside',
        },
      ]}
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

export function CustomerDashboardRoute() {
  const logout = useLogout()
  const [period, setPeriod] = useState<Period>('daily')
  const dashboard = useQuery({
    queryKey: ['admin-customer-dashboard'],
    queryFn: getCustomerDashboardService,
  })

  return (
    <LayoutAdmin
      title="Dashboard de clientes"
      subtitle="Acompanhe o crescimento da base de clientes e a situação das assinaturas."
      onLogout={logout}
    >
      {dashboard.isLoading ? (
        <Stack sx={{ minHeight: 240, alignItems: 'center', justifyContent: 'center' }}>
          <CircularProgress />
        </Stack>
      ) : dashboard.error ? (
        <Alert severity="error">Não foi possível carregar os dados do dashboard de clientes.</Alert>
      ) : dashboard.data ? (
        <Stack spacing={3}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <Card variant="outlined" sx={{ flex: 1 }}>
              <CardContent>
                <Typography variant="body2" color="text.secondary">Total de clientes</Typography>
                <Typography variant="h4" sx={{ mt: 1, fontWeight: 700 }}>{dashboard.data.summary.totalCustomers}</Typography>
              </CardContent>
            </Card>
            <Card variant="outlined" sx={{ flex: 1 }}>
              <CardContent>
                <Typography variant="body2" color="text.secondary">Com assinatura ativa</Typography>
                <Typography variant="h4" sx={{ mt: 1, fontWeight: 700, color: 'success.main' }}>{dashboard.data.summary.activeSubscribers}</Typography>
              </CardContent>
            </Card>
            <Card variant="outlined" sx={{ flex: 1 }}>
              <CardContent>
                <Typography variant="body2" color="text.secondary">Sem assinatura ativa</Typography>
                <Typography variant="h4" sx={{ mt: 1, fontWeight: 700 }}>{dashboard.data.summary.nonSubscribers}</Typography>
              </CardContent>
            </Card>
            <Card variant="outlined" sx={{ flex: 1 }}>
              <CardContent>
                <Typography variant="body2" color="text.secondary">Novos neste mês</Typography>
                <Typography variant="h4" sx={{ mt: 1, fontWeight: 700 }}>{dashboard.data.summary.registeredThisMonth}</Typography>
              </CardContent>
            </Card>
          </Stack>
          <Card variant="outlined">
            <CardContent>
              <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ alignItems: { sm: 'center' }, justifyContent: 'space-between', gap: 2, mb: 2 }}>
                <Stack spacing={0.5}>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>Novos clientes</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Cadastros por {period === 'daily' ? 'dia' : 'mês'} e média do período
                  </Typography>
                </Stack>
                <FormControl size="small" sx={{ minWidth: 150 }}>
                  <Select value={period} onChange={(event) => setPeriod(event.target.value as Period)} aria-label="Agrupar cadastros">
                    <MenuItem value="daily">Por dia · 30 dias</MenuItem>
                    <MenuItem value="monthly">Por mês · 12 meses</MenuItem>
                  </Select>
                </FormControl>
              </Stack>
              <RegistrationChart data={period === 'daily' ? dashboard.data.daily : dashboard.data.monthly} />
            </CardContent>
          </Card>
        </Stack>
      ) : null}
    </LayoutAdmin>
  )
}
