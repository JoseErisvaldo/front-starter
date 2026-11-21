import { useState } from 'react'
import type { GridPaginationModel, GridSortModel } from '@mui/x-data-grid'
import { getApiErrorMessage } from '../../../../../shared/lib/api-error'
import { LayoutAdmin } from '../../../../../shared/layout/layout-admin'
import { useLogout } from '../../../../public/auth/hooks/use-logout'
import {
  AdminOrdersFiltersForm,
  getActiveAdminOrdersFilterCount,
  type AdminOrdersFilters,
} from '../components/admin-orders-filters'
import { AdminOrderDetails } from '../components/admin-order-details'
import { useAdminOrdersQuery } from '../queries/use-admin-orders-query'
import { AdminOrdersView } from '../views/admin-orders.view'

const initialFilters: AdminOrdersFilters = {
  search: '',
  customerName: '',
  paymentMethod: '',
  status: '',
  dateFrom: '',
  dateTo: '',
}

export function AdminOrdersRoute() {
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  })
  const [sortModel, setSortModel] = useState<GridSortModel>([
    { field: 'createdAt', sort: 'desc' },
  ])
  const [filters, setFilters] = useState<AdminOrdersFilters>(initialFilters)
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
  const sort = sortModel[0]
  const ordersQuery = useAdminOrdersQuery({
    page: paginationModel.page + 1,
    pageSize: paginationModel.pageSize,
    ...(filters.search ? { search: filters.search } : {}),
    ...(filters.customerName ? { customerName: filters.customerName } : {}),
    ...(filters.paymentMethod ? { paymentMethod: filters.paymentMethod } : {}),
    ...(filters.status ? { status: filters.status } : {}),
    ...(filters.dateFrom ? { dateFrom: filters.dateFrom } : {}),
    ...(filters.dateTo ? { dateTo: filters.dateTo } : {}),
    sortBy: sort?.field === 'amount' || sort?.field === 'status' ? sort.field : 'createdAt',
    sortOrder: sort?.sort === 'asc' ? 'asc' : 'desc',
  })
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
        {
          id: 'order-filters',
          title: 'Filtrar pedidos',
          subtitle: 'Refine os pedidos por cliente, pagamento, status ou período.',
          content: ({ close }) => (
            <AdminOrdersFiltersForm
              key={JSON.stringify(filters)}
              filters={filters}
              onApply={(nextFilters) => {
                setFilters(nextFilters)
                setPaginationModel((current) => ({ ...current, page: 0 }))
              }}
              onClose={close}
            />
          ),
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
          sortModel={sortModel}
          onSortModelChange={(model) => {
            setSortModel(model.slice(0, 1))
            setPaginationModel((current) => ({ ...current, page: 0 }))
          }}
          activeFilterCount={getActiveAdminOrdersFilterCount(filters)}
          onOpenFilters={() => openAction('order-filters')}
          onViewDetails={(orderId) => {
            setSelectedOrderId(orderId)
            openAction('order-details')
          }}
        />
      )}
    </LayoutAdmin>
  )
}
