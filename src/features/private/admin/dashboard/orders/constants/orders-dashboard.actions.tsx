import type { LayoutAdminAction } from '../../../../../../shared/layout/layout-admin'
import { OrdersDashboardFiltersForm } from '../components/orders-dashboard-filters'
import type { OrdersDashboardFilters } from '../types/orders-dashboard.types'

export const getOrdersDashboardActions = (
  filters: OrdersDashboardFilters,
  onApply: (filters: OrdersDashboardFilters) => void,
): LayoutAdminAction[] => [
  {
    id: 'orders-dashboard-filters',
    title: 'Filtrar dashboard de pedidos',
    subtitle: 'Escolha um período rápido ou defina as datas.',
    label: 'Filtrar período',
    content: ({ close }) => (
      <OrdersDashboardFiltersForm
        key={JSON.stringify(filters)}
        filters={filters}
        onApply={onApply}
        onClose={close}
      />
    ),
  },
]
