import { LayoutAdmin } from '../../../../../shared/layout/layout-admin'
import { useLogout } from '../../../../public/auth/hooks/use-logout'
import { AdminOrdersFiltersForm } from '../components/admin-orders-filters'
import { AdminOrderDetails } from '../components/admin-order-details/admin-order-details'
import { AdminOrdersTable } from '../components/admin-orders-table'
import { useAdminOrdersPage } from '../hooks/use-admin-orders-page'

export function AdminOrdersView() {
  const page = useAdminOrdersPage()
  const logout = useLogout()

  return (
    <LayoutAdmin
      title="Pedidos"
      subtitle="Consulte os pedidos realizados e os dados dos clientes."
      onLogout={logout}
      actions={[
        {
          id: 'order-details',
          title: 'Detalhes do pedido',
          subtitle: page.selectedOrderId ? `Pedido #${page.selectedOrderId.slice(0, 8)}` : undefined,
          content: page.selectedOrderId
            ? <AdminOrderDetails paymentId={page.selectedOrderId} />
            : null,
        },
        {
          id: 'order-filters',
          title: 'Filtrar pedidos',
          subtitle: 'Refine os pedidos por cliente, pagamento, status ou período.',
          content: ({ close }) => (
            <AdminOrdersFiltersForm
              key={JSON.stringify(page.filters)}
              filters={page.filters}
              onApply={page.applyFilters}
              onClose={close}
            />
          ),
        },
      ]}
    >
      {({ openAction }) => (
        <AdminOrdersTable
          orders={page.orders}
          isLoading={page.isLoading}
          isFetching={page.isFetching}
          error={page.error}
          rowCount={page.rowCount}
          paginationModel={page.paginationModel}
          onPaginationModelChange={page.setPaginationModel}
          sortModel={page.sortModel}
          onSortModelChange={page.changeSort}
          activeFilterCount={page.activeFilterCount}
          onOpenFilters={() => openAction('order-filters')}
          onViewDetails={(orderId) => {
            page.setSelectedOrderId(orderId)
            openAction('order-details')
          }}
        />
      )}
    </LayoutAdmin>
  )
}
