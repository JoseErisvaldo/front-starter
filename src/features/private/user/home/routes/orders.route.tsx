import { useOutletContext } from 'react-router-dom'
import type { User } from '../../../../public/auth/types/auth.types'
import { useLogout } from '../../../../public/auth/hooks/use-logout'
import { useHome } from '../hooks/use-home'
import { OrdersView } from '../views/orders.view'

export function OrdersRoute() {
  const user = useOutletContext<User>()
  const orders = useHome(true)
  const logout = useLogout()

  return <OrdersView user={user} {...orders} onLogout={logout} />
}
