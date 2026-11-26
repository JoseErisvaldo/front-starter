import { Typography } from '@mui/material'

export function PeriodChange({ current, previous }: { current: number; previous: number }) {
  if (previous === 0 && current !== 0) {
    return <Typography variant="caption" color="text.secondary">Novo no período</Typography>
  }
  const change = previous === 0 ? 0 : ((current - previous) / Math.abs(previous)) * 100
  const color = change > 0 ? 'success.main' : change < 0 ? 'error.main' : 'text.secondary'
  return (
    <Typography variant="caption" sx={{ color }}>
      {change > 0 ? '+' : ''}{change.toFixed(1)}% vs. período anterior
    </Typography>
  )
}
