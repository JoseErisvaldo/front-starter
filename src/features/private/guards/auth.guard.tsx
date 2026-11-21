import { Box, CircularProgress, Typography } from '@mui/material'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useMeQuery } from '../../public/auth/queries/use-me-query'
import type { User } from '../../public/auth/types/auth.types'
import { TOKEN_STORAGE_KEY } from '../../../shared/services/http-client'

type Props = {
  allowedRoles?: User['role'][]
}

export function AuthGuard({ allowedRoles }: Props) {
  const location = useLocation()
  const { data: user, isLoading, isError } = useMeQuery()
  const hasToken = Boolean(localStorage.getItem(TOKEN_STORAGE_KEY))

  if (!hasToken) {
    return (
      <Navigate
        to="/login"
        state={{ from: `${location.pathname}${location.search}` }}
        replace
      />
    )
  }

  if (isLoading) {
    return (
      <Box
        component="main"
        role="status"
        sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center', gap: 2 }}
      >
        <Box sx={{ display: 'grid', justifyItems: 'center', gap: 2 }}>
          <CircularProgress size={28} />
          <Typography color="text.secondary">Validando acesso...</Typography>
        </Box>
      </Box>
    )
  }

  if (isError || !user) {
    return (
      <Navigate
        to="/login"
        state={{ from: `${location.pathname}${location.search}` }}
        replace
      />
    )
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={user.role === 'USER' ? '/produtos' : '/admin'} replace />
  }

  return <Outlet context={user} />
}
