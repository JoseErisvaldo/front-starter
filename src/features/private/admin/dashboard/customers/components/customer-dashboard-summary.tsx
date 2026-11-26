import { Card, CardContent, Stack, Typography } from '@mui/material'
import type { CustomerDashboard } from '../types/customer-dashboard.types'
import { customerDashboardMetrics } from '../constants/customer-dashboard-metrics'

export function CustomerDashboardSummary({ summary }: {
  summary: CustomerDashboard['summary']
}) {
  return (
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
      {customerDashboardMetrics.map((metric) => {
        const color = 'color' in metric ? metric.color : undefined
        return (
          <Card key={metric.title} variant="outlined" sx={{ flex: 1 }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary">{metric.title}</Typography>
              <Typography variant="h4" sx={{ mt: 1, fontWeight: 700, ...(color ? { color } : {}) }}>
                {summary[metric.key]}
              </Typography>
            </CardContent>
          </Card>
        )
      })}
    </Stack>
  )
}
