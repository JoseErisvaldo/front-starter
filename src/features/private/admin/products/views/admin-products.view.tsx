import { Alert, Chip, Paper, Stack, SvgIcon } from '@mui/material'
import {
  DataGrid,
  GridActionsCellItem,
  type GridColDef,
  type GridPaginationModel,
  type GridSortModel,
} from '@mui/x-data-grid'
import { ptBR } from '@mui/x-data-grid/locales'
import { useMemo } from 'react'
import type { AdminProduct } from '../schema/admin-products.schema'
import { formatBrazilianCurrency } from '../../../../../shared/utils/format-brazilian-currency'
import { formatBrazilianDate } from '../../../../../shared/utils/format-brazilian-date'
import { AdminTableSkeleton } from '../../../../../shared/components/admin-table-skeleton'

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

export function AdminProductsView({
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
  const columns = useMemo<GridColDef<AdminProduct>[]>(() => [
    { field: 'name', headerName: 'Produto', flex: 1, minWidth: 180 },
    { field: 'description', headerName: 'Descrição', flex: 1.5, minWidth: 240 },
    {
      field: 'price',
      headerName: 'Preço',
      minWidth: 150,
      align: 'right',
      headerAlign: 'right',
      renderCell: ({ row }) => formatBrazilianCurrency(row.price),
    },
    {
      field: 'createdAt',
      headerName: 'Criado em',
      width: 190,
      sortable: false,
      renderCell: ({ row }) => formatBrazilianDate(row.createdAt),
    },
    {
      field: 'active',
      headerName: 'Status',
      width: 120,
      sortable: false,
      renderCell: ({ row }) => (
        <Chip
          label={row.active ? 'Ativo' : 'Inativo'}
          size="small"
          color={row.active ? 'success' : 'error'}
          variant={row.active ? 'filled' : 'outlined'}
        />
      ),
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Ações',
      width: 90,
      getActions: ({ row }) => [
        <GridActionsCellItem
          key="edit"
          icon={
            <SvgIcon>
              <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
            </SvgIcon>
          }
          label="Editar produto"
          onClick={() => onEditProduct(row)}
          showInMenu
        />,
        <GridActionsCellItem
          key="toggle-active"
          icon={
            <SvgIcon sx={{ color: row.active ? 'error.main' : 'success.main' }}>
              <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 2a8 8 0 0 1 6.32 12.9L7.1 5.68A7.96 7.96 0 0 1 12 4zM5.68 7.1 16.9 18.32A8 8 0 0 1 5.68 7.1z" />
            </SvgIcon>
          }
          label={row.active ? 'Inativar produto' : 'Ativar produto'}
          onClick={() => onToggleActive(row)}
          disabled={pendingProductId === row.id}
          showInMenu
        />,
      ],
    },
  ], [onEditProduct, onToggleActive, pendingProductId])

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
