import { Box, Button, Card, CardContent, Stack, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import type { User } from '../../../../../public/auth/types/auth.types'
import { formatBrazilianLongDate } from '../../../../../../shared/utils/format-brazilian-long-date'
import { translateUserRole } from '../../../../../../shared/i18n/user-role'

export function AccountDetailsCard({ user }: { user: User }) {
  return (
    <Card variant="outlined">
      <CardContent sx={{ p: { xs: 2.5, sm: 4 } }}>
        <Stack spacing={3}>
          <Box>
            <Typography variant="overline" color="text.secondary">Nome</Typography>
            <Typography variant="h6">{user.name}</Typography>
          </Box>
          <Box>
            <Typography variant="overline" color="text.secondary">E-mail</Typography>
            <Typography variant="body1">{user.email}</Typography>
          </Box>
          <Box>
            <Typography variant="overline" color="text.secondary">Tipo de conta</Typography>
            <Typography variant="body1">{translateUserRole(user.role)}</Typography>
          </Box>
          <Box>
            <Typography variant="overline" color="text.secondary">Conta criada em</Typography>
            <Typography variant="body1">{formatBrazilianLongDate(user.createdAt)}</Typography>
          </Box>
          <Button component={RouterLink} to="/produtos" variant="outlined" sx={{ alignSelf: 'flex-start' }}>
            Voltar para produtos
          </Button>
        </Stack>
      </CardContent>
    </Card>
  )
}
