import { Divider, Skeleton, Stack } from '@mui/material'

export function AdminOrderDetailsSkeleton() {
  return (
    <Stack spacing={2.5} aria-label="Carregando detalhes do pedido">
      <Skeleton variant="rounded" width={112} height={28} />
      <Divider />
      <Stack spacing={1}>
        <Skeleton width={72} height={20} />
        <Skeleton width="55%" height={24} />
        <Skeleton width="75%" height={20} />
      </Stack>
      <Divider />
      <Stack spacing={1}>
        <Skeleton width={120} height={20} />
        <Skeleton variant="rounded" height={56} />
        <Skeleton variant="rounded" height={56} />
        <Skeleton width="45%" height={24} sx={{ alignSelf: 'flex-end' }} />
      </Stack>
      <Divider />
      <Stack spacing={1}>
        <Skeleton width={104} height={20} />
        <Skeleton width="80%" height={20} />
        <Skeleton width="92%" height={20} />
      </Stack>
    </Stack>
  )
}
