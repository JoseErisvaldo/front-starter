import { useState, type FormEvent } from 'react'
import { Alert, Button, Divider, MenuItem, Stack, TextField, Typography } from '@mui/material'
import {
  emptyAdminCustomersFilters,
  type AdminCustomersFilters,
} from '../types/admin-customers.types'

export function AdminCustomersFiltersForm({
  filters,
  onApply,
  onClose,
}: {
  filters: AdminCustomersFilters
  onApply: (filters: AdminCustomersFilters) => void
  onClose: () => void
}) {
  const [values, setValues] = useState(filters)
  const [dateError, setDateError] = useState('')

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (values.createdAtFrom && values.createdAtTo && values.createdAtFrom > values.createdAtTo) {
      setDateError('A data inicial deve ser anterior ou igual à data final.')
      return
    }
    setDateError('')
    onApply(values)
    onClose()
  }

  function clearFilters() {
    setValues(emptyAdminCustomersFilters)
    setDateError('')
    onApply(emptyAdminCustomersFilters)
    onClose()
  }

  return (
    <Stack component="form" spacing={2.5} onSubmit={submit} sx={{ height: '100%', minHeight: 0 }}>
      <Stack spacing={2.5} sx={{ flex: 1 }}>
        <TextField
          label="Buscar cliente"
          placeholder="Nome ou e-mail"
          value={values.search}
          onChange={(event) => setValues((current) => ({ ...current, search: event.target.value }))}
          fullWidth
        />
        <TextField
          select
          label="Status da assinatura"
          value={values.status}
          onChange={(event) => setValues((current) => ({ ...current, status: event.target.value as AdminCustomersFilters['status'] }))}
          fullWidth
        >
          <MenuItem value="">Todos</MenuItem>
          <MenuItem value="active">Assinatura ativa</MenuItem>
          <MenuItem value="cancelled">Assinatura cancelada</MenuItem>
          <MenuItem value="never_subscribed">Não assinou</MenuItem>
        </TextField>
        <Typography variant="subtitle2">Data de criação da conta</Typography>
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
        {dateError && <Alert severity="error">{dateError}</Alert>}
      </Stack>
      <Divider />
      <Stack direction="row" spacing={1.5}>
        <Button type="button" variant="outlined" onClick={clearFilters} fullWidth>Limpar</Button>
        <Button type="submit" variant="contained" fullWidth>Aplicar filtros</Button>
      </Stack>
    </Stack>
  )
}
