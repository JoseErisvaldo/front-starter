import { z } from 'zod'

export const createProductInputSchema = z.object({
  name: z.string().trim().min(2, 'O nome deve ter pelo menos 2 caracteres').max(120),
  description: z.string().trim().min(1, 'Informe uma descrição').max(2000),
  price: z.coerce
    .number()
    .positive('O preço deve ser maior que zero')
    .max(99_999_999.99, 'O preço máximo é 99.999.999,99')
    .refine((value) => Number(value.toFixed(2)) === value, 'O preço deve ter no máximo duas casas decimais'),
})

export const createProductResponseSchema = z.object({
  product: z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    price: z.number(),
    currency: z.string().length(3),
  }),
})

export type CreateProductInput = z.infer<typeof createProductInputSchema>
