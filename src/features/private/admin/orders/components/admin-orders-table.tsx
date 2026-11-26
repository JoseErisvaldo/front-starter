import { Alert, Badge, IconButton, Paper, Stack, SvgIcon } from '@mui/material'
import { DataGrid, type GridPaginationModel, type GridSortModel } from '@mui/x-data-grid'
import { ptBR } from '@mui/x-data-grid/locales'
import { useMemo } from 'react'
import { AdminTableSkeleton } from '../../../../../shared/components/admin-table-skeleton'
import { getAdminOrdersColumns } from '../constants/admin-orders.columns'
import type { AdminOrder } from '../types/admin-orders.types'

type Props = {
  orders: AdminOrder[]
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
  onViewDetails: (orderId: string) => void
}

export function AdminOrdersTable({
  orders,
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
}: Props) {
  const columns = useMemo(() => getAdminOrdersColumns(onViewDetails), [onViewDetails])

  if (isLoading) return <AdminTableSkeleton columns={8} toolbar />
  if (error) return <Alert severity="error">{error}</Alert>

  return (
    <Stack spacing={2}>
      <Paper variant="outlined" sx={{ width: '100%' }}>
        <Stack direction="row" sx={{ justifyContent: 'flex-end', px: 1, pt: 0.5 }}>
          <IconButton aria-label="Abrir filtros de pedidos" onClick={onOpenFilters}>
            <Badge badgeContent={activeFilterCount} color="primary">
              <SvgIcon>
                <path d="M3 5h18v2H3zm3 6h12v2H6zm4 6h4v2h-4z" />
              </SvgIcon>
            </Badge>
          </IconButton>
        </Stack>
        <DataGrid
          aria-label="Pedidos realizados"
          rows={orders}
          columns={columns}
          autoHeight
          loading={isFetching}
          paginationMode="server"
          sortingMode="server"
          paginationModel={paginationModel}
          onPaginationModelChange={onPaginationModelChange}
          sortModel={sortModel}
          onSortModelChange={onSortModelChange}
          rowCount={rowCount}
          pageSizeOptions={[5, 10, 25, 50]}
          disableRowSelectionOnClick
          disableColumnFilter
          localeText={{
            ...ptBR.components.MuiDataGrid.defaultProps.localeText,
            noRowsLabel: 'Ainda não há pedidos registrados.',
          }}
          sx={{
            border: 0,
            '& .MuiDataGrid-columnHeaderTitle': { fontWeight: 700 },
            '& .MuiDataGrid-row:hover': { bgcolor: '#f2f7f3' },
          }}
        />
      </Paper>
    </Stack>
  )
}
