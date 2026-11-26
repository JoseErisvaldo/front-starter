import { ProductRankingChart } from './product-ranking-chart'
import type { OrdersDashboard } from '../../types/orders-dashboard.types'

export function TopProductsByOrdersChart({ data }: { data: OrdersDashboard['topProductsByOrders'] }) {
  return <ProductRankingChart data={data} metric="orders" />
}
