import { Box, Skeleton } from '@mui/material'

export function ProductGridSkeleton() {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, minmax(0, 1fr))',
          md: 'repeat(3, minmax(0, 1fr))',
        },
        gap: 2,
      }}
    >
      {Array.from({ length: 6 }, (_, index) => (
        <Skeleton key={index} variant="rounded" height={260} />
      ))}
    </Box>
  )
}
