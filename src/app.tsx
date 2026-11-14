import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import { AuthFormView } from './features/auth/components/auth-form.view'
import { useMeQuery } from './features/auth/queries/use-me-query'
import { authQueryKeys } from './features/auth/endpoints-keys/auth.keys'
import { TOKEN_STORAGE_KEY } from './shared/services/http-client'
import { HomeView } from './features/home/views/home.view'
import { useHome } from './features/home/hooks/use-home'

function ProtectedHome() {
  const { data: user, isLoading, isError } = useMeQuery()
  const home = useHome()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  useEffect(() => {
    if (isError) navigate('/login', { replace: true })
  }, [isError, navigate])

  if (!localStorage.getItem(TOKEN_STORAGE_KEY)) return <Navigate to="/login" replace />
  if (isLoading) return <main className="loading-screen">Carregando...</main>
  if (!user) return null

  function logout() {
    localStorage.removeItem(TOKEN_STORAGE_KEY)
    queryClient.removeQueries({ queryKey: authQueryKeys.all })
    navigate('/login', { replace: true })
  }

  return (
    <HomeView
      user={user}
      {...home}
      onLogout={logout}
    />
  )
}

function AuthRoute({ mode }: { mode: 'login' | 'register' }) {
  const { data: user, isLoading } = useMeQuery()
  if (isLoading && localStorage.getItem(TOKEN_STORAGE_KEY)) return <main className="loading-screen">Carregando...</main>
  if (user) return <Navigate to="/" replace />
  return <AuthFormView mode={mode} />
}

export function App() {
  return (
    <Routes>
      <Route path="/" element={<ProtectedHome />} />
      <Route path="/login" element={<AuthRoute mode="login" />} />
      <Route path="/register" element={<AuthRoute mode="register" />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
