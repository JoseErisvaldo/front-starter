import { useState } from 'react'
import type { GridPaginationModel, GridSortModel } from '@mui/x-data-grid'
import { getApiErrorMessage } from '../../../../../shared/lib/api-error'
import {
  emptyAdminOrdersFilters,
  type AdminOrdersFilters,
  type AdminOrdersQuery,
} from '../types/admin-orders.types'
import { useAdminOrdersQuery } from '../queries/use-admin-orders-query'

export function useAdminOrdersPage() {
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: 10 })
  const [sortModel, setSortModel] = useState<GridSortModel>([{ field: 'createdAt', sort: 'desc' }])
  const [filters, setFilters] = useState<AdminOrdersFilters>(emptyAdminOrdersFilters)
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
  const sort = sortModel[0]
  const query: AdminOrdersQuery = {
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
  }
  const orders = useAdminOrdersQuery(query)

  function applyFilters(nextFilters: AdminOrdersFilters) {
    setFilters(nextFilters)
    setPaginationModel((current) => ({ ...current, page: 0 }))
  }

  function changeSort(model: GridSortModel) {
    setSortModel(model.slice(0, 1))
    setPaginationModel((current) => ({ ...current, page: 0 }))
  }

  return {
    orders: orders.data?.payments ?? [],
    isLoading: orders.isLoading,
    isFetching: orders.isFetching,
    error: orders.error ? getApiErrorMessage(orders.error) : '',
    rowCount: orders.data?.pagination.total ?? 0,
    paginationModel,
    setPaginationModel,
    sortModel,
    changeSort,
    filters,
    applyFilters,
    selectedOrderId,
    setSelectedOrderId,
    activeFilterCount: Object.values(filters).filter(Boolean).length,
  }
}
