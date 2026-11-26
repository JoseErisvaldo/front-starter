import { Skeleton } from '@mui/material'

export function DashboardChartSkeleton({ height = 280 }: { height?: number }) {
  return <Skeleton variant="rounded" height={height} />
}
