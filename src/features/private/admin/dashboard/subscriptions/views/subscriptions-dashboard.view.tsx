import { Alert, Card, CardContent, Stack, Tab, Tabs, Typography } from '@mui/material'
import { formatBrazilianCurrency } from '../../../../../../shared/utils/format-brazilian-currency'
import { LayoutAdmin } from '../../../../../../shared/layout/layout-admin'
import { useLogout } from '../../../../../public/auth/hooks/use-logout'
import { getSubscriptionsDashboardActions } from '../constants/subscriptions-dashboard.actions'
import { SubscriptionsDashboardSummary } from '../components/subscriptions-dashboard-summary/subscriptions-dashboard-summary'
import { DashboardChartSkeleton } from '../components/dashboard-chart-skeleton'
import { SubscriptionsByDayChart } from '../components/subscription-status/subscriptions-by-day-chart'
import { SubscriptionsByStatusChart } from '../components/subscription-status/subscriptions-by-status-chart'
import { SubscriptionRevenueByDayChart } from '../components/subscription-revenue-by-day-chart'
import { SubscriptionsForecastChart } from '../components/subscriptions-forecast/subscriptions-forecast-chart'
import { UpcomingSubscriptionChargesTable } from '../components/subscriptions-forecast/upcoming-subscription-charges-table'
import { TopSubscriptionPlansChart } from '../components/top-subscription-plans-chart'
import { useSubscriptionsDashboardPage } from '../hooks/use-subscriptions-dashboard-page'

export function SubscriptionsDashboardView() {
  const logout = useLogout()
  const {
    activeTab,
    setActiveTab,
    setUpcomingPage,
    changeUpcomingPageSize,
    filters,
    setFilters,
    previousQuery,
    dashboard,
    previousDashboard,
    periodLabel,
  } = useSubscriptionsDashboardPage()
  const data = dashboard.data
  const comparison = previousDashboard.data

  return (
    <LayoutAdmin
      title="Dashboard de assinaturas"
      subtitle="Acompanhe assinaturas, cobranças pagas e a evolução dos planos."
      onLogout={logout}
      actions={activeTab === 'overview' ? getSubscriptionsDashboardActions(filters, setFilters) : []}
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
              ) : <DashboardChartSkeleton height={400} />}
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
                    onPageSizeChange={changeUpcomingPageSize}
                  />
                : <DashboardChartSkeleton height={240} />}
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

          <SubscriptionsDashboardSummary data={data} comparison={comparison} />

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
                : <DashboardChartSkeleton height={300} />}
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
                  : <DashboardChartSkeleton height={250} />}
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
                  : <DashboardChartSkeleton />}
              </CardContent>
            </Card>
          </Stack>

          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>Cobranças pagas por dia</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Valores recebidos em cobranças aprovadas no período.
              </Typography>
              {data ? <SubscriptionRevenueByDayChart data={data.daily} /> : <DashboardChartSkeleton />}
            </CardContent>
          </Card>

        </Stack>
      )}
    </LayoutAdmin>
  )
}
