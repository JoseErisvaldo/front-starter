import { lazy, Suspense, useEffect, useState, type ComponentType } from 'react'
import { Alert, Button, CircularProgress, Stack } from '@mui/material'
import { Navigate, type RouteObject } from 'react-router-dom'
import { AuthGuard } from '../features/private/guards/auth.guard'
import { AdminRoute } from '../features/private/admin/routes/admin.route'
import { AdminAccountRoute } from '../features/private/admin/account/routes/admin-account.route'
import { OrdersRoute } from '../features/private/user/home/routes/orders.route'
import { AccountRoute } from '../features/private/user/account/routes/account.route'
import { AuthRoute } from '../features/public/auth/routes/auth.route'
import { CatalogRoute } from '../features/public/products/routes/catalog.route'
import { LayoutAdmin } from '../shared/layout/layout-admin'
import { AdminTableSkeleton } from '../shared/components/admin-table-skeleton'
import { useLogout } from '../features/public/auth/hooks/use-logout'

const loadAdminProductsRoute = () =>
  import('../features/private/admin/products/routes/admin-products.route').then(
    (module) => module.AdminProductsRoute,
  )

const loadAdminOrdersRoute = () =>
  import('../features/private/admin/orders/routes/admin-orders.route').then(
    (module) => module.AdminOrdersRoute,
  )

const loadAdminSubscriptionsRoute = () =>
  import('../features/private/admin/subscriptions/routes/admin-subscriptions.route').then(
    (module) => module.AdminSubscriptionsRoute,
  )

const UserSubscriptionsRoute = lazy(() =>
  import('../features/private/user/subscriptions/routes/subscriptions.route').then(
    (module) => ({ default: module.SubscriptionsRoute }),
  ),
)

function AdminRouteLoader({ title, subtitle, columns, toolbar = false, loadRoute }: {
  title: string
  subtitle: string
  columns: number
  toolbar?: boolean
  loadRoute: () => Promise<ComponentType>
}) {
  const logout = useLogout()
  const [RouteComponent, setRouteComponent] = useState<ComponentType | null>(null)
  const [loadError, setLoadError] = useState('')
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    let active = true
    setLoadError('')
    loadRoute().then((component) => {
      if (active) setRouteComponent(() => component)
    }).catch((error: unknown) => {
      if (active) {
        setLoadError(
          error instanceof Error
            ? `Não foi possível carregar esta tela: ${error.message}`
            : 'Não foi possível carregar esta tela.',
        )
      }
    })

    return () => {
      active = false
    }
  }, [loadRoute, retryCount])

  if (RouteComponent) return <RouteComponent />

  return (
    <LayoutAdmin title={title} subtitle={subtitle} onLogout={logout}>
      {loadError ? (
        <Stack spacing={2}>
          <Alert severity="error">{loadError}</Alert>
          <Button
            variant="outlined"
            onClick={() => {
              setRouteComponent(null)
              setRetryCount((count) => count + 1)
            }}
            sx={{ alignSelf: 'flex-start' }}
          >
            Tentar novamente
          </Button>
        </Stack>
      ) : (
        <AdminTableSkeleton columns={columns} toolbar={toolbar} />
      )}
    </LayoutAdmin>
  )
}

const publicRoutes: RouteObject[] = [
  { path: '/', element: <Navigate to="/produtos" replace /> },
  { path: '/produtos', element: <CatalogRoute /> },
  { path: '/login', element: <AuthRoute mode="login" /> },
  { path: '/register', element: <AuthRoute mode="register" /> },
]

const userPrivateRoutes: RouteObject[] = [
  { path: '/conta', element: <AccountRoute /> },
  { path: '/pedidos', element: <OrdersRoute /> },
  {
    path: '/assinaturas',
    element: (
      <Suspense fallback={<Stack sx={{ minHeight: '100vh', alignItems: 'center', justifyContent: 'center' }}><CircularProgress /></Stack>}>
        <UserSubscriptionsRoute />
      </Suspense>
    ),
  },
  {
    path: '/minhas-assinaturas',
    element: (
      <Suspense fallback={<Stack sx={{ minHeight: '100vh', alignItems: 'center', justifyContent: 'center' }}><CircularProgress /></Stack>}>
        <UserSubscriptionsRoute />
      </Suspense>
    ),
  },
  {
    path: '/minhas-assinaturas',
    element: (
      <Suspense fallback={<Stack sx={{ minHeight: '100vh', alignItems: 'center', justifyContent: 'center' }}><CircularProgress /></Stack>}>
        <UserSubscriptionsRoute />
      </Suspense>
    ),
  },
]

const adminRoutes: RouteObject[] = [
  { path: '/admin', element: <AdminRoute /> },
  { path: '/admin/conta', element: <AdminAccountRoute /> },
  {
    path: '/admin/produtos',
    element: (
      <AdminRouteLoader
        key="admin-products"
        title="Produtos"
        subtitle="Cadastre e acompanhe os produtos disponíveis para venda."
        columns={5}
        loadRoute={loadAdminProductsRoute}
      />
    ),
  },
  {
    path: '/admin/pedidos',
    element: (
      <AdminRouteLoader
        key="admin-orders"
        title="Pedidos"
        subtitle="Consulte os pedidos realizados e os dados dos clientes."
        columns={8}
        toolbar
        loadRoute={loadAdminOrdersRoute}
      />
    ),
  },
  {
    path: '/admin/assinaturas',
    element: (
      <AdminRouteLoader
        key="admin-subscriptions"
        title="Assinaturas"
        subtitle="Gerencie as opções de planos e suas recorrências."
        columns={5}
        toolbar
        loadRoute={loadAdminSubscriptionsRoute}
      />
    ),
  },
  {
    path: '/admin/assinantes',
    element: (
      <AdminRouteLoader
        key="admin-subscribers"
        title="Assinantes"
        subtitle="Acompanhe as assinaturas dos clientes e suas próximas cobranças."
        columns={8}
        toolbar
        loadRoute={loadAdminSubscriptionsRoute}
      />
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
