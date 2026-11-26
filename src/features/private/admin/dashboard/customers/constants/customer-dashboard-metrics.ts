import type { CustomerDashboard } from '../types/customer-dashboard.types'

export const customerDashboardMetrics = [
  { title: 'Total de clientes', key: 'totalCustomers' },
  { title: 'Com assinatura ativa', key: 'activeSubscribers', color: 'success.main' },
  { title: 'Sem assinatura ativa', key: 'nonSubscribers' },
  { title: 'Novos neste mês', key: 'registeredThisMonth' },
] as const satisfies ReadonlyArray<{
  title: string
  key: keyof CustomerDashboard['summary']
  color?: string
}>
