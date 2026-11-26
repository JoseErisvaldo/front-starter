import { Alert, Paper, Stack } from '@mui/material'
import { DataGrid, type GridPaginationModel, type GridSortModel } from '@mui/x-data-grid'
import { ptBR } from '@mui/x-data-grid/locales'
import { useMemo } from 'react'
import { AdminTableSkeleton } from '../../../../../shared/components/admin-table-skeleton'
import { getAdminProductsColumns } from '../constants/admin-products.columns'
import type { AdminProduct } from '../types/admin-products.types'

type Props = {
  products: AdminProduct[]
  isLoading: boolean
  isFetching: boolean
  error: string
  actionError: string
  rowCount: number
  paginationModel: GridPaginationModel
  onPaginationModelChange: (model: GridPaginationModel) => void
  sortModel: GridSortModel
  onSortModelChange: (model: GridSortModel) => void
  pendingProductId: string | null
  onEditProduct: (product: AdminProduct) => void
  onToggleActive: (product: AdminProduct) => void
}

export function AdminProductsTable({
  products,
  isLoading,
  isFetching,
  error,
  actionError,
  rowCount,
  paginationModel,
  onPaginationModelChange,
  sortModel,
  onSortModelChange,
  pendingProductId,
  onEditProduct,
  onToggleActive,
}: Props) {
  const columns = useMemo(
    () => getAdminProductsColumns(onEditProduct, onToggleActive, pendingProductId),
    [onEditProduct, onToggleActive, pendingProductId],
  )

  if (isLoading) return <AdminTableSkeleton columns={5} />
  if (error) return <Alert severity="error">{error}</Alert>

  return (
    <Stack spacing={2}>
      {actionError && <Alert severity="error">{actionError}</Alert>}
      {rowCount === 0 ? (
        <Alert severity="info">Nenhum produto cadastrado. Use “Criar produto” para começar.</Alert>
      ) : (
        <Paper variant="outlined" sx={{ width: '100%' }}>
          <DataGrid
            aria-label="Produtos cadastrados"
            rows={products}
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
            pageSizeOptions={[5, 10, 25, 50]}
            disableRowSelectionOnClick
            localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
            sx={{
              border: 0,
              '& .MuiDataGrid-columnHeaderTitle': { fontWeight: 700 },
              '& .MuiDataGrid-row:hover': { bgcolor: '#f2f7f3' },
            }}
          />
        </Paper>
      )}
    </Stack>
  )
}
