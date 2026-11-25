import { z } from 'zod'

export const ordersDashboardQuerySchema = z.object({
  dateFrom: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  dateTo: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  comparison: z.literal(true).optional(),
})

export const ordersDashboardResponseSchema = z.object({
  summary: z.object({
    totalOrders: z.number().int(),
    totalSales: z.number(),
    paidOrders: z.number().int(),
    averagePaidOrder: z.number(),
  }),
  statuses: z.array(z.object({
    status: z.string(),
    count: z.number().int(),
    orderValue: z.number(),
    percentage: z.number(),
  })),
  paymentMethods: z.array(z.object({
    paymentMethod: z.string(),
    orders: z.number().int(),
    sales: z.number(),
    orderPercentage: z.number(),
    salesPercentage: z.number(),
  })),
  topProductsByOrders: z.array(z.object({
    productName: z.string(),
    orderCount: z.number().int(),
    paidAmount: z.number(),
    percentage: z.number(),
  })).max(10),
  topProductsByRevenue: z.array(z.object({
    productName: z.string(),
    orderCount: z.number().int(),
    paidAmount: z.number(),
    percentage: z.number(),
  })).max(10),
  daily: z.array(z.object({
    date: z.string(),
    orders: z.number().int(),
    orderValue: z.number(),
    orderPercentage: z.number(),
    paidOrders: z.number().int(),
    sales: z.number(),
    salesPercentage: z.number(),
    statuses: z.record(z.string(), z.number().int()),
    paymentMethods: z.record(z.string(), z.object({
      orders: z.number().int(),
      sales: z.number(),
      percentage: z.number(),
    })),
  })),
})

export type OrdersDashboardQuery = z.infer<typeof ordersDashboardQuerySchema>
export type OrdersDashboard = z.infer<typeof ordersDashboardResponseSchema>
