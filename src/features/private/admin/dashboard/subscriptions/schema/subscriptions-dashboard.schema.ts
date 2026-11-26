import { z } from 'zod'

export const subscriptionsDashboardQuerySchema = z.object({
  dateFrom: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  dateTo: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  comparison: z.literal(true).optional(),
  upcomingPage: z.number().int().min(1).default(1),
  upcomingPageSize: z.number().int().min(1).max(50).default(10),
})

export const subscriptionsDashboardResponseSchema = z.object({
  summary: z.object({
    totalSubscriptions: z.number().int(),
    activeSubscriptions: z.number().int(),
    paidCharges: z.number().int(),
    paidRevenue: z.number(),
  }),
  statuses: z.array(z.object({
    status: z.string(),
    count: z.number().int(),
    percentage: z.number(),
  })),
  plans: z.array(z.object({
    name: z.string(),
    count: z.number().int(),
    contractedAmount: z.number(),
    percentage: z.number(),
  })).max(10),
  daily: z.array(z.object({
    date: z.string(),
    subscriptions: z.number().int(),
    statuses: z.record(z.string(), z.number().int()),
    paidCharges: z.number().int(),
    paidRevenue: z.number(),
  })),
  forecast: z.object({
    startDate: z.string(),
    endDate: z.string(),
    totalExpectedCharges: z.number().int(),
    totalExpectedAmount: z.number(),
    daily: z.array(z.object({
      date: z.string(),
      expectedCharges: z.number().int(),
      expectedAmount: z.number(),
    })).length(30),
    upcomingCharges: z.object({
      items: z.array(z.object({
        date: z.string(),
        subscriptionId: z.string().uuid(),
        customerName: z.string(),
        customerEmail: z.string().email(),
        planName: z.string(),
        amount: z.number(),
      })),
      pagination: z.object({
        page: z.number().int(),
        pageSize: z.number().int(),
        total: z.number().int(),
        pageCount: z.number().int(),
      }),
    }),
  }),
})
