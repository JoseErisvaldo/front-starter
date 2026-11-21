import {
  Alert,
  Paper,
  Skeleton,
} from '@mui/material'
import {
  DataGrid,
  type GridColDef,
  type GridPaginationModel,
  type GridSortModel,
} from '@mui/x-data-grid'
import { ptBR } from '@mui/x-data-grid/locales'
import type { Product } from '../../../../public/products/types/product.types'
import { formatCurrency } from '../../../../../shared/lib/format-currency'

type Props = {
  products: Product[]
  isLoading: boolean
  isFetching: boolean
  error: string
  rowCount: number
  paginationModel: GridPaginationModel
  onPaginationModelChange: (model: GridPaginationModel) => void
  sortModel: GridSortModel
  onSortModelChange: (model: GridSortModel) => void
}

const columns: GridColDef<Product>[] = [
  { field: 'name', headerName: 'Produto', flex: 1, minWidth: 180 },
  { field: 'description', headerName: 'Descrição', flex: 1.5, minWidth: 240 },
  {
    field: 'price',
    headerName: 'Preço',
    minWidth: 150,
    align: 'right',
    headerAlign: 'right',
    renderCell: ({ row }) => formatCurrency(row.price, row.currency),
  },
]

export function AdminProductsView({
  products,
  isLoading,
  isFetching,
  error,
  rowCount,
  paginationModel,
  onPaginationModelChange,
  sortModel,
  onSortModelChange,
}: Props) {
  if (isLoading) return <Skeleton variant="rounded" height={220} />
  if (error) return <Alert severity="error">{error}</Alert>
  if (rowCount === 0) {
    return <Alert severity="info">Nenhum produto cadastrado. Use “Criar produto” para começar.</Alert>
  }

  return (
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
  )
}
