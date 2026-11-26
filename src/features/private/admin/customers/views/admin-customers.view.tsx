import { LayoutAdmin } from '../../../../../shared/layout/layout-admin'
import { useLogout } from '../../../../public/auth/hooks/use-logout'
import { AdminCustomersFiltersForm } from '../components/admin-customers-filters'
import { AdminCustomersTable } from '../components/admin-customers-table'
import { AdminCustomerDetails } from '../components/admin-customer-details'
import { useAdminCustomersPage } from '../hooks/use-admin-customers-page'

export function AdminCustomersView() {
  const logout = useLogout()
  const page = useAdminCustomersPage()

  return (
    <LayoutAdmin
      title="Clientes"
      subtitle="Consulte os clientes cadastrados e acompanhe a situação das assinaturas."
      onLogout={logout}
      actions={[
        {
          id: 'customer-details',
          title: 'Histórico do cliente',
          subtitle: page.selectedCustomer ? `${page.selectedCustomer.name} · ${page.selectedCustomer.email}` : undefined,
          content: page.selectedCustomer ? <AdminCustomerDetails customerId={page.selectedCustomer.id} /> : null,
        },
        {
          id: 'customer-filters',
          title: 'Filtrar clientes',
          subtitle: 'Busque por nome, e-mail ou status da assinatura.',
          content: ({ close }) => (
            <AdminCustomersFiltersForm
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
        <AdminCustomersTable
          customers={page.customers}
          isLoading={page.isLoading}
          isFetching={page.isFetching}
          error={page.error}
          rowCount={page.rowCount}
          paginationModel={page.paginationModel}
          onPaginationModelChange={page.setPaginationModel}
          sortModel={page.sortModel}
          onSortModelChange={page.changeSort}
          activeFilterCount={page.activeFilterCount}
          onOpenFilters={() => openAction('customer-filters')}
          onViewDetails={(customer) => {
            page.setSelectedCustomer(customer)
            openAction('customer-details')
          }}
        />
      )}
    </LayoutAdmin>
  )
}
