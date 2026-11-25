import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Alert, Card, CardContent, Skeleton, Stack, Typography } from '@mui/material'
import { formatBrazilianCurrency } from '../../../../../../shared/utils/format-brazilian-currency'
import { LayoutAdmin } from '../../../../../../shared/layout/layout-admin'
import { useLogout } from '../../../../../public/auth/hooks/use-logout'
import {
  getOrdersDashboardDateRange,
  OrdersDashboardFiltersForm,
  type OrdersDashboardFilters,
} from '../components/orders-dashboard-filters'
import { getOrdersDashboardService } from '../services/orders-dashboard.service'
import { OrdersByStatusChart } from '../components/orders-by-status-chart'
import { OrdersByStatusByDayChart } from '../components/orders-by-status-by-day-chart'
import { PaidSalesByDayChart } from '../components/paid-sales-by-day-chart'
import { PaymentMethodsByDayChart } from '../components/payment-methods-by-day-chart'
import { TopProductsByOrdersChart } from '../components/top-products-by-orders-chart'
import { TopProductsByRevenueChart } from '../components/top-products-by-revenue-chart'
import { TotalOrdersByDayChart } from '../components/total-orders-by-day-chart'

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
  const sign = change > 0 ? '+' : ''
  return (
    <Typography variant="caption" sx={{ color }}>
      {sign}{change.toFixed(1)}% vs. período anterior
    </Typography>
  )
}

export function OrdersDashboardView() {
  const logout = useLogout()
  const [filters, setFilters] = useState<OrdersDashboardFilters>(() => ({
    preset: 'this_month',
    ...getOrdersDashboardDateRange('this_month', '', ''),
  }))
  const query = getOrdersDashboardDateRange(filters.preset, filters.dateFrom, filters.dateTo)
  const previousQuery = getPreviousDateRange(query)
  const dashboard = useQuery({
    queryKey: ['admin-orders-dashboard', query],
    queryFn: () => getOrdersDashboardService(query),
  })
  const previousDashboard = useQuery({
    queryKey: ['admin-orders-dashboard', previousQuery, 'comparison'],
    queryFn: () => getOrdersDashboardService({ ...previousQuery, comparison: true }),
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

  return (
    <LayoutAdmin
      title="Dashboard de pedidos"
      subtitle="Acompanhe vendas, pagamentos e a distribuição dos pedidos por status."
      onLogout={logout}
      actions={[{
        id: 'orders-dashboard-filters',
        title: 'Filtrar dashboard de pedidos',
        subtitle: 'Escolha um período rápido ou defina as datas.',
        label: 'Filtrar período',
        content: ({ close }) => (
          <OrdersDashboardFiltersForm
            key={JSON.stringify(filters)}
            filters={filters}
            onApply={setFilters}
            onClose={close}
          />
        ),
      }]}
    >
      {dashboard.error ? (
        <Alert severity="error">Não foi possível carregar o dashboard de pedidos.</Alert>
      ) : (
      <Stack spacing={3}>
      <Typography variant="body2" color="text.secondary">Período: {periodLabel}</Typography>
      {previousDashboard.error ? (
        <Alert severity="error">Não foi possível carregar a comparação com o período anterior.</Alert>
      ) : previousDashboard.data ? (
        <Typography variant="caption" color="text.secondary">
          Comparação com {new Date(`${previousQuery.dateFrom}T00:00:00.000Z`).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
          {' a '}
          {new Date(`${previousQuery.dateTo}T00:00:00.000Z`).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
        </Typography>
      ) : null}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ flexWrap: 'wrap' }}>
        <Card variant="outlined" sx={{ flex: '1 1 210px' }}>
          <CardContent>
            <Typography variant="body2" color="text.secondary">Total de pedidos</Typography>
            {dashboard.data ? <Typography variant="h4" sx={{ mt: 1, fontWeight: 700 }}>{dashboard.data.summary.totalOrders}</Typography> : <Skeleton variant="text" width={100} height={48} />}
            {dashboard.data && previousDashboard.data
              ? <PeriodChange current={dashboard.data.summary.totalOrders} previous={previousDashboard.data.summary.totalOrders} />
              : <Skeleton variant="text" width={150} />}
          </CardContent>
        </Card>
        <Card variant="outlined" sx={{ flex: '1 1 210px' }}>
          <CardContent>
            <Typography variant="body2" color="text.secondary">Valor total de vendas pagas</Typography>
            {dashboard.data ? <Typography variant="h4" sx={{ mt: 1, fontWeight: 700, color: 'success.main' }}>{formatBrazilianCurrency(dashboard.data.summary.totalSales)}</Typography> : <Skeleton variant="text" width={180} height={48} />}
            {dashboard.data && previousDashboard.data
              ? <PeriodChange current={dashboard.data.summary.totalSales} previous={previousDashboard.data.summary.totalSales} />
              : <Skeleton variant="text" width={150} />}
          </CardContent>
        </Card>
        <Card variant="outlined" sx={{ flex: '1 1 210px' }}>
          <CardContent>
            <Typography variant="body2" color="text.secondary">Pedidos pagos</Typography>
            {dashboard.data ? <Typography variant="h4" sx={{ mt: 1, fontWeight: 700 }}>{dashboard.data.summary.paidOrders}</Typography> : <Skeleton variant="text" width={100} height={48} />}
            {dashboard.data && previousDashboard.data
              ? <PeriodChange current={dashboard.data.summary.paidOrders} previous={previousDashboard.data.summary.paidOrders} />
              : <Skeleton variant="text" width={150} />}
          </CardContent>
        </Card>
        <Card variant="outlined" sx={{ flex: '1 1 210px' }}>
          <CardContent>
            <Typography variant="body2" color="text.secondary">Média por pedido pago</Typography>
            {dashboard.data ? <Typography variant="h4" sx={{ mt: 1, fontWeight: 700 }}>{formatBrazilianCurrency(dashboard.data.summary.averagePaidOrder)}</Typography> : <Skeleton variant="text" width={160} height={48} />}
            {dashboard.data && previousDashboard.data
              ? <PeriodChange current={dashboard.data.summary.averagePaidOrder} previous={previousDashboard.data.summary.averagePaidOrder} />
              : <Skeleton variant="text" width={150} />}
          </CardContent>
        </Card>
      </Stack>
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>Vendas pagas por dia</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Valores pagos e pedidos aprovados no período</Typography>
          {dashboard.data
            ? <PaidSalesByDayChart data={dashboard.data.daily} />
            : <Skeleton variant="rounded" height={260} />}
        </CardContent>
      </Card>
      <Stack direction={{ xs: 'column', lg: 'row' }} spacing={2}>
        <Card variant="outlined" sx={{ flex: 1, minWidth: 0 }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>Pedidos por status</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Quantidade e valor dos pedidos; valor do pedido não significa necessariamente pagamento recebido.
            </Typography>
            {dashboard.data
              ? dashboard.data.statuses.length
                ? <OrdersByStatusChart data={dashboard.data.statuses} />
                : <Typography color="text.secondary" sx={{ py: 8, textAlign: 'center' }}>Nenhum pedido neste período.</Typography>
              : <Skeleton variant="rounded" height={260} />}
          </CardContent>
        </Card>
      </Stack>
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>Pedidos por status por dia</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Acompanhe diariamente a quantidade de pedidos em cada status.
          </Typography>
          {dashboard.data
            ? dashboard.data.statuses.length
              ? <OrdersByStatusByDayChart data={dashboard.data.daily} statuses={dashboard.data.statuses} />
              : <Typography color="text.secondary" sx={{ py: 8, textAlign: 'center' }}>Nenhum pedido neste período.</Typography>
            : <Skeleton variant="rounded" height={260} />}
        </CardContent>
      </Card>
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>Total de pedidos por dia</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Quantidade e valor bruto dos pedidos criados em cada dia</Typography>
          {dashboard.data
            ? <TotalOrdersByDayChart data={dashboard.data.daily} />
            : <Skeleton variant="rounded" height={260} />}
        </CardContent>
      </Card>
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>Vendas pagas por dia e meio de pagamento</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Compare diariamente os valores pagos por cada meio de pagamento</Typography>
          {dashboard.data
            ? dashboard.data.paymentMethods.length
              ? <PaymentMethodsByDayChart data={dashboard.data.daily} paymentMethods={dashboard.data.paymentMethods} />
              : <Typography color="text.secondary" sx={{ py: 8, textAlign: 'center' }}>Nenhuma venda paga neste período.</Typography>
            : <Skeleton variant="rounded" height={260} />}
        </CardContent>
      </Card>
      <Stack direction={{ xs: 'column', lg: 'row' }} spacing={2} sx={{ alignItems: 'stretch' }}>
        <Card variant="outlined" sx={{ flex: 1, minWidth: 0 }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>Top 10 produtos por pedidos</Typography>
            <Typography variant="body2" color="text.secondary">
              Quantidade de pedidos pagos. O valor complementar considera somente o valor pago.
            </Typography>
            {dashboard.data
              ? <TopProductsByOrdersChart data={dashboard.data.topProductsByOrders} />
              : <Skeleton variant="rounded" height={220} />}
          </CardContent>
        </Card>
        <Card variant="outlined" sx={{ flex: 1, minWidth: 0 }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>Top 10 produtos por valor pago</Typography>
            <Typography variant="body2" color="text.secondary">
              Soma do valor pago dos itens em pedidos pagos.
            </Typography>
            {dashboard.data
              ? <TopProductsByRevenueChart data={dashboard.data.topProductsByRevenue} />
              : <Skeleton variant="rounded" height={220} />}
          </CardContent>
        </Card>
      </Stack>
      </Stack>
      )}
    </LayoutAdmin>
  )
}
