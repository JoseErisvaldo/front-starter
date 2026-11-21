import { useState } from 'react'
import type { GridPaginationModel, GridSortModel } from '@mui/x-data-grid'
import { getApiErrorMessage } from '../../../../../shared/lib/api-error'
import { LayoutAdmin } from '../../../../../shared/layout/layout-admin'
import { useLogout } from '../../../../public/auth/hooks/use-logout'
import type { AdminProductsQuery } from '../schema/admin-products.schema'
import { useAdminProductsQuery } from '../queries/use-admin-products-query'
import { CreateProductForm } from '../components/create-product-form'
import { AdminProductsView } from '../views/admin-products.view'

function getSortField(field: string): AdminProductsQuery['sortBy'] {
  if (field === 'description' || field === 'price') return field
  return 'name'
}

export function AdminProductsRoute() {
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  })
  const [sortModel, setSortModel] = useState<GridSortModel>([
    { field: 'name', sort: 'asc' },
  ])
  const currentSort = sortModel[0]
  const productsQuery = useAdminProductsQuery({
    page: paginationModel.page,
    pageSize: paginationModel.pageSize,
    sortBy: currentSort ? getSortField(currentSort.field) : 'name',
    sortOrder: currentSort?.sort === 'desc' ? 'desc' : 'asc',
  })
  const logout = useLogout()

  return (
    <LayoutAdmin
      title="Produtos"
      subtitle="Cadastre e acompanhe os produtos disponíveis para venda."
      onLogout={logout}
      actions={[
        {
          id: 'create-product',
          label: 'Criar produto',
          title: 'Cadastrar produto',
          subtitle: 'Informe os dados do produto que será oferecido para venda.',
          content: ({ close }) => <CreateProductForm onCreated={close} />,
        },
      ]}
    >
      <AdminProductsView
        products={productsQuery.data?.products ?? []}
        isLoading={productsQuery.isLoading}
        isFetching={productsQuery.isFetching}
        error={productsQuery.error ? getApiErrorMessage(productsQuery.error) : ''}
        rowCount={productsQuery.data?.pagination.total ?? 0}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        sortModel={sortModel}
        onSortModelChange={(model) => {
          setSortModel(model.slice(0, 1))
          setPaginationModel((current) => ({ ...current, page: 0 }))
        }}
      />
    </LayoutAdmin>
  )
}
