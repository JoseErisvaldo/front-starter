import { useOutletContext } from 'react-router-dom'
import type { User } from '../../../../public/auth/types/auth.types'
import { useLogout } from '../../../../public/auth/hooks/use-logout'
import { AdminAccountView } from '../views/admin-account.view'

export function AdminAccountRoute() {
  const user = useOutletContext<User>()
  const logout = useLogout()

  return <AdminAccountView user={user} onLogout={logout} />
}
