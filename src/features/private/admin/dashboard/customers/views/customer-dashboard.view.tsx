import { Alert, Card, CardContent, CircularProgress, FormControl, MenuItem, Select, Stack, Typography } from '@mui/material'
import { LayoutAdmin } from '../../../../../../shared/layout/layout-admin'
import { useLogout } from '../../../../../public/auth/hooks/use-logout'
import { CustomerDashboardSummary } from '../components/customer-dashboard-summary'
import { RegistrationChart } from '../components/registration-chart'
import { useCustomerDashboardPage } from '../hooks/use-customer-dashboard-page'

export function CustomerDashboardView() {
  const logout = useLogout()
  const { period, setPeriod, dashboard } = useCustomerDashboardPage()

  return (
    <LayoutAdmin
      title="Dashboard de clientes"
      subtitle="Acompanhe o crescimento da base de clientes e a situação das assinaturas."
      onLogout={logout}
    >
      {dashboard.isLoading ? (
        <Stack sx={{ minHeight: 240, alignItems: 'center', justifyContent: 'center' }}>
          <CircularProgress />
        </Stack>
      ) : dashboard.error ? (
        <Alert severity="error">Não foi possível carregar os dados do dashboard de clientes.</Alert>
      ) : dashboard.data ? (
        <Stack spacing={3}>
          <CustomerDashboardSummary summary={dashboard.data.summary} />
          <Card variant="outlined">
            <CardContent>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                sx={{
                  alignItems: { sm: 'center' },
                  justifyContent: 'space-between',
                  gap: 2,
                  mb: 2,
                }}
              >
                <Stack spacing={0.5}>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>Novos clientes</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Cadastros por {period === 'daily' ? 'dia' : 'mês'} e média do período
                  </Typography>
                </Stack>
                <FormControl size="small" sx={{ minWidth: 150 }}>
                  <Select
                    value={period}
                    onChange={(event) => setPeriod(event.target.value as typeof period)}
                    aria-label="Agrupar cadastros"
                  >
                    <MenuItem value="daily">Por dia · 30 dias</MenuItem>
                    <MenuItem value="monthly">Por mês · 12 meses</MenuItem>
                  </Select>
                </FormControl>
              </Stack>
              <RegistrationChart
                data={period === 'daily' ? dashboard.data.daily : dashboard.data.monthly}
              />
            </CardContent>
          </Card>
        </Stack>
      ) : null}
    </LayoutAdmin>
  )
}
