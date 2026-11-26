import { Card, CardContent, Skeleton, Typography } from '@mui/material'
import { PeriodChange } from './period-change'

export function MetricCard({ title, value, current, previous, loading }: {
  title: string
  value: string | number | undefined
  current?: number
  previous?: number
  loading: boolean
}) {
  return (
    <Card variant="outlined" sx={{ flex: '1 1 210px', minWidth: 0 }}>
      <CardContent>
        <Typography variant="body2" color="text.secondary">{title}</Typography>
        {loading || value === undefined
          ? <Skeleton variant="text" width={160} height={48} />
          : <Typography variant="h4" sx={{ mt: 1, fontWeight: 700 }}>{value}</Typography>}
        {current !== undefined && previous !== undefined
          ? <PeriodChange current={current} previous={previous} />
          : current !== undefined || loading
            ? <Skeleton variant="text" width={150} />
            : null}
      </CardContent>
    </Card>
  )
}
