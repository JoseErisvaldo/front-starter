import { lazy, Suspense } from 'react'
import { Box, CircularProgress } from '@mui/material'
import { Navigate, type RouteObject } from 'react-router-dom'
import { AuthGuard } from '../features/private/guards/auth.guard'
import { AdminRoute } from '../features/private/admin/routes/admin.route'
import { AdminAccountRoute } from '../features/private/admin/account/routes/admin-account.route'
import { OrdersRoute } from '../features/private/user/home/routes/orders.route'
import { AccountRoute } from '../features/private/user/account/routes/account.route'
import { AuthRoute } from '../features/public/auth/routes/auth.route'
import { CatalogRoute } from '../features/public/products/routes/catalog.route'

const AdminProductsRoute = lazy(() =>
  import('../features/private/admin/products/routes/admin-products.route').then((module) => ({
    default: module.AdminProductsRoute,
  })),
)

const publicRoutes: RouteObject[] = [
  { path: '/', element: <Navigate to="/produtos" replace /> },
  { path: '/produtos', element: <CatalogRoute /> },
  { path: '/login', element: <AuthRoute mode="login" /> },
  { path: '/register', element: <AuthRoute mode="register" /> },
]

const userPrivateRoutes: RouteObject[] = [
  { path: '/conta', element: <AccountRoute /> },
  { path: '/pedidos', element: <OrdersRoute /> },
]

const adminRoutes: RouteObject[] = [
  { path: '/admin', element: <AdminRoute /> },
  { path: '/admin/conta', element: <AdminAccountRoute /> },
  {
    path: '/admin/produtos',
    element: (
      <Suspense
        fallback={
          <Box sx={{ minHeight: '50vh', display: 'grid', placeItems: 'center' }}>
            <CircularProgress size={28} />
          </Box>
        }
      >
        <AdminProductsRoute />
      </Suspense>
    ),
  },
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
