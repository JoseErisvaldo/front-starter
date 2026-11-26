export const customerDashboardQueryKeys = {
  all: ['admin-customer-dashboard'] as const,
  overview: () => [...customerDashboardQueryKeys.all, 'overview'] as const,
}
