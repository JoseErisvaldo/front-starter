import { useMemo } from 'react'
import { Badge, Chip, IconButton, Paper, Stack, SvgIcon, Typography } from '@mui/material'
import {
  DataGrid,
  GridActionsCellItem,
  type GridColDef,
  type GridPaginationModel,
  type GridSortModel,
} from '@mui/x-data-grid'
import { ptBR } from '@mui/x-data-grid/locales'
import { AdminTableSkeleton } from '../../../../../shared/components/admin-table-skeleton'
import { formatBrazilianDate } from '../../../../../shared/utils/format-brazilian-date'
import type { AdminCustomer } from '../schema/admin-customers.schema'

const customerStatusLabels: Record<AdminCustomer['subscriptionStatus'], string> = {
  active: 'Assinatura ativa',
  cancelled: 'Assinatura cancelada',
  never_subscribed: 'Não assinou',
}

const customerStatusColors: Record<AdminCustomer['subscriptionStatus'], 'success' | 'default' | 'warning'> = {
  active: 'success',
  cancelled: 'default',
  never_subscribed: 'warning',
}

export function AdminCustomersView({
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
  const columns = useMemo<GridColDef<AdminCustomer>[]>(() => [
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
          icon={<SvgIcon><path d="M12 5c-5 0-9.27 3.11-11 7 1.73 3.89 6 7 11 7s9.27-3.11 11-7c-1.73-3.89-6-7-11-7Zm0 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10Zm0-2a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" /></SvgIcon>}
          label="Ver detalhes"
          showInMenu
          onClick={() => onViewDetails(row)}
        />,
      ],
    },
  ], [onViewDetails])

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
