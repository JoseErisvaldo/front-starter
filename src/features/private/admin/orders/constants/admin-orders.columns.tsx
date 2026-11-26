import { Chip, Stack, SvgIcon } from '@mui/material'
import { GridActionsCellItem, type GridColDef } from '@mui/x-data-grid'
import { formatCurrency } from '../../../../../shared/lib/format-currency'
import { formatBrazilianDate } from '../../../../../shared/utils/format-brazilian-date'
import { translatePaymentMethod, translatePaymentStatus } from '../../../../../shared/i18n/payment'
import type { AdminOrder } from '../types/admin-orders.types'

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

export const getAdminOrdersColumns = (
  onViewDetails: (orderId: string) => void,
): GridColDef<AdminOrder>[] => [
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
      <Chip label={translatePaymentStatus(row.status)} color={getStatusColor(row.status)} size="small" />
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
]
