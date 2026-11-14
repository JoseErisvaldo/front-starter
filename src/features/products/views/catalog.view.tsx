import { useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Container,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import type { User } from "../../auth/types/auth.types";
import type { Product } from "../types/product.types";
import { formatCurrency } from "../../../shared/lib/format-currency";
import { StoreHeader } from "../../../shared/components/store-header";

type Props = {
  user: User | null;
  isAuthLoading: boolean;
  products: Product[];
  isLoading: boolean;
  error: string;
  onLogout: () => void;
  onBuy: (product: Product) => void;
};

export function CatalogView({
  user,
  isAuthLoading,
  products,
  isLoading,
  error,
  onLogout,
  onBuy,
}: Props) {
  const [search, setSearch] = useState("");
  const filteredProducts = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("pt-BR");
    if (!query) return products;
    return products.filter((product) =>
      `${product.name} ${product.description}`
        .toLocaleLowerCase("pt-BR")
        .includes(query),
    );
  }, [products, search]);

  return (
    <Box component="main" sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <StoreHeader user={user} activePage="products" onLogout={onLogout} />
      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
        <Stack spacing={3}>
          <Box>
            <Typography variant="h4" component="h1">
              Produtos
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 1 }}>
              Confira os produtos disponíveis.
            </Typography>
          </Box>
          <TextField
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar produtos"
            aria-label="Buscar produtos"
            fullWidth
            sx={{ maxWidth: 720, bgcolor: "background.paper" }}
          />
          {error && <Alert severity="error">{error}</Alert>}
          {isLoading || (isAuthLoading && !user) ? (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, minmax(0, 1fr))",
                  md: "repeat(3, minmax(0, 1fr))",
                },
                gap: 2,
              }}
            >
              {Array.from({ length: 6 }, (_, index) => (
                <Skeleton key={index} variant="rounded" height={260} />
              ))}
            </Box>
          ) : !error && filteredProducts.length === 0 ? (
            <Alert severity="info">
              {search
                ? "Nenhum produto encontrado para essa busca."
                : "Nenhum produto disponível no momento."}
            </Alert>
          ) : (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, minmax(0, 1fr))",
                  md: "repeat(3, minmax(0, 1fr))",
                },
                gap: 2,
              }}
            >
              {filteredProducts.map((product) => (
                <Card
                  key={product.id}
                  variant="outlined"
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    minHeight: 240,
                    bgcolor: "background.paper",
                    "&:hover": {
                      borderColor: "primary.main",
                    },
                  }}
                >
                  <CardContent sx={{ flex: 1, p: 2.5 }}>
                    <Typography variant="h6" component="h2">
                      {product.name}
                    </Typography>
                    <Typography
                      color="text.secondary"
                      sx={{
                        mt: 1,
                        minHeight: 48,
                        overflow: "hidden",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      {product.description}
                    </Typography>
                    <Typography variant="h5" sx={{ mt: 3, fontWeight: 650 }}>
                      {formatCurrency(product.price, product.currency)}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ px: 2.5, pb: 2.5 }}>
                    <Button
                      variant="contained"
                      fullWidth
                      disabled={isAuthLoading && !user}
                      onClick={() => onBuy(product)}
                    >
                      Comprar
                    </Button>
                  </CardActions>
                </Card>
              ))}
            </Box>
          )}
        </Stack>
      </Container>
    </Box>
  );
}
