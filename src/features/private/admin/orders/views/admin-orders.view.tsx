import { Alert, Badge, Chip, IconButton, Paper, Skeleton, Stack, SvgIcon } from '@mui/material'
import {
  DataGrid,
  GridActionsCellItem,
  type GridColDef,
  type GridPaginationModel,
  type GridSortModel,
} from '@mui/x-data-grid'
import { ptBR } from '@mui/x-data-grid/locales'
import { useMemo } from 'react'
import { formatCurrency } from '../../../../../shared/lib/format-currency'
import { formatBrazilianDate } from '../../../../../shared/utils/format-brazilian-date'
import {
  translatePaymentMethod,
  translatePaymentStatus,
} from '../../../../../shared/i18n/payment'
import type { AdminOrder } from '../schema/admin-orders.schema'

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

function getStatusColor(status: string): 'success' | 'warning' | 'error' {
  switch (status.toLowerCase()) {
    case 'processed':
    case 'approved':
    case 'accredited':
      return 'success'
    case 'cancelled':
    case 'canceled':
    case 'expired':
    case 'failed':
    case 'rejected':
    case 'declined':
    case 'error':
    case 'processing_error':
      return 'error'
    default:
      return 'warning'
  }
}

export function AdminOrdersView({
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
  const columns = useMemo<GridColDef<AdminOrder>[]>(() => [
    {
      field: 'id',
      headerName: 'Pedido',
      width: 130,
      sortable: false,
      renderCell: ({ row }) => `#${row.id.slice(0, 8)}`,
    },
    {
      field: 'customer',
      headerName: 'Cliente',
      flex: 1.2,
      minWidth: 220,
      sortable: false,
      renderCell: ({ row }) => (
        <Stack sx={{ minWidth: 0 }}>
          <span>{row.customer.name}</span>
          <span style={{ color: '#686c65', fontSize: 12 }}>{row.customer.email}</span>
        </Stack>
      ),
    },
    {
      field: 'productSummary',
      headerName: 'Produtos',
      flex: 1,
      minWidth: 180,
      sortable: false,
    },
    {
      field: 'paymentMethod',
      headerName: 'Pagamento',
      width: 150,
      sortable: false,
      renderCell: ({ row }) => translatePaymentMethod(row.paymentMethod),
    },
    {
      field: 'amount',
      headerName: 'Total',
      width: 140,
      align: 'right',
      headerAlign: 'right',
      renderCell: ({ row }) => formatCurrency(row.amount, 'BRL'),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 170,
      renderCell: ({ row }) => (
        <Chip
          label={translatePaymentStatus(row.status)}
          color={getStatusColor(row.status)}
          size="small"
        />
      ),
    },
    {
      field: 'createdAt',
      headerName: 'Criado em',
      width: 190,
      renderCell: ({ row }) => formatBrazilianDate(row.createdAt),
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Ações',
      width: 80,
      getActions: ({ row }) => [
        <GridActionsCellItem
          key="details"
          icon={
            <SvgIcon>
              <path d="M12 5c-5 0-9.27 3.11-11 7 1.73 3.89 6 7 11 7s9.27-3.11 11-7c-1.73-3.89-6-7-11-7Zm0 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10Zm0-2a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
            </SvgIcon>
          }
          label="Ver detalhes"
          onClick={() => onViewDetails(row.id)}
          showInMenu
        />,
      ],
    },
  ], [onViewDetails])

  if (isLoading) return <Skeleton variant="rounded" height={360} />
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
