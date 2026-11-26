import { Box, Card, CardContent, Stack, Typography } from '@mui/material'
import type { User } from '../../../../../public/auth/types/auth.types'
import { formatAdminAccountDate } from '../../utils/format-admin-account-date'

export function AdminAccountProfileCard({ user }: { user: User }) {
  return (
    <Card variant="outlined">
      <CardContent sx={{ p: { xs: 2.5, sm: 3.5 } }}>
        <Stack spacing={3}>
          <Typography variant="h6" component="h2" sx={{ color: '#173d30' }}>
            Dados do perfil
          </Typography>
          <Box>
            <Typography variant="overline" color="text.secondary">Nome</Typography>
            <Typography variant="body1">{user.name}</Typography>
          </Box>
          <Box>
            <Typography variant="overline" color="text.secondary">E-mail</Typography>
            <Typography variant="body1">{user.email}</Typography>
          </Box>
          <Box>
            <Typography variant="overline" color="text.secondary">Conta criada em</Typography>
            <Typography variant="body1">{formatAdminAccountDate(user.createdAt)}</Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  )
}
