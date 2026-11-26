import type { OrdersDashboard } from '../types/orders-dashboard.types'

export const ordersDashboardMetrics = [
  { title: 'Total de pedidos', key: 'totalOrders', format: 'number' },
  { title: 'Valor total de vendas pagas', key: 'totalSales', format: 'currency', color: 'success.main' },
  { title: 'Pedidos pagos', key: 'paidOrders', format: 'number' },
  { title: 'Média por pedido pago', key: 'averagePaidOrder', format: 'currency' },
] as const satisfies ReadonlyArray<{
  title: string
  key: keyof OrdersDashboard['summary']
  format: 'number' | 'currency'
  color?: string
}>
