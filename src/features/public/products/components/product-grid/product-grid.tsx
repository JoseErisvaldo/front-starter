import { Box } from '@mui/material'
import type { Product } from '../../types/product.types'
import { ProductCard } from './product-card'

export function ProductGrid({
  products,
  onAddToCart,
}: {
  products: Product[]
  onAddToCart: (product: Product) => void
}) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, minmax(0, 1fr))',
          md: 'repeat(3, minmax(0, 1fr))',
        },
        gap: 2,
      }}
    >
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
        />
      ))}
    </Box>
  )
}
