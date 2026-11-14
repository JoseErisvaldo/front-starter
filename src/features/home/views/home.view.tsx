import type { User } from '../../auth/types/auth.types'
import type { Product } from '../../products/types/product.types'
import type { PaymentResponse } from '../../payments/types/payment.types'
import { PaymentCheckoutView } from '../../payments/components/payment-checkout.view'
import { formatCurrency } from '../../../shared/lib/format-currency'
import {
  Alert,
  AppBar,
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Container,
  Paper,
  Skeleton,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material'

type Props = {
  user: User
  products: Product[]
  isProductsLoading: boolean
  productsError: string
  selectedProduct: Product | null
  paymentResult: PaymentResponse['payment'] | null
  onLogout: () => void
  onSelectProduct: (product: Product) => void
  onCloseCheckout: () => void
  onPaymentResult: (payment: PaymentResponse['payment']) => void
}

export function HomeView({
  user,
  products,
  isProductsLoading,
  productsError,
  selectedProduct,
  paymentResult,
  onLogout,
  onSelectProduct,
  onCloseCheckout,
  onPaymentResult,
}: Props) {
  return (
    <Box component="main" sx={{ minHeight: '100vh' }}>
      <AppBar
        position="static"
        color="transparent"
        elevation={0}
        sx={{ borderBottom: 1, borderColor: 'divider' }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 800, letterSpacing: '.1em' }}
          >
            AUTH STARTER
          </Typography>
          <Button variant="outlined" color="inherit" onClick={onLogout}>
            Sair
          </Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="md" sx={{ py: { xs: 8, md: 14 } }}>
        <Paper
          component="section"
          elevation={0}
          sx={{
            p: { xs: 3, sm: 6 },
            border: 1,
            borderColor: 'divider',
            background: 'linear-gradient(145deg, #161f34, #111827)',
          }}
        >
          <Stack spacing={2}>
            <Typography
              variant="overline"
              color="primary.light"
              sx={{ letterSpacing: '.16em' }}
            >
              ÁREA AUTENTICADA
            </Typography>
            <Typography
              variant="h2"
              component="h1"
              sx={{ fontSize: { xs: '2.5rem', sm: '3.5rem' } }}
            >
              Olá, {user.name}.
            </Typography>
            <Typography color="text.secondary" sx={{ maxWidth: 520 }}>
              Escolha um produto abaixo e pague com cartão ou Pix.
            </Typography>
            <Box>
              <Chip
                avatar={<Avatar>{user.name.slice(0, 1).toUpperCase()}</Avatar>}
                label={user.email}
                variant="outlined"
                sx={{ mt: 2, py: 2.5 }}
              />
            </Box>
          </Stack>
        </Paper>
        <Stack spacing={3} sx={{ mt: 6 }}>
          <Typography variant="h4" component="h2">Produtos</Typography>
          {productsError && <Alert severity="error">{productsError}</Alert>}
          {isProductsLoading && (
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2 }}>
              <Skeleton variant="rounded" height={210} />
              <Skeleton variant="rounded" height={210} />
            </Box>
          )}
          {!isProductsLoading && !productsError && products.length === 0 && (
            <Alert severity="info">Nenhum produto disponível no momento.</Alert>
          )}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2 }}>
            {products.map((product) => (
              <Card key={product.id} variant="outlined">
                <CardContent>
                  <Typography variant="h6" component="h3">{product.name}</Typography>
                  <Typography color="text.secondary" sx={{ mt: 1, minHeight: 48 }}>
                    {product.description}
                  </Typography>
                  <Typography variant="h5" color="primary.light" sx={{ mt: 2 }}>
                    {formatCurrency(product.price, product.currency)}
                  </Typography>
                </CardContent>
                <CardActions sx={{ px: 2, pb: 2 }}>
                  <Button variant="contained" onClick={() => onSelectProduct(product)}>
                    Comprar
                  </Button>
                </CardActions>
              </Card>
            ))}
          </Box>
        </Stack>
      </Container>
      <PaymentCheckoutView
        product={selectedProduct}
        user={user}
        result={paymentResult}
        onClose={onCloseCheckout}
        onResult={onPaymentResult}
      />
    </Box>
  )
}
