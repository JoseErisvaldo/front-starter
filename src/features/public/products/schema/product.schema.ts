import { z } from 'zod'

export const productSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  price: z.number().nonnegative(),
  currency: z.string().length(3),
})

export const productsResponseSchema = z.object({
  products: z.array(productSchema),
})
