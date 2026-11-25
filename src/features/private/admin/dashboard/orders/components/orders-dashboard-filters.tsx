import { useState, type FormEvent } from 'react'
import { Alert, Button, Divider, FormControl, FormControlLabel, Radio, RadioGroup, Stack, TextField } from '@mui/material'

export type OrdersDashboardPreset = 'today' | 'this_week' | 'this_month' | 'last_30_days' | 'last_month' | 'custom'
export type OrdersDashboardFilters = { preset: OrdersDashboardPreset; dateFrom: string; dateTo: string }

type Props = {
  filters: OrdersDashboardFilters
  onApply: (filters: OrdersDashboardFilters) => void
  onClose: () => void
}

function localDate(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function getOrdersDashboardDateRange(preset: OrdersDashboardPreset, from: string, to: string) {
  if (preset === 'custom') return { dateFrom: from, dateTo: to }
  const today = new Date()
  if (preset === 'today') return { dateFrom: localDate(today), dateTo: localDate(today) }
  if (preset === 'last_30_days') {
    const start = new Date(today)
    start.setDate(today.getDate() - 29)
    return { dateFrom: localDate(start), dateTo: localDate(today) }
  }
  if (preset === 'last_month') {
    const start = new Date(today.getFullYear(), today.getMonth() - 1, 1)
    const end = new Date(today.getFullYear(), today.getMonth(), 0)
    return { dateFrom: localDate(start), dateTo: localDate(end) }
  }
  if (preset === 'this_month') {
    return {
      dateFrom: localDate(new Date(today.getFullYear(), today.getMonth(), 1)),
      dateTo: localDate(today),
    }
  }
  const monday = new Date(today)
  monday.setDate(today.getDate() - ((today.getDay() + 6) % 7))
  return { dateFrom: localDate(monday), dateTo: localDate(today) }
}

export function OrdersDashboardFiltersForm({ filters, onApply, onClose }: Props) {
  const [values, setValues] = useState(filters)
  const [error, setError] = useState('')

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const range = getOrdersDashboardDateRange(values.preset, values.dateFrom, values.dateTo)
    if (!range.dateFrom || !range.dateTo) {
      setError('Selecione as datas inicial e final.')
      return
    }
    if (range.dateFrom > range.dateTo) {
      setError('A data inicial deve ser anterior ou igual à data final.')
      return
    }
    if (values.preset === 'custom') {
      const today = new Date()
      const earliestAllowed = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 29)
      const earliestAllowedDate = localDate(earliestAllowed)
      const latestAllowedDate = localDate(today)
      const duration = (Date.parse(`${range.dateTo}T00:00:00Z`) - Date.parse(`${range.dateFrom}T00:00:00Z`)) / 86400000 + 1
      if (range.dateFrom < earliestAllowedDate || range.dateTo > latestAllowedDate || duration > 30) {
        setError('O período personalizado deve estar nos últimos 30 dias e ter no máximo 30 dias. Para consultar o mês anterior, selecione “Mês passado”.')
        return
      }
    }
    setError('')
    onApply({ ...values, ...range })
    onClose()
  }

  function clear() {
    const range = getOrdersDashboardDateRange('this_month', '', '')
    onApply({ preset: 'this_month', ...range })
    onClose()
  }

  return (
    <Stack component="form" spacing={2.5} onSubmit={submit} sx={{ height: '100%' }}>
      <Stack spacing={2} sx={{ flex: 1 }}>
        <FormControl>
          <RadioGroup
            value={values.preset}
            onChange={(event) => setValues((current) => ({ ...current, preset: event.target.value as OrdersDashboardPreset }))}
          >
            <FormControlLabel value="today" control={<Radio />} label="Hoje" />
            <FormControlLabel value="this_week" control={<Radio />} label="Esta semana" />
            <FormControlLabel value="this_month" control={<Radio />} label="Este mês" />
            <FormControlLabel value="last_30_days" control={<Radio />} label="Últimos 30 dias" />
            <FormControlLabel value="last_month" control={<Radio />} label="Mês passado" />
            <FormControlLabel value="custom" control={<Radio />} label="Período personalizado" />
          </RadioGroup>
        </FormControl>
        {values.preset === 'custom' && (
          <Stack direction="row" spacing={1.5}>
            <TextField
              type="date"
              label="De"
              value={values.dateFrom}
              onChange={(event) => setValues((current) => ({ ...current, dateFrom: event.target.value }))}
              slotProps={{
                inputLabel: { shrink: true },
                htmlInput: {
                  min: localDate(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 29)),
                  max: localDate(new Date()),
                },
              }}
              fullWidth
            />
            <TextField
              type="date"
              label="Até"
              value={values.dateTo}
              onChange={(event) => setValues((current) => ({ ...current, dateTo: event.target.value }))}
              slotProps={{
                inputLabel: { shrink: true },
                htmlInput: {
                  min: localDate(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 29)),
                  max: localDate(new Date()),
                },
              }}
              fullWidth
            />
          </Stack>
        )}
        {error && <Alert severity="error">{error}</Alert>}
      </Stack>
      <Divider />
      <Stack direction="row" spacing={1.5}>
        <Button type="button" variant="outlined" onClick={clear} fullWidth>Este mês</Button>
        <Button type="submit" variant="contained" fullWidth>Aplicar período</Button>
      </Stack>
    </Stack>
  )
}
