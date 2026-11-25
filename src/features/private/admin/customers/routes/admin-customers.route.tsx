import { useState } from 'react'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import type { GridPaginationModel, GridSortModel } from '@mui/x-data-grid'
import { LayoutAdmin } from '../../../../../shared/layout/layout-admin'
import { getApiErrorMessage } from '../../../../../shared/lib/api-error'
import { useLogout } from '../../../../public/auth/hooks/use-logout'
import {
  AdminCustomersFiltersForm,
  emptyAdminCustomersFilters,
  type AdminCustomersFilters,
} from '../components/admin-customers-filters'
import { getAdminCustomersService } from '../services/admin-customers.service'
import { AdminCustomersView } from '../views/admin-customers.view'
import type { AdminCustomersQuery } from '../schema/admin-customers.schema'
import type { AdminCustomer } from '../schema/admin-customers.schema'
import { AdminCustomerDetails } from '../components/admin-customer-details'

const queryKeys = { customers: ['admin-customers'] as const }

export function AdminCustomersRoute() {
  const logout = useLogout()
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: 10 })
  const [sortModel, setSortModel] = useState<GridSortModel>([{ field: 'createdAt', sort: 'desc' }])
  const [filters, setFilters] = useState<AdminCustomersFilters>(emptyAdminCustomersFilters)
  const [selectedCustomer, setSelectedCustomer] = useState<AdminCustomer | null>(null)
  const sort = sortModel[0]
  const query: AdminCustomersQuery = {
    page: paginationModel.page,
    pageSize: paginationModel.pageSize,
    sortBy: sort?.field === 'name' || sort?.field === 'email' ? sort.field : 'createdAt',
    sortOrder: sort?.sort === 'asc' ? 'asc' : 'desc',
    ...(filters.search.trim() ? { search: filters.search.trim() } : {}),
    ...(filters.status ? { status: filters.status } : {}),
    ...(filters.createdAtFrom ? { createdAtFrom: filters.createdAtFrom } : {}),
    ...(filters.createdAtTo ? { createdAtTo: filters.createdAtTo } : {}),
  }
  const customers = useQuery({
    queryKey: [...queryKeys.customers, query],
    queryFn: () => getAdminCustomersService(query),
    placeholderData: keepPreviousData,
  })

  return (
    <LayoutAdmin
      title="Clientes"
      subtitle="Consulte os clientes cadastrados e acompanhe a situação das assinaturas."
      onLogout={logout}
      actions={[
        {
          id: 'customer-details',
          title: 'Histórico do cliente',
          subtitle: selectedCustomer ? `${selectedCustomer.name} · ${selectedCustomer.email}` : undefined,
          content: selectedCustomer ? <AdminCustomerDetails customerId={selectedCustomer.id} /> : null,
        },
        {
          id: 'customer-filters',
          title: 'Filtrar clientes',
          subtitle: 'Busque por nome, e-mail ou status da assinatura.',
          content: ({ close }) => (
            <AdminCustomersFiltersForm
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
        <AdminCustomersView
          customers={customers.data?.customers ?? []}
          isLoading={customers.isLoading}
          isFetching={customers.isFetching}
          error={customers.error ? getApiErrorMessage(customers.error) : ''}
          rowCount={customers.data?.pagination.total ?? 0}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          sortModel={sortModel}
          onSortModelChange={(model) => {
            setSortModel(model.slice(0, 1))
            setPaginationModel((current) => ({ ...current, page: 0 }))
          }}
          activeFilterCount={
            Number(Boolean(filters.search.trim()))
            + Number(Boolean(filters.status))
            + Number(Boolean(filters.createdAtFrom))
            + Number(Boolean(filters.createdAtTo))
          }
          onOpenFilters={() => openAction('customer-filters')}
          onViewDetails={(customer) => {
            setSelectedCustomer(customer)
            openAction('customer-details')
          }}
        />
      )}
    </LayoutAdmin>
  )
}
