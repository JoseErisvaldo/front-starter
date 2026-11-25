import { ProductRankingChart } from './product-ranking-chart'
import type { OrdersDashboard } from '../schema/orders-dashboard.schema'

export function TopProductsByOrdersChart({ data }: { data: OrdersDashboard['topProductsByOrders'] }) {
  return <ProductRankingChart data={data} metric="orders" />
}
