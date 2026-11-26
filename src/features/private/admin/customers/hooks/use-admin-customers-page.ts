import { useState } from 'react'
import type { GridPaginationModel, GridSortModel } from '@mui/x-data-grid'
import { getApiErrorMessage } from '../../../../../shared/lib/api-error'
import {
  emptyAdminCustomersFilters,
  type AdminCustomersQuery,
  type AdminCustomersFilters,
  type AdminCustomer,
} from '../types/admin-customers.types'
import { useAdminCustomersQuery } from '../queries/use-admin-customers-query'

export function useAdminCustomersPage() {
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
  const customers = useAdminCustomersQuery(query)

  function applyFilters(nextFilters: AdminCustomersFilters) {
    setFilters(nextFilters)
    setPaginationModel((current) => ({ ...current, page: 0 }))
  }

  function changeSort(model: GridSortModel) {
    setSortModel(model.slice(0, 1))
    setPaginationModel((current) => ({ ...current, page: 0 }))
  }

  return {
    customers: customers.data?.customers ?? [],
    isLoading: customers.isLoading,
    isFetching: customers.isFetching,
    error: customers.error ? getApiErrorMessage(customers.error) : '',
    rowCount: customers.data?.pagination.total ?? 0,
    paginationModel,
    setPaginationModel,
    sortModel,
    changeSort,
    filters,
    applyFilters,
    selectedCustomer,
    setSelectedCustomer,
    activeFilterCount:
      Number(Boolean(filters.search.trim()))
      + Number(Boolean(filters.status))
      + Number(Boolean(filters.createdAtFrom))
      + Number(Boolean(filters.createdAtTo)),
  }
}
