import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import { formatBrazilianDayMonthLabel } from '../../../../../../shared/utils/format-brazilian-date'
import type { SubscriptionsDashboard } from '../schema/subscriptions-dashboard.schema'
import { formatBrazilianCurrency } from '../utils/subscription-dashboard-formatters'

function getDaysUntilCharge(date: string, startDate: string) {
  const days = (Date.parse(`${date}T00:00:00.000Z`) - Date.parse(`${startDate}T00:00:00.000Z`)) / 86400000
  if (days === 0) return 'Hoje'
  if (days === 1) return 'Amanhã'
  return `Em ${days} dias`
}

export function UpcomingSubscriptionChargesTable({ data, startDate }: {
  data: SubscriptionsDashboard['forecast']['upcomingCharges']
  startDate: string
}) {
  if (data.length === 0) {
    return <Typography color="text.secondary">Nenhuma cobrança prevista nos próximos 30 dias.</Typography>
  }

  return (
    <>
      <TableContainer sx={{ maxHeight: 480 }}>
        <Table size="small" stickyHeader aria-label="Próximas cobranças previstas">
          <TableHead>
            <TableRow>
              <TableCell>Data</TableCell>
              <TableCell>Prazo</TableCell>
              <TableCell>Cliente</TableCell>
              <TableCell>Plano</TableCell>
              <TableCell align="right">Valor previsto</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((charge, index) => (
              <TableRow key={`${charge.subscriptionId}-${charge.date}-${index}`} hover>
                <TableCell>{formatBrazilianDayMonthLabel(charge.date)}</TableCell>
                <TableCell>{getDaysUntilCharge(charge.date, startDate)}</TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{charge.customerName}</Typography>
                  <Typography variant="caption" color="text.secondary">{charge.customerEmail}</Typography>
                </TableCell>
                <TableCell>{charge.planName}</TableCell>
                <TableCell align="right">{formatBrazilianCurrency(charge.amount)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {data.length === 100 && (
        <Typography variant="caption" color="text.secondary">
          Exibindo as 100 próximas cobranças previstas.
        </Typography>
      )}
    </>
  )
}
