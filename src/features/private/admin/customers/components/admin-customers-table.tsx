import { useMemo } from 'react'
import { Badge, IconButton, Paper, Stack, SvgIcon, Typography } from '@mui/material'
import { DataGrid, type GridPaginationModel, type GridSortModel } from '@mui/x-data-grid'
import { ptBR } from '@mui/x-data-grid/locales'
import { AdminTableSkeleton } from '../../../../../shared/components/admin-table-skeleton'
import { getAdminCustomersColumns } from '../constants/admin-customers.columns'
import type { AdminCustomer } from '../types/admin-customers.types'

export function AdminCustomersTable({
  customers,
  isLoading,
  isFetching,
  error,
  rowCount,
  paginationModel,
  onPaginationModelChange,
  sortModel,
  onSortModelChange,
  activeFilterCount,
  onOpenFilters,
  onViewDetails,
}: {
  customers: AdminCustomer[]
  isLoading: boolean
  isFetching: boolean
  error: string
  rowCount: number
  paginationModel: GridPaginationModel
  onPaginationModelChange: (model: GridPaginationModel) => void
  sortModel: GridSortModel
  onSortModelChange: (model: GridSortModel) => void
  activeFilterCount: number
  onOpenFilters: () => void
  onViewDetails: (customer: AdminCustomer) => void
}) {
  const columns = useMemo(() => getAdminCustomersColumns(onViewDetails), [onViewDetails])

  if (isLoading) return <AdminTableSkeleton columns={6} toolbar />
  if (error) {
    return (
      <Typography role="alert" variant="body2" color="text.secondary">
        Ocorreu um erro ao carregar os clientes.
      </Typography>
    )
  }

  return (
    <Stack spacing={3}>
      <Paper variant="outlined" sx={{ width: '100%' }}>
        <Stack direction="row" sx={{ justifyContent: 'flex-end', px: 1, pt: 0.5 }}>
          <IconButton aria-label="Abrir filtros de clientes" onClick={onOpenFilters}>
            <Badge badgeContent={activeFilterCount} color="primary">
              <SvgIcon>
                <path d="M3 5h18v2H3zm3 6h12v2H6zm4 6h4v2h-4z" />
              </SvgIcon>
            </Badge>
          </IconButton>
        </Stack>
        <DataGrid
          aria-label="Clientes cadastrados"
          rows={customers}
          columns={columns}
          autoHeight
          loading={isFetching}
          paginationMode="server"
          sortingMode="server"
          paginationModel={paginationModel}
          onPaginationModelChange={onPaginationModelChange}
          rowCount={rowCount}
          sortModel={sortModel}
          onSortModelChange={onSortModelChange}
          sortingOrder={['asc', 'desc']}
          pageSizeOptions={[10, 25, 50]}
          disableRowSelectionOnClick
          disableColumnMenu
          localeText={{
            ...ptBR.components.MuiDataGrid.defaultProps.localeText,
            noRowsLabel: 'Nenhum cliente encontrado.',
          }}
        />
      </Paper>
    </Stack>
  )
}
