import type { SubscriptionsDashboard } from '../types/subscriptions-dashboard.types'

export const subscriptionsDashboardMetrics = [
  { title: 'Novas assinaturas', key: 'totalSubscriptions', compare: true },
  { title: 'Assinaturas ativas', key: 'activeSubscriptions', compare: false },
  { title: 'Cobranças pagas', key: 'paidCharges', compare: true },
  { title: 'Valor recebido', key: 'paidRevenue', compare: true, format: 'currency' },
] as const satisfies ReadonlyArray<{
  title: string
  key: keyof SubscriptionsDashboard['summary']
  compare: boolean
  format?: 'currency'
}>
