import { ProductRankingChart } from './product-ranking-chart'
import type { OrdersDashboard } from '../../types/orders-dashboard.types'

export function TopProductsByRevenueChart({ data }: { data: OrdersDashboard['topProductsByRevenue'] }) {
  return <ProductRankingChart data={data} metric="revenue" />
}
