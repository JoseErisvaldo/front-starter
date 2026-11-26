import { Button, Card, CardActions, CardContent, Typography } from '@mui/material'
import { formatCurrency } from '../../../../../shared/lib/format-currency'
import type { Product } from '../../types/product.types'

export function ProductCard({
  product,
  onAddToCart,
}: {
  product: Product
  onAddToCart: (product: Product) => void
}) {
  return (
    <Card
      variant="outlined"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: 240,
        bgcolor: 'background.paper',
        '&:hover': { borderColor: 'primary.main' },
      }}
    >
      <CardContent sx={{ flex: 1, p: 2.5 }}>
        <Typography variant="h6" component="h2">{product.name}</Typography>
        <Typography
          color="text.secondary"
          sx={{
            mt: 1,
            minHeight: 48,
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {product.description}
        </Typography>
        <Typography variant="h5" sx={{ mt: 3, fontWeight: 650 }}>
          {formatCurrency(product.price, product.currency)}
        </Typography>
      </CardContent>
      <CardActions sx={{ px: 2.5, pb: 2.5 }}>
        <Button variant="contained" fullWidth onClick={() => onAddToCart(product)}>
          Adicionar ao carrinho
        </Button>
      </CardActions>
    </Card>
  )
}
