import {
  Alert,
  AppBar,
  Box,
  Button,
  Container,
  Drawer,
  Fade,
  Fab,
  InputAdornment,
  Stack,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import type { CSSProperties } from "react";
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
  const toastStyle: CSSProperties & { "--toastify-color-success": string } = {
    "--toastify-color-success": "#28624d",
  };
  const cartButton = (
    <Fab
      aria-label={`Abrir carrinho com ${catalog.cartCount} itens`}
      onClick={() => catalog.setIsCartOpen(true)}
      color="primary"
      sx={{
        position: "fixed",
        right: { xs: 16, sm: 24 },
        bottom: { xs: 20, sm: 24 },
        zIndex: (theme) => theme.zIndex.speedDial,
        boxShadow: 4,
      }}
    >
      <ShoppingCartOutlinedIcon />
      {catalog.cartCount > 0 && (
        <Box
          component="span"
          sx={{
            position: "absolute",
            top: -4,
            right: -4,
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
    </Fab>
  );

  const content = (
    <>
      <ToastContainer
        style={toastStyle}
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

      <Drawer
        anchor="right"
        open={catalog.isCartOpen || catalog.checkoutItems.length > 0}
        onClose={() => {
          catalog.setCheckoutItems([]);
          catalog.setIsCartOpen(false);
        }}
        slotProps={{
          paper: {
            sx: {
              width: { xs: "100%", sm: 560 },
              maxWidth: "100vw",
              display: "flex",
              flexDirection: "column",
              bgcolor: "#f8faf8",
              overflow: "hidden",
            },
          },
        }}
      >
        <Fade
          key={catalog.checkoutItems.length > 0 ? "checkout" : "cart"}
          in
          appear
          timeout={160}
        >
          <Box sx={{ height: "100%", width: "100%" }}>
            {catalog.checkoutItems.length > 0 && catalog.user ? (
              <PaymentCheckoutView
                items={catalog.checkoutItems}
                user={catalog.user}
                result={catalog.paymentResult}
                onBack={() => catalog.setCheckoutItems([])}
                onClose={() => {
                  catalog.setCheckoutItems([]);
                  catalog.setIsCartOpen(false);
                }}
                onViewOrders={catalog.onViewOrders}
                onResult={catalog.onPaymentResult}
              />
            ) : (
              <CartDrawer
                onClose={() => catalog.setIsCartOpen(false)}
                onCheckout={catalog.onCheckout}
              />
            )}
          </Box>
        </Fade>
      </Drawer>
      {cartButton}
    </>
  );

  return catalog.user ? (
    <LayoutUser onLogout={catalog.onLogout}>{content}</LayoutUser>
  ) : (
    content
  );
}
