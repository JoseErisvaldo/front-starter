import {
  Alert,
  AppBar,
  Box,
  Button,
  Container,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import { Link as RouterLink } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CartDrawer } from "../../cart/components/cart-drawer.view";
import { useCatalogPage } from "../hooks/use-catalog-page";
import { ProductGrid } from "../components/product-grid/product-grid";
import { ProductGridSkeleton } from "../components/product-grid/product-grid.skeleton";
import { PaymentCheckoutView } from "../../../../shared/cross-features/payments";
import { LayoutUser } from "../../../../shared/layout/layout-user";

export function CatalogView() {
  const catalog = useCatalogPage();
  const cartButton = (
    <IconButton
      aria-label={`Carrinho com ${catalog.cartCount} itens`}
      onClick={() => catalog.setIsCartOpen(true)}
      color="primary"
    >
      <ShoppingCartOutlinedIcon />
      {catalog.cartCount > 0 && (
        <Box
          component="span"
          sx={{
            position: "absolute",
            top: 0,
            right: 0,
            fontSize: 11,
            fontWeight: 700,
            borderRadius: "50%",
            bgcolor: "error.main",
            color: "common.white",
            width: 18,
            height: 18,
            display: "grid",
            placeItems: "center",
          }}
        >
          {catalog.cartCount}
        </Box>
      )}
    </IconButton>
  );

  const content = (
    <>
      <ToastContainer
        position="top-right"
        autoClose={2500}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      {!catalog.user && (
        <AppBar position="sticky" color="inherit" elevation={0}>
          <Toolbar component={Container} maxWidth="lg" sx={{ gap: 2 }}>
            <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 1, fontWeight: 700 }}
            >
              Produtos
            </Typography>
            <Button component={RouterLink} to="/login">
              Entrar
            </Button>
            {cartButton}
          </Toolbar>
        </AppBar>
      )}

      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Stack spacing={3}>
          <Box>
            <Stack
              direction="row"
              sx={{ alignItems: "center", justifyContent: "space-between" }}
            >
              <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
                Nosso catálogo
              </Typography>
              {catalog.user && cartButton}
            </Stack>
            <Typography color="text.secondary" sx={{ mt: 1 }}>
              Encontre os produtos disponíveis e adicione ao seu carrinho.
            </Typography>
          </Box>
          <TextField
            fullWidth
            value={catalog.search}
            onChange={(event) => catalog.setSearch(event.target.value)}
            placeholder="Buscar produtos..."
            aria-label="Buscar produtos"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">⌕</InputAdornment>
                ),
              },
            }}
          />

          {catalog.productsError ? (
            <Alert severity="error">{catalog.productsError}</Alert>
          ) : catalog.isProductsLoading ? (
            <ProductGridSkeleton />
          ) : catalog.products.length === 0 ? (
            <Alert severity="info">
              {catalog.search
                ? "Nenhum produto encontrado para esta busca."
                : "Nenhum produto disponível no momento."}
            </Alert>
          ) : (
            <ProductGrid
              products={catalog.products}
              onAddToCart={catalog.onAddToCart}
            />
          )}
        </Stack>
      </Container>

      <CartDrawer
        open={catalog.isCartOpen}
        onClose={() => catalog.setIsCartOpen(false)}
        onCheckout={catalog.onCheckout}
      />
      {catalog.user && (
        <PaymentCheckoutView
          items={catalog.checkoutItems}
          user={catalog.user}
          result={catalog.paymentResult}
          onClose={() => catalog.setCheckoutItems([])}
          onViewOrders={catalog.onViewOrders}
          onResult={catalog.onPaymentResult}
        />
      )}
    </>
  );

  return catalog.user ? (
    <LayoutUser onLogout={catalog.onLogout}>{content}</LayoutUser>
  ) : (
    content
  );
}
