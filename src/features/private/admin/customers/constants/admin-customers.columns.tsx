import { Chip, SvgIcon } from '@mui/material'
import { GridActionsCellItem, type GridColDef } from '@mui/x-data-grid'
import { formatBrazilianDate } from '../../../../../shared/utils/format-brazilian-date'
import type { AdminCustomer } from '../types/admin-customers.types'

const customerStatusLabels: Record<AdminCustomer['subscriptionStatus'], string> = {
  active: 'Assinatura ativa',
  cancelled: 'Assinatura cancelada',
  never_subscribed: 'Não assinou',
}

const customerStatusColors: Record<
  AdminCustomer['subscriptionStatus'],
  'success' | 'default' | 'warning'
> = {
  active: 'success',
  cancelled: 'default',
  never_subscribed: 'warning',
}

export const getAdminCustomersColumns = (
  onViewDetails: (customer: AdminCustomer) => void,
): GridColDef<AdminCustomer>[] => [
  { field: 'name', headerName: 'Cliente', flex: 1, minWidth: 180 },
  { field: 'email', headerName: 'E-mail', flex: 1.2, minWidth: 220 },
  {
    field: 'subscriptionStatus',
    headerName: 'Status da assinatura',
    minWidth: 210,
    sortable: false,
    renderCell: ({ row }) => (
      <Chip
        label={customerStatusLabels[row.subscriptionStatus]}
        color={customerStatusColors[row.subscriptionStatus]}
        size="small"
      />
    ),
  },
  {
    field: 'subscriptionCount',
    headerName: 'Assinaturas',
    width: 130,
    sortable: false,
    valueFormatter: (value: number) => value,
  },
  {
    field: 'createdAt',
    headerName: 'Conta criada em',
    width: 180,
    valueFormatter: (value) => formatBrazilianDate(String(value)),
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
        showInMenu
        onClick={() => onViewDetails(row)}
      />,
    ],
  },
]
