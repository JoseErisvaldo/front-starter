import { Alert, Card, CardContent, Skeleton, Stack, Typography } from '@mui/material'
import { LayoutAdmin } from '../../../../../../shared/layout/layout-admin'
import { useLogout } from '../../../../../public/auth/hooks/use-logout'
import { getOrdersDashboardActions } from '../constants/orders-dashboard.actions'
import { OrdersDashboardSummary } from '../components/orders-dashboard-summary'
import { useOrdersDashboardPage } from '../hooks/use-orders-dashboard-page'
import { OrdersByStatusChart } from '../components/orders-by-status-chart'
import { OrdersByStatusByDayChart } from '../components/orders-by-status-by-day-chart'
import { PaidSalesByDayChart } from '../components/paid-sales-by-day-chart'
import { PaymentMethodsByDayChart } from '../components/payment-methods-by-day-chart'
import { TopProductsByOrdersChart } from '../components/top-products/top-products-by-orders-chart'
import { TopProductsByRevenueChart } from '../components/top-products/top-products-by-revenue-chart'
import { TotalOrdersByDayChart } from '../components/total-orders-by-day-chart/total-orders-by-day-chart'
import { TotalOrdersByDayChartSkeleton } from '../components/total-orders-by-day-chart/total-orders-by-day-chart.skeleton'

export function OrdersDashboardView() {
  const logout = useLogout()
  const {
    filters,
    setFilters,
    previousQuery,
    dashboard,
    previousDashboard,
    periodLabel,
  } = useOrdersDashboardPage()

  return (
    <LayoutAdmin
      title="Dashboard de pedidos"
      subtitle="Acompanhe vendas, pagamentos e a distribuição dos pedidos por status."
      onLogout={logout}
      actions={getOrdersDashboardActions(filters, setFilters)}
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
      <OrdersDashboardSummary data={dashboard.data} previousData={previousDashboard.data} />
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
            : <TotalOrdersByDayChartSkeleton />}
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
