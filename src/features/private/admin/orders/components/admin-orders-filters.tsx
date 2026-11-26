import { useState, type FormEvent } from 'react'
import { Alert, Button, Divider, MenuItem, Stack, TextField } from '@mui/material'
import {
  emptyAdminOrdersFilters,
  type AdminOrdersFilters,
} from '../types/admin-orders.types'

type Props = {
  filters: AdminOrdersFilters
  onApply: (filters: AdminOrdersFilters) => void
  onClose: () => void
}

export function AdminOrdersFiltersForm({ filters, onApply, onClose }: Props) {
  const [values, setValues] = useState(filters)
  const [error, setError] = useState('')

  function update<K extends keyof AdminOrdersFilters>(
    key: K,
    value: AdminOrdersFilters[K],
  ) {
    setValues((current) => ({ ...current, [key]: value }))
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (values.dateFrom && values.dateTo && values.dateFrom > values.dateTo) {
      setError('A data inicial deve ser anterior ou igual à data final.')
      return
    }
    setError('')
    onApply(values)
    onClose()
  }

  function clearFilters() {
    setValues(emptyAdminOrdersFilters)
    setError('')
    onApply(emptyAdminOrdersFilters)
    onClose()
  }

  return (
    <Stack
      component="form"
      spacing={2.5}
      onSubmit={submit}
      sx={{ height: '100%', minHeight: 0 }}
    >
      <Stack spacing={2.5} sx={{ flex: 1, overflowY: 'auto', minHeight: 0, pb: 1 }}>
        <TextField
          label="Pedido"
          value={values.search}
          onChange={(event) => update('search', event.target.value)}
          placeholder="ID ou referência do pedido"
          fullWidth
        />
        <TextField
          label="Nome do cliente"
          value={values.customerName}
          onChange={(event) => update('customerName', event.target.value)}
          fullWidth
        />
        <TextField
          select
          label="Tipo de pagamento"
          value={values.paymentMethod}
          onChange={(event) => update('paymentMethod', event.target.value as AdminOrdersFilters['paymentMethod'])}
          fullWidth
        >
          <MenuItem value="">Todos</MenuItem>
          <MenuItem value="pix">Pix</MenuItem>
          <MenuItem value="card">Cartão</MenuItem>
        </TextField>
        <TextField
          select
          label="Status"
          value={values.status}
          onChange={(event) => update('status', event.target.value as AdminOrdersFilters['status'])}
          fullWidth
        >
          <MenuItem value="">Todos</MenuItem>
          <MenuItem value="paid">Pago</MenuItem>
          <MenuItem value="pending">Pendente</MenuItem>
          <MenuItem value="failed">Falhou</MenuItem>
          <MenuItem value="cancelled">Cancelado</MenuItem>
          <MenuItem value="expired">Expirado</MenuItem>
        </TextField>
        <Stack direction="row" spacing={1.5}>
          <TextField
            type="date"
            label="Data inicial"
            value={values.dateFrom}
            onChange={(event) => update('dateFrom', event.target.value)}
            slotProps={{ inputLabel: { shrink: true } }}
            fullWidth
          />
          <TextField
            type="date"
            label="Data final"
            value={values.dateTo}
            onChange={(event) => update('dateTo', event.target.value)}
            slotProps={{ inputLabel: { shrink: true } }}
            fullWidth
          />
        </Stack>
        {error && <Alert severity="error">{error}</Alert>}
      </Stack>
      <Divider />
      <Stack direction="row" spacing={1.5} sx={{ flexShrink: 0 }}>
        <Button type="button" variant="outlined" onClick={clearFilters} fullWidth>
          Limpar
        </Button>
        <Button type="submit" variant="contained" fullWidth>
          Aplicar filtros
        </Button>
      </Stack>
    </Stack>
  )
}
