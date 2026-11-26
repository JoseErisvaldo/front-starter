import { Card, CardContent, Chip, Stack, Typography } from '@mui/material'
import type { User } from '../../../../../public/auth/types/auth.types'
import { translateUserRole } from '../../../../../../shared/i18n/user-role'

export function AdminAccountAccessCard({ user }: { user: User }) {
  return (
    <Card variant="outlined">
      <CardContent sx={{ p: { xs: 2.5, sm: 3.5 } }}>
        <Stack spacing={2}>
          <Typography variant="h6" component="h2" sx={{ color: '#173d30' }}>
            Acesso administrativo
          </Typography>
          <Chip
            label={translateUserRole(user.role)}
            sx={{
              alignSelf: 'flex-start',
              bgcolor: '#e1f0e5',
              color: '#1d6848',
              fontWeight: 700,
            }}
          />
          <Typography variant="body2" color="text.secondary">
            Este perfil tem acesso à área administrativa conforme sua função.
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  )
}
