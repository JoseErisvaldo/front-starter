import { Navigate, type RouteObject } from 'react-router-dom'
import { AuthGuard } from '../features/private/guards/auth.guard'
import { AdminRoute } from '../features/private/admin/routes/admin.route'
import { OrdersRoute } from '../features/private/user/home/routes/orders.route'
import { AuthRoute } from '../features/public/auth/routes/auth.route'
import { CatalogRoute } from '../features/public/products/routes/catalog.route'

const publicRoutes: RouteObject[] = [
  { path: '/', element: <Navigate to="/produtos" replace /> },
  { path: '/produtos', element: <CatalogRoute /> },
  { path: '/login', element: <AuthRoute mode="login" /> },
  { path: '/register', element: <AuthRoute mode="register" /> },
]

const userPrivateRoutes: RouteObject[] = [
  { path: '/pedidos', element: <OrdersRoute /> },
]

const adminRoutes: RouteObject[] = [
  { path: '/admin/*', element: <AdminRoute /> },
]

export const appRoutes: RouteObject[] = [
  ...publicRoutes,
  {
    element: <AuthGuard allowedRoles={['USER']} />,
    children: userPrivateRoutes,
  },
  {
    element: <AuthGuard allowedRoles={['ADMIN', 'MODERATOR']} />,
    children: adminRoutes,
  },
  { path: '*', element: <Navigate to="/produtos" replace /> },
]
