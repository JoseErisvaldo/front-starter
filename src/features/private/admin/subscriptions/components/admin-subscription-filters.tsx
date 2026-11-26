import { useState, type FormEvent } from 'react'
import { Button, Divider, MenuItem, Stack, TextField, Typography } from '@mui/material'
import {
  emptyPlanFilters,
  emptySubscriptionFilters,
  type AdminPlanFilters,
  type AdminSubscriptionFilters,
} from '../types/admin-subscriptions.types'
import {
  subscriptionRecurrences,
  subscriptionTiers,
} from '../../../../subscriptions/constants/subscription-options'
import { adminSubscriptionStatuses } from '../constants/admin-subscription-options'

export function getActiveSubscriptionPlanFilterCount(filters: AdminPlanFilters) {
  return Object.values(filters).filter(Boolean).length
}

export function getActiveSubscriptionFilterCount(filters: AdminSubscriptionFilters) {
  return Object.values(filters).filter(Boolean).length
}

type PlanFormProps = {
  filters: AdminPlanFilters
  onApply: (filters: AdminPlanFilters) => void
  onClose: () => void
}

type SubscriptionFormProps = {
  filters: AdminSubscriptionFilters
  onApply: (filters: AdminSubscriptionFilters) => void
  onClose: () => void
}

export function AdminSubscriptionPlanFiltersForm({
  filters,
  onApply,
  onClose,
}: PlanFormProps) {
  const [values, setValues] = useState(filters)

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onApply(values)
    onClose()
  }

  function clearFilters() {
    setValues(emptyPlanFilters)
    onApply(emptyPlanFilters)
    onClose()
  }

  return (
    <Stack component="form" spacing={2.5} onSubmit={submit} sx={{ height: '100%', minHeight: 0 }}>
      <Stack spacing={2.5} sx={{ flex: 1, overflowY: 'auto', minHeight: 0, pb: 1 }}>
        <TextField
          label="Nome do plano"
          value={values.search}
          onChange={(event) => setValues((current) => ({ ...current, search: event.target.value }))}
          fullWidth
        />
        <TextField
          select
          label="Nível"
          value={values.tier}
          onChange={(event) => setValues((current) => ({ ...current, tier: event.target.value as AdminPlanFilters['tier'] }))}
          fullWidth
        >
          <MenuItem value="">Todos</MenuItem>
          {subscriptionTiers.map(({ value, label }) => <MenuItem key={value} value={value}>{label}</MenuItem>)}
        </TextField>
        <TextField
          select
          label="Recorrência"
          value={values.recurrence}
          onChange={(event) => setValues((current) => ({ ...current, recurrence: event.target.value as AdminPlanFilters['recurrence'] }))}
          fullWidth
        >
          <MenuItem value="">Todas</MenuItem>
          {subscriptionRecurrences.map(({ value, label }) => <MenuItem key={value} value={value}>{label}</MenuItem>)}
        </TextField>
        <TextField
          select
          label="Status"
          value={values.active}
          onChange={(event) => setValues((current) => ({ ...current, active: event.target.value as AdminPlanFilters['active'] }))}
          fullWidth
        >
          <MenuItem value="">Todos</MenuItem>
          <MenuItem value="true">Ativo</MenuItem>
          <MenuItem value="false">Inativo</MenuItem>
        </TextField>
      </Stack>
      <Divider />
      <Stack direction="row" spacing={1.5} sx={{ flexShrink: 0 }}>
        <Button type="button" variant="outlined" onClick={clearFilters} fullWidth>Limpar</Button>
        <Button type="submit" variant="contained" fullWidth>Aplicar filtros</Button>
      </Stack>
    </Stack>
  )
}

export function AdminSubscriptionsFiltersForm({
  filters,
  onApply,
  onClose,
}: SubscriptionFormProps) {
  const [values, setValues] = useState(filters)
  const [error, setError] = useState('')

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (values.createdAtFrom && values.createdAtTo && values.createdAtFrom > values.createdAtTo) {
      setError('A data inicial da assinatura deve ser anterior ou igual à data final.')
      return
    }
    if (values.nextPaymentDateFrom && values.nextPaymentDateTo && values.nextPaymentDateFrom > values.nextPaymentDateTo) {
      setError('A data inicial da próxima cobrança deve ser anterior ou igual à data final.')
      return
    }
    setError('')
    onApply(values)
    onClose()
  }

  function clearFilters() {
    setValues(emptySubscriptionFilters)
    setError('')
    onApply(emptySubscriptionFilters)
    onClose()
  }

  return (
    <Stack component="form" spacing={2.5} onSubmit={submit} sx={{ height: '100%', minHeight: 0 }}>
      <Stack spacing={2.5} sx={{ flex: 1, overflowY: 'auto', minHeight: 0, pb: 1 }}>
        <TextField
          label="Cliente, e-mail ou plano"
          value={values.search}
          onChange={(event) => setValues((current) => ({ ...current, search: event.target.value }))}
          fullWidth
        />
        <TextField
          select
          label="Status"
          value={values.status}
          onChange={(event) => setValues((current) => ({ ...current, status: event.target.value }))}
          fullWidth
        >
          <MenuItem value="">Todos</MenuItem>
          {adminSubscriptionStatuses.map(({ value, label }) => <MenuItem key={value} value={value}>{label}</MenuItem>)}
        </TextField>
        <TextField
          select
          label="Nível"
          value={values.tier}
          onChange={(event) => setValues((current) => ({ ...current, tier: event.target.value as AdminSubscriptionFilters['tier'] }))}
          fullWidth
        >
          <MenuItem value="">Todos</MenuItem>
          {subscriptionTiers.map(({ value, label }) => <MenuItem key={value} value={value}>{label}</MenuItem>)}
        </TextField>
        <TextField
          select
          label="Recorrência"
          value={values.recurrence}
          onChange={(event) => setValues((current) => ({ ...current, recurrence: event.target.value as AdminSubscriptionFilters['recurrence'] }))}
          fullWidth
        >
          <MenuItem value="">Todas</MenuItem>
          {subscriptionRecurrences.map(({ value, label }) => <MenuItem key={value} value={value}>{label}</MenuItem>)}
        </TextField>
        <Typography variant="subtitle2">Data da assinatura</Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
          <TextField
            type="date"
            label="De"
            value={values.createdAtFrom}
            onChange={(event) => setValues((current) => ({ ...current, createdAtFrom: event.target.value }))}
            slotProps={{ inputLabel: { shrink: true } }}
            fullWidth
          />
          <TextField
            type="date"
            label="Até"
            value={values.createdAtTo}
            onChange={(event) => setValues((current) => ({ ...current, createdAtTo: event.target.value }))}
            slotProps={{ inputLabel: { shrink: true } }}
            fullWidth
          />
        </Stack>
        <Typography variant="subtitle2">Próxima cobrança</Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
          <TextField
            type="date"
            label="De"
            value={values.nextPaymentDateFrom}
            onChange={(event) => setValues((current) => ({ ...current, nextPaymentDateFrom: event.target.value }))}
            slotProps={{ inputLabel: { shrink: true } }}
            fullWidth
          />
          <TextField
            type="date"
            label="Até"
            value={values.nextPaymentDateTo}
            onChange={(event) => setValues((current) => ({ ...current, nextPaymentDateTo: event.target.value }))}
            slotProps={{ inputLabel: { shrink: true } }}
            fullWidth
          />
        </Stack>
        {error && <Typography variant="body2" color="error">{error}</Typography>}
      </Stack>
      <Divider />
      <Stack direction="row" spacing={1.5} sx={{ flexShrink: 0 }}>
        <Button type="button" variant="outlined" onClick={clearFilters} fullWidth>Limpar</Button>
        <Button type="submit" variant="contained" fullWidth>Aplicar filtros</Button>
      </Stack>
    </Stack>
  )
}
