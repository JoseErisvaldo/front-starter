import { z } from 'zod'
import { productSchema } from '../../../../public/products/schema/product.schema'

export const adminProductsQuerySchema = z.object({
  page: z.number().int().min(0),
  pageSize: z.number().int().min(1).max(100),
  sortBy: z.enum(['name', 'description', 'price']),
  sortOrder: z.enum(['asc', 'desc']),
})

export const adminProductsResponseSchema = z.object({
  products: z.array(productSchema),
  pagination: z.object({
    page: z.number().int(),
    pageSize: z.number().int(),
    total: z.number().int(),
  }),
})

export type AdminProductsQuery = z.infer<typeof adminProductsQuerySchema>
