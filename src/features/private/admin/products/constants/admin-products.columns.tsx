import { Chip, SvgIcon } from '@mui/material'
import { GridActionsCellItem, type GridColDef } from '@mui/x-data-grid'
import { formatBrazilianCurrency } from '../../../../../shared/utils/format-brazilian-currency'
import { formatBrazilianDate } from '../../../../../shared/utils/format-brazilian-date'
import type { AdminProduct } from '../types/admin-products.types'

export const getAdminProductsColumns = (
  onEditProduct: (product: AdminProduct) => void,
  onToggleActive: (product: AdminProduct) => void,
  pendingProductId: string | null,
): GridColDef<AdminProduct>[] => [
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
]
