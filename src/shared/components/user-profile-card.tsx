import { Avatar, Box, Card, CardContent, Chip, Divider, Stack, Typography } from '@mui/material'
import type { User } from '../../features/public/auth/types/auth.types'
import { translateUserRole } from '../i18n/user-role'
import { formatBrazilianLongDate } from '../utils/format-brazilian-long-date'

type Props = {
  user: User
  eyebrow: string
}

export function UserProfileCard({ user, eyebrow }: Props) {
  const initials = user.name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toLocaleUpperCase() ?? '')
    .join('')

  return (
    <Card variant="outlined" sx={{ overflow: 'hidden', borderRadius: 3 }}>
      <Box
        sx={{
          height: { xs: 150, sm: 190 },
          position: 'relative',
          background: 'linear-gradient(125deg, #173d30 0%, #26714f 52%, #8abf91 100%)',
          '&::before': {
            content: '""',
            position: 'absolute',
            width: 280,
            height: 280,
            right: { xs: -80, sm: 40 },
            top: -150,
            border: '1px solid rgba(255,255,255,.2)',
            borderRadius: '50%',
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            width: 360,
            height: 360,
            right: { xs: -130, sm: -20 },
            top: -160,
            border: '1px solid rgba(255,255,255,.15)',
            borderRadius: '50%',
          },
        }}
      >
        <Typography
          variant="overline"
          sx={{ position: 'absolute', top: 20, left: 24, color: 'rgba(255,255,255,.75)', letterSpacing: '.12em' }}
        >
          {eyebrow}
        </Typography>
        <Avatar
          aria-label={`Foto de perfil de ${user.name}`}
          sx={{
            position: 'absolute',
            left: { xs: 20, sm: 32 },
            bottom: -48,
            width: { xs: 96, sm: 112 },
            height: { xs: 96, sm: 112 },
            border: '5px solid #fff',
            bgcolor: '#dcefe3',
            color: '#1d6848',
            fontSize: { xs: 32, sm: 38 },
            fontWeight: 700,
            boxShadow: '0 4px 16px rgba(0,0,0,.15)',
          }}
        >
          {initials}
        </Avatar>
      </Box>
      <CardContent sx={{ p: { xs: 2.5, sm: 3.5 }, pt: { xs: 7, sm: 8 } }}>
        <Stack spacing={2.5}>
          <Stack spacing={0.75}>
            <Typography variant="h4" component="h2" sx={{ color: '#173d30', fontWeight: 750, letterSpacing: '-.03em', overflowWrap: 'anywhere' }}>
              {user.name}
            </Typography>
            <Typography color="text.secondary" sx={{ overflowWrap: 'anywhere' }}>
              {user.email}
            </Typography>
            <Chip
              label={translateUserRole(user.role)}
              size="small"
              sx={{ alignSelf: 'flex-start', mt: 0.5, bgcolor: '#eaf3ed', color: '#26714f', fontWeight: 700 }}
            />
          </Stack>
          <Divider />
          <Box>
            <Typography variant="overline" color="text.secondary">Conta criada em</Typography>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              {formatBrazilianLongDate(user.createdAt)}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  )
}
