import { useLogout } from '../../../../public/auth/hooks/use-logout'
import { useHome } from '../hooks/use-home'
import { OrdersView } from '../views/orders.view'

export function OrdersRoute() {
  const orders = useHome(true)
  const logout = useLogout()

  return <OrdersView {...orders} onLogout={logout} />
}
