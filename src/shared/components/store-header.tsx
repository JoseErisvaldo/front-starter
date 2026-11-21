import { AppBar, Box, Button, Container, Link, Stack, Toolbar, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import type { User } from "../../features/public/auth/types/auth.types";

type Props = {
  user: User | null;
  activePage: "products" | "orders";
  onLogout: () => void;
  cartCount?: number;
  onOpenCart?: () => void;
};

export function StoreHeader({
  user,
  activePage,
  onLogout,
  cartCount = 0,
  onOpenCart,
}: Props) {
  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        bgcolor: "background.paper",
        color: "text.primary",
        borderBottom: 1,
        borderColor: "divider",
      }}
    >
      <Container maxWidth="lg">
        <Toolbar
          disableGutters
          sx={{ minHeight: { xs: 64, sm: 72 }, gap: { xs: 1, sm: 3 } }}
        >
          <Link
            component={RouterLink}
            to="/produtos"
            color="inherit"
            underline="none"
            sx={{ flexShrink: 0 }}
          >
            <Typography variant="h5" component="span" sx={{ fontWeight: 700, color: "primary.main" }}>
              Vitrine
            </Typography>
          </Link>
          <Box sx={{ flex: 1, minWidth: 0 }} />
          <Stack
            direction="row"
            spacing={{ xs: 0.25, sm: 1 }}
            sx={{ alignItems: "center", flexShrink: 0 }}
          >
            {activePage === "products" && (
              <Button color="inherit" onClick={onOpenCart}>
                Carrinho{cartCount > 0 ? ` (${cartCount})` : ""}
              </Button>
            )}
            <Button
              component={RouterLink}
              to="/produtos"
              color="inherit"
              variant="text"
              sx={{
                display:
                  activePage === "products"
                    ? { xs: "none", sm: "inline-flex" }
                    : "inline-flex",
                color: activePage === "products" ? "primary.main" : "text.primary",
                bgcolor: activePage === "products" ? "rgba(40, 98, 77, 0.08)" : undefined,
                "&:hover": { bgcolor: "rgba(40, 98, 77, 0.08)" },
                minWidth: "auto",
                px: { xs: 1, sm: 1.5 },
                whiteSpace: "nowrap",
              }}
            >
              Produtos
            </Button>
            {user ? (
              <>
                <Button
                  component={RouterLink}
                  to="/pedidos"
                  color="inherit"
                  variant="text"
                  sx={{
                    display:
                      activePage === "orders"
                        ? { xs: "none", sm: "inline-flex" }
                        : "inline-flex",
                    color: activePage === "orders" ? "primary.main" : "text.primary",
                    bgcolor: activePage === "orders" ? "rgba(40, 98, 77, 0.08)" : undefined,
                    "&:hover": { bgcolor: "rgba(40, 98, 77, 0.08)" },
                    minWidth: "auto",
                    px: { xs: 1, sm: 1.5 },
                    whiteSpace: "nowrap",
                  }}
                >
                  Meus pedidos
                </Button>
                <Button color="inherit" onClick={onLogout}>
                  Sair
                </Button>
              </>
            ) : (
              <>
                <Button
                  component={RouterLink}
                  to="/login"
                  color="inherit"
                  sx={{ minWidth: "auto", px: { xs: 1, sm: 1.5 }, whiteSpace: "nowrap" }}
                >
                  Entrar
                </Button>
                <Button
                  component={RouterLink}
                  to="/register"
                  variant="contained"
                  sx={{
                    minWidth: "auto",
                    px: { xs: 1.25, sm: 2 },
                    whiteSpace: "nowrap",
                  }}
                >
                  Criar conta
                </Button>
              </>
            )}
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
