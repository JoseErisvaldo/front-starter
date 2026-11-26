import { useState } from 'react'
import type { GridPaginationModel, GridSortModel } from '@mui/x-data-grid'
import { getApiErrorMessage } from '../../../../../shared/lib/api-error'
import type { AdminProduct, AdminProductsQuery } from '../types/admin-products.types'
import { useAdminProductsQuery } from '../queries/use-admin-products-query'
import { useSetProductActiveMutation } from '../mutations/use-set-product-active-mutation'

function getSortField(field: string): AdminProductsQuery['sortBy'] {
  if (field === 'description' || field === 'price') return field
  return 'name'
}

export function useAdminProductsPage() {
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null)
  const [actionError, setActionError] = useState('')
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: 10 })
  const [sortModel, setSortModel] = useState<GridSortModel>([{ field: 'name', sort: 'asc' }])
  const currentSort = sortModel[0]
  const products = useAdminProductsQuery({
    page: paginationModel.page,
    pageSize: paginationModel.pageSize,
    sortBy: currentSort ? getSortField(currentSort.field) : 'name',
    sortOrder: currentSort?.sort === 'desc' ? 'desc' : 'asc',
  })
  const setProductActive = useSetProductActiveMutation()

  function changeSort(model: GridSortModel) {
    setSortModel(model.slice(0, 1))
    setPaginationModel((current) => ({ ...current, page: 0 }))
  }

  function toggleActive(product: AdminProduct) {
    setActionError('')
    setProductActive.mutate(
      { productId: product.id, active: !product.active },
      { onError: (error) => setActionError(getApiErrorMessage(error)) },
    )
  }

  return {
    products: products.data?.products ?? [],
    isLoading: products.isLoading,
    isFetching: products.isFetching,
    error: products.error ? getApiErrorMessage(products.error) : '',
    actionError,
    rowCount: products.data?.pagination.total ?? 0,
    paginationModel,
    setPaginationModel,
    sortModel,
    changeSort,
    editingProduct,
    setEditingProduct,
    pendingProductId: setProductActive.isPending
      ? setProductActive.variables?.productId ?? null
      : null,
    toggleActive,
  }
}
