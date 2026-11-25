import { useMemo, useRef, useState } from 'react'
import { Badge, Chip, Divider, IconButton, Link, Paper, Stack, SvgIcon, Typography } from '@mui/material'
import { DataGrid, GridActionsCellItem, type GridColDef, type GridPaginationModel, type GridSortModel } from '@mui/x-data-grid'
import { ptBR } from '@mui/x-data-grid/locales'
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useLocation } from 'react-router-dom'
import { LayoutAdmin, type LayoutAdminAction } from '../../../../../shared/layout/layout-admin'
import { formatCurrency } from '../../../../../shared/lib/format-currency'
import { formatBrazilianDate } from '../../../../../shared/utils/format-brazilian-date'
import { translatePaymentStatus, translatePaymentStatusDetail } from '../../../../../shared/i18n/payment'
import { useLogout } from '../../../../public/auth/hooks/use-logout'
import { SubscriptionPlanForm } from '../components/subscription-plan-form'
import { SubscriptionStatusChip } from '../../../../subscriptions/components/subscription-status-chip'
import {
  AdminSubscriptionPlanFiltersForm,
  AdminSubscriptionsFiltersForm,
  emptyPlanFilters,
  emptySubscriptionFilters,
  getActiveSubscriptionFilterCount,
  getActiveSubscriptionPlanFilterCount,
  type AdminPlanFilters,
  type AdminSubscriptionFilters,
} from '../components/admin-subscription-filters'
import {
  deactivateSubscriptionPlanService,
  getAdminPlansService,
  getAdminSubscriptionsService,
  updateSubscriptionPlanService,
} from '../services/subscriptions.service'
import type {
  AdminPlanListQuery,
  AdminSubscriptionsQuery,
  SubscriptionPlan,
  SubscriptionRecord,
} from '../../../../subscriptions/schema/subscriptions.schema'

const queryKeys = {
  plans: ['subscription-admin', 'plans'] as const,
  subscriptions: ['subscription-admin', 'subscriptions'] as const,
}
const tierNames = { BASIC: 'Básico', INTERMEDIATE: 'Intermediário', ADVANCED: 'Avançado' } as const
const recurrenceNames = { WEEKLY: 'Semanal', MONTHLY: 'Mensal', QUARTERLY: 'Trimestral', YEARLY: 'Anual' } as const
function getPlanSortField(field?: string): AdminPlanListQuery['sortBy'] {
  switch (field) {
    case 'tier':
    case 'recurrence':
    case 'amount':
    case 'active':
      return field
    default:
      return 'name'
  }
}

function getSubscriptionSortField(field?: string): AdminSubscriptionsQuery['sortBy'] {
  switch (field) {
    case 'customer':
    case 'email':
    case 'plan':
    case 'status':
    case 'nextPaymentDate':
    case 'amount':
      return field
    default:
      return 'createdAt'
  }
}

function AdminSubscriptionDetails({ subscription }: { subscription: SubscriptionRecord }) {
  return (
    <Stack spacing={2.5} sx={{ minWidth: 0 }}>
      <Stack spacing={1}>
        <Typography variant="subtitle2" color="text.secondary">Status da assinatura</Typography>
        <SubscriptionStatusChip status={subscription.status} />
      </Stack>

      <Divider />
      <Stack spacing={0.75}>
        <Typography variant="subtitle2" color="text.secondary">Cliente</Typography>
        <Typography sx={{ fontWeight: 600 }}>{subscription.user?.name ?? '—'}</Typography>
        <Typography color="text.secondary">{subscription.user?.email ?? '—'}</Typography>
      </Stack>

      <Divider />
      <Stack spacing={0.75}>
        <Typography variant="subtitle2" color="text.secondary">Plano contratado</Typography>
        <Typography sx={{ fontWeight: 600 }}>{subscription.plan.name}</Typography>
        <Typography color="text.secondary">
          {tierNames[subscription.plan.tier]} · {recurrenceNames[subscription.plan.recurrence]}
        </Typography>
        <Typography color="text.secondary">
          {formatCurrency(subscription.plan.amount, subscription.plan.currency)} por cobrança
        </Typography>
      </Stack>

      <Divider />
      <Stack spacing={0.75}>
        <Typography variant="subtitle2" color="text.secondary">Datas</Typography>
        <Typography variant="body2">Criada em: {formatBrazilianDate(subscription.createdAt)}</Typography>
        <Typography variant="body2">Atualizada em: {formatBrazilianDate(subscription.updatedAt)}</Typography>
        <Typography variant="body2">
          Próxima cobrança: {subscription.nextPaymentDate ? formatBrazilianDate(subscription.nextPaymentDate) : 'Ainda não agendada'}
        </Typography>
        {subscription.nextPaymentCountdown && (
          <Typography variant="body2" color="text.secondary">{subscription.nextPaymentCountdown}</Typography>
        )}
      </Stack>

      <Divider />
      <Stack spacing={1.25}>
        <Typography variant="subtitle2" color="text.secondary">Cobranças recentes</Typography>
        {subscription.charges.length > 0 ? subscription.charges.map((charge) => (
          <Paper key={charge.id} variant="outlined" sx={{ p: 1.5 }}>
            <Stack spacing={0.75}>
              <Stack direction="row" sx={{ justifyContent: 'space-between', gap: 1, flexWrap: 'wrap' }}>
                <Typography sx={{ fontWeight: 600 }}>
                  {charge.amount === null ? 'Valor indisponível' : formatCurrency(charge.amount, charge.currency ?? subscription.plan.currency)}
                </Typography>
                <Chip size="small" label={translatePaymentStatus(charge.status)} />
              </Stack>
              <Typography variant="body2" color="text.secondary">
                {charge.paidAt ? 'Pago em' : 'Registrado em'}: {formatBrazilianDate(charge.paidAt ?? charge.createdAt)}
              </Typography>
              {charge.statusDetail && (
                <Typography variant="body2" color="text.secondary">
                  Detalhe: {translatePaymentStatusDetail(charge.statusDetail) ?? charge.statusDetail}
                </Typography>
              )}
              <Typography variant="caption" color="text.secondary" sx={{ overflowWrap: 'anywhere' }}>
                Referência Mercado Pago: {charge.providerPaymentId}
              </Typography>
            </Stack>
          </Paper>
        )) : <Typography variant="body2" color="text.secondary">Nenhuma cobrança registrada.</Typography>}
      </Stack>

      <Divider />
      <Stack spacing={0.75}>
        <Typography variant="subtitle2" color="text.secondary">Referências</Typography>
        <Typography variant="body2" sx={{ overflowWrap: 'anywhere' }}>ID local: {subscription.id}</Typography>
        {subscription.externalReference && (
          <Typography variant="body2" sx={{ overflowWrap: 'anywhere' }}>Referência externa: {subscription.externalReference}</Typography>
        )}
        {subscription.providerSubscriptionId && (
          <Typography variant="body2" sx={{ overflowWrap: 'anywhere' }}>ID Mercado Pago: {subscription.providerSubscriptionId}</Typography>
        )}
        {subscription.plan.providerPlanId && (
          <Typography variant="body2" sx={{ overflowWrap: 'anywhere' }}>ID do plano Mercado Pago: {subscription.plan.providerPlanId}</Typography>
        )}
        {subscription.plan.checkoutUrl && (
          <Link href={subscription.plan.checkoutUrl} target="_blank" rel="noreferrer" variant="body2">
            Abrir checkout do plano
          </Link>
        )}
      </Stack>
    </Stack>
  )
}

export function AdminSubscriptionsRoute() {
  const client = useQueryClient()
  const logout = useLogout()
  const isSubscribersPage = useLocation().pathname === '/admin/assinantes'
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null)
  const [selectedSubscription, setSelectedSubscription] = useState<SubscriptionRecord | null>(null)
  const openActionRef = useRef<(id: string) => void>(() => {})
  const [planPaginationModel, setPlanPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: 10 })
  const [subscriptionPaginationModel, setSubscriptionPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: 10 })
  const [planSortModel, setPlanSortModel] = useState<GridSortModel>([{ field: 'name', sort: 'asc' }])
  const [subscriptionSortModel, setSubscriptionSortModel] = useState<GridSortModel>([{ field: 'createdAt', sort: 'desc' }])
  const [planFilters, setPlanFilters] = useState<AdminPlanFilters>(emptyPlanFilters)
  const [subscriptionFilters, setSubscriptionFilters] = useState<AdminSubscriptionFilters>(emptySubscriptionFilters)

  const planSort = planSortModel[0]
  const planQuery: AdminPlanListQuery = {
    page: planPaginationModel.page,
    pageSize: planPaginationModel.pageSize,
    sortBy: getPlanSortField(planSort?.field),
    sortOrder: planSort?.sort === 'desc' ? 'desc' : 'asc',
    ...(planFilters.search ? { search: planFilters.search } : {}),
    ...(planFilters.tier ? { tier: planFilters.tier } : {}),
    ...(planFilters.recurrence ? { recurrence: planFilters.recurrence } : {}),
    ...(planFilters.active !== '' ? { active: planFilters.active } : {}),
  }
  const subscriptionSort = subscriptionSortModel[0]
  const subscriptionQuery: AdminSubscriptionsQuery = {
    page: subscriptionPaginationModel.page,
    pageSize: subscriptionPaginationModel.pageSize,
    sortBy: getSubscriptionSortField(subscriptionSort?.field),
    sortOrder: subscriptionSort?.sort === 'asc' ? 'asc' : 'desc',
    ...(subscriptionFilters.search ? { search: subscriptionFilters.search } : {}),
    ...(subscriptionFilters.status ? { status: subscriptionFilters.status } : {}),
    ...(subscriptionFilters.tier ? { tier: subscriptionFilters.tier } : {}),
    ...(subscriptionFilters.recurrence ? { recurrence: subscriptionFilters.recurrence } : {}),
    ...(subscriptionFilters.createdAtFrom ? { createdAtFrom: subscriptionFilters.createdAtFrom } : {}),
    ...(subscriptionFilters.createdAtTo ? { createdAtTo: subscriptionFilters.createdAtTo } : {}),
    ...(subscriptionFilters.nextPaymentDateFrom ? { nextPaymentDateFrom: subscriptionFilters.nextPaymentDateFrom } : {}),
    ...(subscriptionFilters.nextPaymentDateTo ? { nextPaymentDateTo: subscriptionFilters.nextPaymentDateTo } : {}),
  }
  const plans = useQuery({
    queryKey: [...queryKeys.plans, planQuery],
    queryFn: () => getAdminPlansService(planQuery),
    placeholderData: keepPreviousData,
    enabled: !isSubscribersPage,
  })
  const subscriptions = useQuery({
    queryKey: [...queryKeys.subscriptions, subscriptionQuery],
    queryFn: () => getAdminSubscriptionsService(subscriptionQuery),
    placeholderData: keepPreviousData,
    enabled: isSubscribersPage,
  })
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
    { field: 'amount', headerName: 'Valor', width: 130, valueGetter: (_value, row) => row.plan.amount, valueFormatter: (value) => formatCurrency(Number(value), 'BRL') },
    { field: 'status', headerName: 'Status', width: 140, renderCell: ({ row }) => <SubscriptionStatusChip status={row.status} /> },
    { field: 'nextPaymentDate', headerName: 'Próxima cobrança', width: 180, valueFormatter: (value) => value ? formatBrazilianDate(String(value)) : '—' },
    { field: 'createdAt', headerName: 'Criada em', width: 150, valueFormatter: (value) => formatBrazilianDate(String(value)) },
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
          onClick={() => {
            setSelectedSubscription(row)
            openActionRef.current('subscription-details')
          }}
        />,
      ],
    },
  ], [])

  return (
    <LayoutAdmin
      title={isSubscribersPage ? 'Assinantes' : 'Assinaturas'}
      subtitle={isSubscribersPage
        ? 'Acompanhe as assinaturas dos clientes e suas próximas cobranças.'
        : 'Gerencie as opções de planos e suas recorrências.'}
      onLogout={logout}
      actions={([
        {
          id: 'subscription-details',
          title: 'Detalhes da assinatura',
          subtitle: selectedSubscription
            ? `${selectedSubscription.user?.name ?? 'Cliente'} · ${selectedSubscription.plan.name}`
            : undefined,
          content: selectedSubscription
            ? <AdminSubscriptionDetails subscription={selectedSubscription} />
            : null,
        },
        {
          id: 'subscription-plan-filters',
          title: 'Filtrar opções de plano',
          subtitle: 'Refine os planos por nome, nível, recorrência ou status.',
          content: ({ close }) => (
            <AdminSubscriptionPlanFiltersForm
              key={JSON.stringify(planFilters)}
              filters={planFilters}
              onApply={(nextFilters) => {
                setPlanFilters(nextFilters)
                setPlanPaginationModel((current) => ({ ...current, page: 0 }))
              }}
              onClose={close}
            />
          ),
        },
        {
          id: 'customer-subscription-filters',
          title: 'Filtrar assinaturas',
          subtitle: 'Refine as assinaturas por cliente, plano, nível, recorrência ou status.',
          content: ({ close }) => (
            <AdminSubscriptionsFiltersForm
              key={JSON.stringify(subscriptionFilters)}
              filters={subscriptionFilters}
              onApply={(nextFilters) => {
                setSubscriptionFilters(nextFilters)
                setSubscriptionPaginationModel((current) => ({ ...current, page: 0 }))
              }}
              onClose={close}
            />
          ),
        },
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
      ] satisfies LayoutAdminAction[]).filter(({ id }) => isSubscribersPage
        ? id === 'subscription-details' || id === 'customer-subscription-filters'
        : id !== 'subscription-details' && id !== 'customer-subscription-filters')}
    >
      {({ openAction }) => (
        (() => {
        openActionRef.current = openAction
        return <Stack spacing={4}>
          {!isSubscribersPage && (
          <Stack spacing={1.5}>
            <Typography variant="h5" component="h2">Opções de plano</Typography>
            <Paper variant="outlined" sx={{ width: '100%' }}>
              <Stack direction="row" sx={{ justifyContent: 'flex-end', px: 1, pt: 0.5 }}>
                <IconButton aria-label="Abrir filtros de opções de plano" onClick={() => openAction('subscription-plan-filters')}>
                  <Badge badgeContent={getActiveSubscriptionPlanFilterCount(planFilters)} color="primary">
                    <SvgIcon>
                      <path d="M3 5h18v2H3zm3 6h12v2H6zm4 6h4v2h-4z" />
                    </SvgIcon>
                  </Badge>
                </IconButton>
              </Stack>
              {(removePlan.isError || activatePlan.isError) && (
                <Typography variant="body2" color="text.secondary" sx={{ px: 2, pb: 1 }}>
                  Ocorreu um erro ao atualizar o plano.
                </Typography>
              )}
              <DataGrid
                aria-label="Opções de recorrência dos planos"
                rows={plans.data?.plans ?? []}
                columns={planColumns}
                autoHeight
                loading={plans.isLoading || plans.isFetching}
                disableRowSelectionOnClick
                disableColumnMenu
                paginationMode="server"
                sortingMode="server"
                rowCount={plans.data?.pagination.total ?? 0}
                paginationModel={planPaginationModel}
                onPaginationModelChange={setPlanPaginationModel}
                sortModel={planSortModel}
                onSortModelChange={setPlanSortModel}
                pageSizeOptions={[10, 25]}
                localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
                slots={{
                  noRowsOverlay: () => (
                    <Stack sx={{ height: '100%', alignItems: 'center', justifyContent: 'center', px: 2 }}>
                      <Typography variant="body2" color="text.secondary" align="center">
                        {plans.isError
                          ? 'Ocorreu um erro ao carregar os planos.'
                          : 'Nenhum registro encontrado.'}
                      </Typography>
                    </Stack>
                  ),
                }}
              />
            </Paper>
          </Stack>
          )}
          {isSubscribersPage && (
          <Stack spacing={1.5}>
            <Typography variant="h5" component="h2">Assinaturas de clientes</Typography>
            <Paper variant="outlined" sx={{ width: '100%' }}>
              <Stack direction="row" sx={{ justifyContent: 'flex-end', px: 1, pt: 0.5 }}>
                <IconButton aria-label="Abrir filtros de assinaturas" onClick={() => openAction('customer-subscription-filters')}>
                  <Badge badgeContent={getActiveSubscriptionFilterCount(subscriptionFilters)} color="primary">
                    <SvgIcon>
                      <path d="M3 5h18v2H3zm3 6h12v2H6zm4 6h4v2h-4z" />
                    </SvgIcon>
                  </Badge>
                </IconButton>
              </Stack>
              <DataGrid
                aria-label="Assinaturas dos clientes"
                rows={subscriptions.data?.subscriptions ?? []}
                columns={subscriptionColumns}
                autoHeight
                loading={subscriptions.isLoading || subscriptions.isFetching}
                disableRowSelectionOnClick
                disableColumnMenu
                paginationMode="server"
                sortingMode="server"
                rowCount={subscriptions.data?.pagination.total ?? 0}
                paginationModel={subscriptionPaginationModel}
                onPaginationModelChange={setSubscriptionPaginationModel}
                sortModel={subscriptionSortModel}
                onSortModelChange={setSubscriptionSortModel}
                pageSizeOptions={[10, 25, 50]}
                localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
                slots={{
                  noRowsOverlay: () => (
                    <Stack sx={{ height: '100%', alignItems: 'center', justifyContent: 'center', px: 2 }}>
                      <Typography variant="body2" color="text.secondary" align="center">
                        {subscriptions.isError
                          ? 'Ocorreu um erro ao carregar as assinaturas.'
                          : 'Nenhum registro encontrado.'}
                      </Typography>
                    </Stack>
                  ),
                }}
              />
            </Paper>
          </Stack>
          )}
        </Stack>
        })()
      )}
    </LayoutAdmin>
  )
}
