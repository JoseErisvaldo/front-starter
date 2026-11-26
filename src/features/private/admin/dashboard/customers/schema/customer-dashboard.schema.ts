import { z } from 'zod'

export const customerDashboardSchema = z.object({
  summary: z.object({
    totalCustomers: z.number().int(),
    activeSubscribers: z.number().int(),
    nonSubscribers: z.number().int(),
    registeredThisMonth: z.number().int(),
  }),
  daily: z.array(z.object({ date: z.string(), count: z.number().int(), average: z.number() })),
  monthly: z.array(z.object({ month: z.string(), count: z.number().int(), average: z.number() })),
})
