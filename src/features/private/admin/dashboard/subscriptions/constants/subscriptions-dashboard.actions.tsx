import type { LayoutAdminAction } from '../../../../../../shared/layout/layout-admin'
import { OrdersDashboardFiltersForm } from '../../orders/components/orders-dashboard-filters'
import type { OrdersDashboardFilters } from '../../orders/types/orders-dashboard.types'

export function getSubscriptionsDashboardActions(
  filters: OrdersDashboardFilters,
  onApply: (filters: OrdersDashboardFilters) => void,
): LayoutAdminAction[] {
  return [{
    id: 'subscriptions-dashboard-filters',
    title: 'Filtrar dashboard de assinaturas',
    subtitle: 'Escolha o período que deseja analisar.',
    label: 'Filtrar período',
    content: ({ close }) => (
      <OrdersDashboardFiltersForm
        key={JSON.stringify(filters)}
        filters={filters}
        onApply={onApply}
        onClose={close}
      />
    ),
  }]
}
