import { useState } from 'react'
import type { GridPaginationModel } from '@mui/x-data-grid'
import { getApiErrorMessage } from '../../../../../shared/lib/api-error'
import { LayoutAdmin } from '../../../../../shared/layout/layout-admin'
import { useLogout } from '../../../../public/auth/hooks/use-logout'
import { AdminOrderDetails } from '../components/admin-order-details'
import { useAdminOrdersQuery } from '../queries/use-admin-orders-query'
import { AdminOrdersView } from '../views/admin-orders.view'

export function AdminOrdersRoute() {
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  })
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
  const ordersQuery = useAdminOrdersQuery(
    paginationModel.page + 1,
    paginationModel.pageSize,
  )
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
          subtitle: selectedOrderId ? `Pedido #${selectedOrderId.slice(0, 8)}` : undefined,
          content: selectedOrderId
            ? <AdminOrderDetails paymentId={selectedOrderId} />
            : null,
        },
      ]}
    >
      {({ openAction }) => (
        <AdminOrdersView
          orders={ordersQuery.data?.payments ?? []}
          isLoading={ordersQuery.isLoading}
          isFetching={ordersQuery.isFetching}
          error={ordersQuery.error ? getApiErrorMessage(ordersQuery.error) : ''}
          rowCount={ordersQuery.data?.pagination.total ?? 0}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          onViewDetails={(orderId) => {
            setSelectedOrderId(orderId)
            openAction('order-details')
          }}
        />
      )}
    </LayoutAdmin>
  )
}
