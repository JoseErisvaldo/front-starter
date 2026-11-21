import { useLogout } from '../../../public/auth/hooks/use-logout'
import { AdminView } from '../views/admin.view'

export function AdminRoute() {
  const logout = useLogout()

  return <AdminView onLogout={logout} />
}
