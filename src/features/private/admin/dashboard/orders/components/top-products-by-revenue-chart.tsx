import { ProductRankingChart } from './product-ranking-chart'
import type { OrdersDashboard } from '../schema/orders-dashboard.schema'

export function TopProductsByRevenueChart({ data }: { data: OrdersDashboard['topProductsByRevenue'] }) {
  return <ProductRankingChart data={data} metric="revenue" />
}
