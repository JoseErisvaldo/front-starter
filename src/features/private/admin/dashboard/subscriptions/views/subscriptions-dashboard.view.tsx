import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Alert, Card, CardContent, Skeleton, Stack, Tab, Tabs, Typography } from '@mui/material'
import { formatBrazilianCurrency } from '../../../../../../shared/utils/format-brazilian-currency'
import { LayoutAdmin } from '../../../../../../shared/layout/layout-admin'
import { useLogout } from '../../../../../public/auth/hooks/use-logout'
import {
  getOrdersDashboardDateRange,
  OrdersDashboardFiltersForm,
  type OrdersDashboardFilters,
} from '../../orders/components/orders-dashboard-filters'
import { getSubscriptionsDashboardService } from '../services/subscriptions-dashboard.service'
import { SubscriptionsByDayChart } from '../components/subscriptions-by-day-chart'
import { SubscriptionsByStatusChart } from '../components/subscriptions-by-status-chart'
import { SubscriptionRevenueByDayChart } from '../components/subscription-revenue-by-day-chart'
import { SubscriptionsForecastChart } from '../components/subscriptions-forecast-chart'
import { UpcomingSubscriptionChargesTable } from '../components/upcoming-subscription-charges-table'
import { TopSubscriptionPlansChart } from '../components/top-subscription-plans-chart'

const DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000

function getPreviousDateRange({ dateFrom, dateTo }: { dateFrom: string; dateTo: string }) {
  const start = new Date(`${dateFrom}T00:00:00.000Z`)
  const end = new Date(`${dateTo}T00:00:00.000Z`)
  const dayCount = Math.round((end.getTime() - start.getTime()) / DAY_IN_MILLISECONDS) + 1
  const previousTo = new Date(start)
  previousTo.setUTCDate(previousTo.getUTCDate() - 1)
  const previousFrom = new Date(previousTo)
  previousFrom.setUTCDate(previousFrom.getUTCDate() - dayCount + 1)
  return {
    dateFrom: previousFrom.toISOString().slice(0, 10),
    dateTo: previousTo.toISOString().slice(0, 10),
  }
}

function PeriodChange({ current, previous }: { current: number; previous: number }) {
  if (previous === 0 && current !== 0) {
    return <Typography variant="caption" color="text.secondary">Novo no período</Typography>
  }
  const change = previous === 0 ? 0 : ((current - previous) / Math.abs(previous)) * 100
  const color = change > 0 ? 'success.main' : change < 0 ? 'error.main' : 'text.secondary'
  return (
    <Typography variant="caption" sx={{ color }}>
      {change > 0 ? '+' : ''}{change.toFixed(1)}% vs. período anterior
    </Typography>
  )
}

function MetricCard({ title, value, current, previous, loading }: {
  title: string
  value: string | number | undefined
  current?: number
  previous?: number
  loading: boolean
}) {
  return (
    <Card variant="outlined" sx={{ flex: '1 1 210px', minWidth: 0 }}>
      <CardContent>
        <Typography variant="body2" color="text.secondary">{title}</Typography>
        {loading || value === undefined
          ? <Skeleton variant="text" width={160} height={48} />
          : <Typography variant="h4" sx={{ mt: 1, fontWeight: 700 }}>{value}</Typography>}
        {current !== undefined && previous !== undefined
          ? <PeriodChange current={current} previous={previous} />
          : current !== undefined || loading
            ? <Skeleton variant="text" width={150} />
            : null}
      </CardContent>
    </Card>
  )
}

function ChartSkeleton({ height = 280 }: { height?: number }) {
  return <Skeleton variant="rounded" height={height} />
}

export function SubscriptionsDashboardView() {
  const logout = useLogout()
  const [activeTab, setActiveTab] = useState('overview')
  const [upcomingPage, setUpcomingPage] = useState(1)
  const [upcomingPageSize, setUpcomingPageSize] = useState(10)
  const [filters, setFilters] = useState<OrdersDashboardFilters>(() => ({
    preset: 'this_month',
    ...getOrdersDashboardDateRange('this_month', '', ''),
  }))
  const query = getOrdersDashboardDateRange(filters.preset, filters.dateFrom, filters.dateTo)
  const previousQuery = getPreviousDateRange(query)
  const dashboard = useQuery({
    queryKey: ['admin-subscriptions-dashboard', query, upcomingPage, upcomingPageSize],
    queryFn: () => getSubscriptionsDashboardService({
      ...query,
      upcomingPage,
      upcomingPageSize,
    }),
  })
  const previousDashboard = useQuery({
    queryKey: ['admin-subscriptions-dashboard', previousQuery, 'comparison'],
    queryFn: () => getSubscriptionsDashboardService({ ...previousQuery, comparison: true }),
  })
  const periodLabel = filters.preset === 'today'
    ? 'Hoje'
    : filters.preset === 'this_week'
      ? 'Esta semana'
      : filters.preset === 'this_month'
        ? 'Este mês'
        : filters.preset === 'last_30_days'
          ? 'Últimos 30 dias'
          : filters.preset === 'last_month'
            ? 'Mês passado'
            : `${filters.dateFrom} a ${filters.dateTo}`
  const data = dashboard.data
  const comparison = previousDashboard.data

  return (
    <LayoutAdmin
      title="Dashboard de assinaturas"
      subtitle="Acompanhe assinaturas, cobranças pagas e a evolução dos planos."
      onLogout={logout}
      actions={activeTab === 'overview' ? [{
        id: 'subscriptions-dashboard-filters',
        title: 'Filtrar dashboard de assinaturas',
        subtitle: 'Escolha o período que deseja analisar.',
        label: 'Filtrar período',
        content: ({ close }) => (
          <OrdersDashboardFiltersForm
            key={JSON.stringify(filters)}
            filters={filters}
            onApply={setFilters}
            onClose={close}
          />
        ),
      }] : []}
    >
      <Tabs
        value={activeTab}
        onChange={(_, value: string) => setActiveTab(value)}
        aria-label="Seções do dashboard de assinaturas"
        sx={{ mb: 3 }}
      >
        <Tab value="overview" label="Visão geral" />
        <Tab value="projection" label="Projeção" />
      </Tabs>
      {dashboard.error ? (
        <Alert severity="error">Não foi possível carregar o dashboard de assinaturas.</Alert>
      ) : activeTab === 'projection' ? (
        <Stack spacing={3}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>Previsão para os próximos 30 dias</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Estimativa baseada nas próximas cobranças agendadas das assinaturas ativas. As recorrências futuras são projetadas pela periodicidade do plano; não é garantia de aprovação.
              </Typography>
              {data ? (
                <>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      {data.forecast.totalExpectedCharges} cobranças previstas
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: 'success.main' }}>
                      {formatBrazilianCurrency(data.forecast.totalExpectedAmount)} estimados
                    </Typography>
                  </Stack>
                  <SubscriptionsForecastChart data={data.forecast.daily} />
                </>
              ) : <ChartSkeleton height={400} />}
            </CardContent>
          </Card>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>Próximas cobranças previstas</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Lista das cobranças que compõem a projeção de até 30 dias, com o prazo de cada uma a partir de hoje.
              </Typography>
              {data
                ? <UpcomingSubscriptionChargesTable
                    data={data.forecast.upcomingCharges}
                    startDate={data.forecast.startDate}
                    onPageChange={setUpcomingPage}
                    onPageSizeChange={(pageSize) => {
                      setUpcomingPageSize(pageSize)
                      setUpcomingPage(1)
                    }}
                  />
                : <ChartSkeleton height={240} />}
            </CardContent>
          </Card>
        </Stack>
      ) : (
        <Stack spacing={3}>
          <Typography variant="body2" color="text.secondary">Período: {periodLabel}</Typography>
          {previousDashboard.error ? (
            <Alert severity="error">Não foi possível carregar a comparação com o período anterior.</Alert>
          ) : comparison ? (
            <Typography variant="caption" color="text.secondary">
              Comparação com {new Date(`${previousQuery.dateFrom}T00:00:00.000Z`).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
              {' a '}
              {new Date(`${previousQuery.dateTo}T00:00:00.000Z`).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
            </Typography>
          ) : null}

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ flexWrap: 'wrap' }}>
            <MetricCard
              title="Novas assinaturas"
              value={data?.summary.totalSubscriptions}
              current={data?.summary.totalSubscriptions}
              previous={comparison?.summary.totalSubscriptions}
              loading={!data}
            />
            <MetricCard
              title="Assinaturas ativas"
              value={data?.summary.activeSubscriptions}
              loading={!data}
            />
            <MetricCard
              title="Cobranças pagas"
              value={data?.summary.paidCharges}
              current={data?.summary.paidCharges}
              previous={comparison?.summary.paidCharges}
              loading={!data}
            />
            <MetricCard
              title="Valor recebido"
              value={data ? formatBrazilianCurrency(data.summary.paidRevenue) : undefined}
              current={data?.summary.paidRevenue}
              previous={comparison?.summary.paidRevenue}
              loading={!data}
            />
          </Stack>

          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>Novas assinaturas por dia e status</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Quantidade de assinaturas criadas em cada dia, agrupadas pelo status atual.
              </Typography>
              {data
                ? data.statuses.length
                  ? <SubscriptionsByDayChart data={data.daily} statuses={data.statuses} />
                  : <Typography color="text.secondary" sx={{ py: 8, textAlign: 'center' }}>Nenhuma assinatura neste período.</Typography>
                : <ChartSkeleton height={300} />}
            </CardContent>
          </Card>

          <Stack direction={{ xs: 'column', lg: 'row' }} spacing={2}>
            <Card variant="outlined" sx={{ flex: 1, minWidth: 0 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>Assinaturas por status</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Distribuição das assinaturas criadas no período.
                </Typography>
                {data
                  ? data.statuses.length
                    ? <SubscriptionsByStatusChart data={data.statuses} />
                    : <Typography color="text.secondary" sx={{ py: 8, textAlign: 'center' }}>Nenhuma assinatura neste período.</Typography>
                  : <ChartSkeleton height={250} />}
              </CardContent>
            </Card>
            <Card variant="outlined" sx={{ flex: 1, minWidth: 0 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>Planos mais contratados</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Os 10 planos com mais novas assinaturas no período. O valor contratado soma as cobranças previstas por plano e não representa necessariamente valores recebidos.
                </Typography>
                {data
                  ? data.plans.length
                    ? <TopSubscriptionPlansChart data={data.plans} />
                    : <Typography color="text.secondary" sx={{ py: 8, textAlign: 'center' }}>Nenhum plano contratado neste período.</Typography>
                  : <ChartSkeleton />}
              </CardContent>
            </Card>
          </Stack>

          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>Cobranças pagas por dia</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Valores recebidos em cobranças aprovadas no período.
              </Typography>
              {data ? <SubscriptionRevenueByDayChart data={data.daily} /> : <ChartSkeleton />}
            </CardContent>
          </Card>

        </Stack>
      )}
    </LayoutAdmin>
  )
}
