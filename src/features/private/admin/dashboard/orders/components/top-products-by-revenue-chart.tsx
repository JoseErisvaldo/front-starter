import type { OrdersDashboard } from "../types/orders-dashboard.types";
import { ProductRankingChart } from "./top-products/product-ranking-chart";

export function TopProductsByRevenueChart({
  data,
}: {
  data: OrdersDashboard["topProductsByRevenue"];
}) {
  return <ProductRankingChart data={data} metric="revenue" />;
}
