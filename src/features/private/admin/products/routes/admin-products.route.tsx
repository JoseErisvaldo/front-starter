import { useState } from 'react'
import type { GridPaginationModel, GridSortModel } from '@mui/x-data-grid'
import { getApiErrorMessage } from '../../../../../shared/lib/api-error'
import { LayoutAdmin } from '../../../../../shared/layout/layout-admin'
import { useLogout } from '../../../../public/auth/hooks/use-logout'
import type { AdminProduct, AdminProductsQuery } from '../schema/admin-products.schema'
import { useAdminProductsQuery } from '../queries/use-admin-products-query'
import { CreateProductForm } from '../components/create-product-form'
import { EditProductForm } from '../components/edit-product-form'
import { useSetProductActiveMutation } from '../mutations/use-set-product-active-mutation'
import { AdminProductsView } from '../views/admin-products.view'

function getSortField(field: string): AdminProductsQuery['sortBy'] {
  if (field === 'description' || field === 'price') return field
  return 'name'
}

export function AdminProductsRoute() {
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null)
  const [actionError, setActionError] = useState('')
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
  const setProductActive = useSetProductActiveMutation()

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
        {
          id: 'edit-product',
          title: 'Editar produto',
          subtitle: editingProduct?.name,
          content: ({ close }) => editingProduct
            ? <EditProductForm key={editingProduct.id} product={editingProduct} onUpdated={close} />
            : null,
        },
      ]}
    >
      {({ openAction }) => (
        <AdminProductsView
          products={productsQuery.data?.products ?? []}
          isLoading={productsQuery.isLoading}
          isFetching={productsQuery.isFetching}
          error={productsQuery.error ? getApiErrorMessage(productsQuery.error) : ''}
          actionError={actionError}
          rowCount={productsQuery.data?.pagination.total ?? 0}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          sortModel={sortModel}
          onSortModelChange={(model) => {
            setSortModel(model.slice(0, 1))
            setPaginationModel((current) => ({ ...current, page: 0 }))
          }}
          pendingProductId={
            setProductActive.isPending ? setProductActive.variables?.productId ?? null : null
          }
          onEditProduct={(product) => {
            setEditingProduct(product)
            openAction('edit-product')
          }}
          onToggleActive={(product) => {
            setActionError('')
            setProductActive.mutate(
              { productId: product.id, active: !product.active },
              {
                onError: (error) => setActionError(getApiErrorMessage(error)),
              },
            )
          }}
        />
      )}
    </LayoutAdmin>
  )
}
