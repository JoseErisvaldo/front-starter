import { useLocation } from 'react-router-dom'
import { useMeQuery } from '../queries/use-me-query'
import { TOKEN_STORAGE_KEY } from '../../../../shared/services/http-client'

function getRedirectTo(state: unknown): string | null {
  if (!state || typeof state !== 'object' || !('from' in state)) return null
  const from = state.from
  if (typeof from !== 'string') return null
  if (from === '/pedidos' || from === '/produtos' || from.startsWith('/produtos?')) {
    return from
  }
  return null
}

export function useAuthRedirect() {
  const location = useLocation()
  const hasToken = Boolean(localStorage.getItem(TOKEN_STORAGE_KEY))
  const { data: user, isLoading } = useMeQuery()
  const redirectTo = getRedirectTo(location.state)

  const destination = user
    ? user.role === 'USER'
      ? redirectTo?.startsWith('/produtos') ? redirectTo : '/produtos'
      : '/admin'
    : null

  return {
    destination,
    isLoading: hasToken && isLoading,
    redirectTo,
  }
}
