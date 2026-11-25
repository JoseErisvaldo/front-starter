import { useMemo, useRef, useState } from 'react'
import { Alert, Chip, Paper, Stack, SvgIcon, Typography } from '@mui/material'
import { DataGrid, GridActionsCellItem, type GridColDef } from '@mui/x-data-grid'
import { ptBR } from '@mui/x-data-grid/locales'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { LayoutAdmin } from '../../../../../shared/layout/layout-admin'
import { formatCurrency } from '../../../../../shared/lib/format-currency'
import { formatBrazilianDate } from '../../../../../shared/utils/format-brazilian-date'
import { getApiErrorMessage } from '../../../../../shared/lib/api-error'
import { useLogout } from '../../../../public/auth/hooks/use-logout'
import { SubscriptionPlanForm } from '../components/subscription-plan-form'
import {
  deactivateSubscriptionPlanService,
  getAdminPlansService,
  getAdminSubscriptionsService,
  updateSubscriptionPlanService,
} from '../services/subscriptions.service'
import type { SubscriptionPlan, SubscriptionRecord } from '../../../../subscriptions/schema/subscriptions.schema'

const queryKeys = {
  plans: ['subscription-admin', 'plans'] as const,
  subscriptions: ['subscription-admin', 'subscriptions'] as const,
}
const tierNames = { BASIC: 'Básico', SIMPLE: 'Simples', PRO: 'Pro' } as const
const recurrenceNames = { WEEKLY: 'Semanal', MONTHLY: 'Mensal', QUARTERLY: 'Trimestral', YEARLY: 'Anual' } as const

export function AdminSubscriptionsRoute() {
  const client = useQueryClient()
  const logout = useLogout()
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null)
  const openActionRef = useRef<(id: string) => void>(() => {})
  const plans = useQuery({ queryKey: queryKeys.plans, queryFn: getAdminPlansService })
  const subscriptions = useQuery({ queryKey: queryKeys.subscriptions, queryFn: getAdminSubscriptionsService })
  const removePlan = useMutation({
    mutationFn: deactivateSubscriptionPlanService,
    onSuccess: () => void client.invalidateQueries({ queryKey: queryKeys.plans }),
  })
  const activatePlan = useMutation({
    mutationFn: (plan: SubscriptionPlan) => updateSubscriptionPlanService({
      id: plan.id,
      plan: { name: plan.name, tier: plan.tier, recurrence: plan.recurrence, amount: plan.amount, active: true },
    }),
    onSuccess: () => void client.invalidateQueries({ queryKey: queryKeys.plans }),
  })

  const planColumns = useMemo<GridColDef<SubscriptionPlan>[]>(() => [
    { field: 'name', headerName: 'Nome', minWidth: 180, flex: 1 },
    { field: 'tier', headerName: 'Nível', width: 140, valueFormatter: (value) => tierNames[value as SubscriptionPlan['tier']] },
    { field: 'recurrence', headerName: 'Recorrência', width: 150, valueFormatter: (value) => recurrenceNames[value as SubscriptionPlan['recurrence']] },
    { field: 'amount', headerName: 'Valor', width: 140, valueFormatter: (value) => formatCurrency(Number(value), 'BRL') },
    { field: 'active', headerName: 'Status', width: 130, renderCell: ({ row }) => <Chip label={row.active ? 'Ativo' : 'Inativo'} color={row.active ? 'success' : 'default'} size="small" /> },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Ações',
      width: 100,
      getActions: ({ row }) => [
        <GridActionsCellItem
          key="edit"
          label="Editar opção"
          showInMenu
          onClick={() => {
            setEditingPlan(row)
            openActionRef.current('edit-subscription-plan')
          }}
          icon={<SvgIcon><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" /></SvgIcon>}
        />,
        <GridActionsCellItem
          key="deactivate"
          label={row.active ? 'Desativar opção' : 'Ativar opção'}
          showInMenu
          disabled={removePlan.isPending || activatePlan.isPending}
          onClick={() => row.active
            ? removePlan.mutate(row.id)
            : activatePlan.mutate(row)}
          icon={<SvgIcon><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 2a8 8 0 0 1 6.32 12.9L7.1 5.68A7.96 7.96 0 0 1 12 4zM5.68 7.1 16.9 18.32A8 8 0 0 1 5.68 7.1z" /></SvgIcon>}
        />,
      ],
    },
  ], [activatePlan, removePlan])

  const subscriptionColumns = useMemo<GridColDef<SubscriptionRecord>[]>(() => [
    { field: 'customer', headerName: 'Cliente', flex: 1, minWidth: 200, valueGetter: (_value, row) => row.user?.name ?? '—' },
    { field: 'email', headerName: 'E-mail', flex: 1, minWidth: 220, valueGetter: (_value, row) => row.user?.email ?? '—' },
    { field: 'plan', headerName: 'Plano', width: 220, valueGetter: (_value, row) => `${row.plan.name} · ${recurrenceNames[row.plan.recurrence]}` },
    { field: 'status', headerName: 'Status', width: 140, renderCell: ({ row }) => <Chip label={row.status} size="small" variant="outlined" /> },
    { field: 'nextPaymentDate', headerName: 'Próxima cobrança', width: 180, valueFormatter: (value) => value ? formatBrazilianDate(String(value)) : '—' },
  ], [])

  return (
    <LayoutAdmin
      title="Assinaturas"
      subtitle="Gerencie as opções de recorrência e acompanhe as assinaturas dos clientes."
      onLogout={logout}
      actions={[
        {
          id: 'create-subscription-plan',
          label: 'Nova opção',
          title: 'Criar opção de plano',
          subtitle: 'Escolha o nível, a recorrência e o valor da cobrança.',
          content: ({ close }) => (
            <SubscriptionPlanForm
              onSaved={() => {
                close()
                void client.invalidateQueries({ queryKey: queryKeys.plans })
              }}
            />
          ),
        },
        {
          id: 'edit-subscription-plan',
          title: 'Editar opção de plano',
          subtitle: editingPlan ? `${editingPlan.name} · ${recurrenceNames[editingPlan.recurrence]}` : undefined,
          content: ({ close }) => editingPlan ? (
            <SubscriptionPlanForm
              key={editingPlan.id}
              plan={editingPlan}
              onSaved={() => {
                close()
                void client.invalidateQueries({ queryKey: queryKeys.plans })
              }}
            />
          ) : null,
        },
      ]}
    >
      {({ openAction }) => (
        (() => {
        openActionRef.current = openAction
        return <Stack spacing={4}>
          <Stack spacing={1.5}>
            <Typography variant="h5" component="h2">Opções de plano</Typography>
            {plans.isError && <Alert severity="error">{getApiErrorMessage(plans.error)}</Alert>}
            {removePlan.isError && <Alert severity="error">{getApiErrorMessage(removePlan.error)}</Alert>}
            {activatePlan.isError && <Alert severity="error">{getApiErrorMessage(activatePlan.error)}</Alert>}
            <Paper variant="outlined" sx={{ width: '100%' }}>
              <DataGrid
                aria-label="Opções de recorrência dos planos"
                rows={plans.data ?? []}
                columns={planColumns}
                autoHeight
                loading={plans.isLoading || plans.isFetching}
                disableRowSelectionOnClick
                pageSizeOptions={[10, 25]}
                initialState={{ pagination: { paginationModel: { page: 0, pageSize: 10 } } }}
                localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
              />
            </Paper>
            {plans.data?.length === 0 && <Alert severity="info">Nenhuma opção cadastrada. Crie os níveis e recorrências que deseja oferecer.</Alert>}
          </Stack>
          <Stack spacing={1.5}>
            <Typography variant="h5" component="h2">Assinaturas de clientes</Typography>
            {subscriptions.isError && <Alert severity="error">{getApiErrorMessage(subscriptions.error)}</Alert>}
            <Paper variant="outlined" sx={{ width: '100%' }}>
              <DataGrid
                aria-label="Assinaturas dos clientes"
                rows={subscriptions.data ?? []}
                columns={subscriptionColumns}
                autoHeight
                loading={subscriptions.isLoading || subscriptions.isFetching}
                disableRowSelectionOnClick
                pageSizeOptions={[10, 25, 50]}
                initialState={{ pagination: { paginationModel: { page: 0, pageSize: 10 } } }}
                localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
              />
            </Paper>
          </Stack>
        </Stack>
        })()
      )}
    </LayoutAdmin>
  )
}
