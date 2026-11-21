import { useOutletContext } from 'react-router-dom'
import type { User } from '../../../../public/auth/types/auth.types'
import { useLogout } from '../../../../public/auth/hooks/use-logout'
import { AccountView } from '../views/account.view'

export function AccountRoute() {
  const user = useOutletContext<User>()
  const logout = useLogout()

  return <AccountView user={user} onLogout={logout} />
}
