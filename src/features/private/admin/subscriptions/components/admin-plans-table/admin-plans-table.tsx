import { Badge, IconButton, Paper, Stack, SvgIcon, Typography } from '@mui/material'
import { DataGrid, type GridPaginationModel, type GridSortModel } from '@mui/x-data-grid'
import { ptBR } from '@mui/x-data-grid/locales'
import { useMemo } from 'react'
import { getAdminPlanColumns } from '../../constants/admin-subscription-columns'
import type { SubscriptionPlan } from '../../types/admin-subscriptions.types'

export function AdminPlansTable({
  plans,
  isLoading,
  isError,
  total,
  paginationModel,
  onPaginationModelChange,
  sortModel,
  onSortModelChange,
  activeFilterCount,
  isMutationPending,
  isMutationError,
  onOpenFilters,
  onEditPlan,
  onTogglePlan,
}: {
  plans: SubscriptionPlan[]
  isLoading: boolean
  isError: boolean
  total: number
  paginationModel: GridPaginationModel
  onPaginationModelChange: (model: GridPaginationModel) => void
  sortModel: GridSortModel
  onSortModelChange: (model: GridSortModel) => void
  activeFilterCount: number
  isMutationPending: boolean
  isMutationError: boolean
  onOpenFilters: () => void
  onEditPlan: (plan: SubscriptionPlan) => void
  onTogglePlan: (plan: SubscriptionPlan) => void
}) {
  const columns = useMemo(
    () => getAdminPlanColumns(onEditPlan, onTogglePlan, isMutationPending),
    [onEditPlan, onTogglePlan, isMutationPending],
  )

  return (
    <Paper variant="outlined" sx={{ width: '100%' }}>
      <Stack direction="row" sx={{ justifyContent: 'flex-end', px: 1, pt: 0.5 }}>
        <IconButton aria-label="Abrir filtros de opções de plano" onClick={onOpenFilters}>
          <Badge badgeContent={activeFilterCount} color="primary">
            <SvgIcon><path d="M3 5h18v2H3zm3 6h12v2H6zm4 6h4v2h-4z" /></SvgIcon>
          </Badge>
        </IconButton>
      </Stack>
      {isMutationError && (
        <Typography variant="body2" color="text.secondary" sx={{ px: 2, pb: 1 }}>
          Ocorreu um erro ao atualizar o plano.
        </Typography>
      )}
      <DataGrid
        aria-label="Opções de recorrência dos planos"
        rows={plans}
        columns={columns}
        autoHeight
        loading={isLoading}
        disableRowSelectionOnClick
        disableColumnMenu
        paginationMode="server"
        sortingMode="server"
        rowCount={total}
        paginationModel={paginationModel}
        onPaginationModelChange={onPaginationModelChange}
        sortModel={sortModel}
        onSortModelChange={onSortModelChange}
        pageSizeOptions={[10, 25]}
        localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
        slots={{
          noRowsOverlay: () => (
            <Stack sx={{ height: '100%', alignItems: 'center', justifyContent: 'center', px: 2 }}>
              <Typography variant="body2" color="text.secondary" align="center">
                {isError ? 'Ocorreu um erro ao carregar os planos.' : 'Nenhum registro encontrado.'}
              </Typography>
            </Stack>
          ),
        }}
      />
    </Paper>
  )
}
