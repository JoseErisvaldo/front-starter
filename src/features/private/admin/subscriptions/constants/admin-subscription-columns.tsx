import { Chip, SvgIcon } from '@mui/material'
import { GridActionsCellItem, type GridColDef } from '@mui/x-data-grid'
import { formatBrazilianDate } from '../../../../../shared/utils/format-brazilian-date'
import { formatCurrency } from '../../../../../shared/lib/format-currency'
import { SubscriptionStatusChip } from '../../../../subscriptions/components/subscription-status-chip'
import {
  subscriptionRecurrenceLabels,
  subscriptionTierLabels,
} from '../../../../subscriptions/constants/subscription-options'
import type {
  SubscriptionPlan,
  SubscriptionRecord,
} from '../types/admin-subscriptions.types'

export const getAdminPlanColumns = (
  onEdit: (plan: SubscriptionPlan) => void,
  onToggleActive: (plan: SubscriptionPlan) => void,
  isMutationPending: boolean,
): GridColDef<SubscriptionPlan>[] => [
  { field: 'name', headerName: 'Nome', minWidth: 180, flex: 1 },
  { field: 'tier', headerName: 'Nível', width: 140, valueFormatter: (value) => subscriptionTierLabels[value as keyof typeof subscriptionTierLabels] },
  { field: 'recurrence', headerName: 'Recorrência', width: 150, valueFormatter: (value) => subscriptionRecurrenceLabels[value as keyof typeof subscriptionRecurrenceLabels] },
  { field: 'amount', headerName: 'Valor', width: 140, valueFormatter: (value) => formatCurrency(Number(value), 'BRL') },
  {
    field: 'active',
    headerName: 'Status',
    width: 130,
    renderCell: ({ row }) => <Chip label={row.active ? 'Ativo' : 'Inativo'} color={row.active ? 'success' : 'default'} size="small" />,
  },
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
        onClick={() => onEdit(row)}
        icon={<SvgIcon><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" /></SvgIcon>}
      />,
      <GridActionsCellItem
        key="toggle-active"
        label={row.active ? 'Desativar opção' : 'Ativar opção'}
        showInMenu
        disabled={isMutationPending}
        onClick={() => onToggleActive(row)}
        icon={<SvgIcon><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 2a8 8 0 0 1 6.32 12.9L7.1 5.68A7.96 7.96 0 0 1 12 4zM5.68 7.1 16.9 18.32A8 8 0 0 1 5.68 7.1z" /></SvgIcon>}
      />,
    ],
  },
]

export const getAdminSubscriptionColumns = (
  onViewDetails: (subscription: SubscriptionRecord) => void,
): GridColDef<SubscriptionRecord>[] => [
  { field: 'customer', headerName: 'Cliente', flex: 1, minWidth: 200, valueGetter: (_value, row) => row.user?.name ?? '—' },
  { field: 'email', headerName: 'E-mail', flex: 1, minWidth: 220, valueGetter: (_value, row) => row.user?.email ?? '—' },
  { field: 'plan', headerName: 'Plano', width: 220, valueGetter: (_value, row) => `${row.plan.name} · ${subscriptionRecurrenceLabels[row.plan.recurrence]}` },
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
        onClick={() => onViewDetails(row)}
      />,
    ],
  },
]
