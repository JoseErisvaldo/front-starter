import { Navigate } from 'react-router-dom'
import { AuthFormView } from '../components/auth-form.view'
import { useAuthRedirect } from '../hooks/use-auth-redirect'
import { AuthRedirectView } from '../views/auth-redirect.view'

type Props = {
  mode: 'login' | 'register'
}

export function AuthRoute({ mode }: Props) {
  const { destination, isLoading, redirectTo } = useAuthRedirect()

  if (isLoading) return <AuthRedirectView />
  if (destination) return <Navigate to={destination} replace />

  return <AuthFormView mode={mode} redirectTo={redirectTo} />
}
