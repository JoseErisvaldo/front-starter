import { lazy, Suspense, useEffect, useState, type ComponentType } from 'react'
import { Alert, Button, CircularProgress, Stack } from '@mui/material'
import { Navigate, type RouteObject } from 'react-router-dom'
import { AuthGuard } from '../features/private/guards/auth.guard'
import { AdminRoute } from '../features/private/admin/routes/admin.route'
import { AdminAccountRoute } from '../features/private/admin/account'
import { OrdersView } from '../features/private/user/orders'
import { AccountView } from '../features/private/user/account'
import { AuthRoute } from '../features/public/auth/routes/auth.route'
import { CatalogView } from '../features/public/products'
import { LayoutAdmin } from '../shared/layout/layout-admin'
import { AdminTableSkeleton } from '../shared/components/admin-table-skeleton'
import { useLogout } from '../features/public/auth/hooks/use-logout'

const loadAdminProductsRoute = () =>
  import('../features/private/admin/products').then(
    (module) => module.AdminProductsView,
  )

const loadAdminOrdersRoute = () =>
  import('../features/private/admin/orders').then(
    (module) => module.AdminOrdersView,
  )

const loadAdminSubscriptionsRoute = () =>
  import('../features/private/admin/subscriptions').then(
    (module) => module.AdminSubscriptionsView,
  )

const loadAdminCustomersRoute = () =>
  import('../features/private/admin/customers').then(
    (module) => module.AdminCustomersView,
  )

const loadCustomerDashboardRoute = () =>
  import('../features/private/admin/dashboard/customers').then(
    (module) => module.CustomerDashboardView,
  )

const loadOrdersDashboardRoute = () =>
  import('../features/private/admin/dashboard/orders').then(
    (module) => module.OrdersDashboardView,
  )

const loadSubscriptionsDashboardRoute = () =>
  import('../features/private/admin/dashboard/subscriptions').then(
    (module) => module.SubscriptionsDashboardView,
  )

const UserSubscriptionPlansView = lazy(() =>
  import('../features/private/user/subscriptions').then(
    (module) => ({ default: module.SubscriptionPlansView }),
  ),
)

const MySubscriptionsView = lazy(() =>
  import('../features/private/user/my-subscriptions').then(
    (module) => ({ default: module.MySubscriptionsView }),
  ),
)

function AdminRouteLoader({ title, subtitle, columns, toolbar = false, showTableSkeleton = true, loadRoute }: {
  title: string
  subtitle: string
  columns: number
  toolbar?: boolean
  showTableSkeleton?: boolean
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
      ) : showTableSkeleton ? (
        <AdminTableSkeleton columns={columns} toolbar={toolbar} />
      ) : null}
    </LayoutAdmin>
  )
}

const publicRoutes: RouteObject[] = [
  { path: '/', element: <Navigate to="/produtos" replace /> },
  { path: '/produtos', element: <CatalogView /> },
  { path: '/login', element: <AuthRoute mode="login" /> },
  { path: '/register', element: <AuthRoute mode="register" /> },
]

const userPrivateRoutes: RouteObject[] = [
  { path: '/conta', element: <AccountView /> },
  { path: '/pedidos', element: <OrdersView /> },
  {
    path: '/assinaturas',
    element: (
      <Suspense fallback={<Stack sx={{ minHeight: '100vh', alignItems: 'center', justifyContent: 'center' }}><CircularProgress /></Stack>}>
        <UserSubscriptionPlansView />
      </Suspense>
    ),
  },
  {
    path: '/minhas-assinaturas',
    element: (
      <Suspense fallback={<Stack sx={{ minHeight: '100vh', alignItems: 'center', justifyContent: 'center' }}><CircularProgress /></Stack>}>
        <MySubscriptionsView />
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
    path: '/admin/dashboard/pedidos',
    element: (
      <AdminRouteLoader
        key="admin-orders-dashboard"
        title="Dashboard de pedidos"
        subtitle="Acompanhe vendas, pagamentos e a distribuição dos pedidos por status."
        columns={4}
        showTableSkeleton={false}
        loadRoute={loadOrdersDashboardRoute}
      />
    ),
  },
  {
    path: '/admin/dashboard/clientes',
    element: (
      <AdminRouteLoader
        key="admin-customer-dashboard"
        title="Dashboard de clientes"
        subtitle="Acompanhe o crescimento da base de clientes e a situação das assinaturas."
        columns={4}
        loadRoute={loadCustomerDashboardRoute}
      />
    ),
  },
  {
    path: '/admin/dashboard/assinaturas',
    element: (
      <AdminRouteLoader
        key="admin-subscriptions-dashboard"
        title="Dashboard de assinaturas"
        subtitle="Acompanhe assinaturas, cobranças pagas e a evolução dos planos."
        columns={4}
        showTableSkeleton={false}
        loadRoute={loadSubscriptionsDashboardRoute}
      />
    ),
  },
  {
    path: '/admin/clientes',
    element: (
      <AdminRouteLoader
        key="admin-customers"
        title="Clientes"
        subtitle="Consulte os clientes cadastrados e acompanhe a situação das assinaturas."
        columns={5}
        toolbar
        loadRoute={loadAdminCustomersRoute}
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
