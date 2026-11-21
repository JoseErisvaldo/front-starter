import { Box, Paper, Skeleton, Stack } from '@mui/material'

type Props = {
  columns?: number
  rows?: number
  toolbar?: boolean
}

export function AdminTableSkeleton({ columns = 5, rows = 5, toolbar = false }: Props) {
  const gridTemplateColumns = `repeat(${columns}, minmax(0, 1fr))`

  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Stack spacing={2}>
        {toolbar && (
          <Stack direction="row" sx={{ justifyContent: 'flex-end' }}>
            <Skeleton variant="rounded" width={40} height={40} />
          </Stack>
        )}
        <Box sx={{ display: 'grid', gridTemplateColumns, gap: 2 }}>
          {Array.from({ length: columns }, (_, index) => (
            <Skeleton key={`heading-${index}`} variant="rounded" height={20} />
          ))}
        </Box>
        {Array.from({ length: rows }, (_, row) => (
          <Box
            key={`row-${row}`}
            sx={{
              display: 'grid',
              gridTemplateColumns,
              gap: 2,
              py: 1.25,
              borderTop: '1px solid',
              borderColor: 'divider',
            }}
          >
            {Array.from({ length: columns }, (_, column) => (
              <Skeleton key={`cell-${row}-${column}`} variant="rounded" height={22} />
            ))}
          </Box>
        ))}
      </Stack>
    </Paper>
  )
}
