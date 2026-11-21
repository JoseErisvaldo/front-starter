import { useMemo } from "react";
import {
  Alert,
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { formatCurrency } from "../../../../shared/lib/format-currency";
import { useCartStore, type CartItem } from "../stores/cart.store";
import { toast } from "react-toastify";

type Props = {
  open: boolean;
  onClose: () => void;
  onCheckout: (items: CartItem[]) => void;
};

export function CartDrawer({ open, onClose, onCheckout }: Props) {
  const items = useCartStore((state) => state.items);
  const setQuantity = useCartStore((state) => state.setQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const total = useMemo(
    () =>
      items.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0,
      ),
    [items],
  );
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            width: { xs: "100%", sm: 440 },
            maxWidth: "100vw",
            display: "flex",
            flexDirection: "column",
          },
        },
      }}
    >
      <Stack
        direction="row"
        sx={{
          alignItems: "center",
          justifyContent: "space-between",
          p: 2,
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Box>
          <Typography variant="h6">Carrinho</Typography>
          <Typography variant="body2" color="text.secondary">
            {itemCount} {itemCount === 1 ? "item" : "itens"}
          </Typography>
        </Box>
        <IconButton aria-label="Fechar carrinho" onClick={onClose}>
          <span aria-hidden="true">×</span>
        </IconButton>
      </Stack>
      <Box sx={{ flex: 1, overflowY: "auto", p: 2 }}>
        {items.length === 0 ? (
          <Alert severity="info">Seu carrinho está vazio.</Alert>
        ) : (
          <Stack spacing={1.5}>
            {items.map(({ product, quantity }) => (
              <Paper key={product.id} variant="outlined" sx={{ p: 1.5 }}>
                <Stack spacing={1.25}>
                  <Stack
                    direction="row"
                    sx={{ justifyContent: "space-between", gap: 1 }}
                  >
                    <Box sx={{ minWidth: 0 }}>
                      <Typography sx={{ fontWeight: 600, overflowWrap: "anywhere" }}>
                        {product.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {formatCurrency(product.price, product.currency)} cada
                      </Typography>
                    </Box>
                    <IconButton
                      size="small"
                      aria-label={`Remover ${product.name} do carrinho`}
                      onClick={() => {
                        removeItem(product.id);
                        toast.info("Produto removido do carrinho.");
                      }}
                    >
                      <span aria-hidden="true">×</span>
                    </IconButton>
                  </Stack>
                  <Stack
                    direction="row"
                    sx={{ alignItems: "center", justifyContent: "space-between" }}
                  >
                    <Stack direction="row" sx={{ alignItems: "center" }}>
                      <IconButton
                        size="small"
                        aria-label={`Diminuir quantidade de ${product.name}`}
                        onClick={() => {
                          if (quantity === 1) {
                            removeItem(product.id);
                            toast.info("Produto removido do carrinho.");
                            return;
                          }
                          setQuantity(product.id, quantity - 1);
                          toast.info(`Quantidade reduzida para ${quantity - 1}.`);
                        }}
                      >
                        −
                      </IconButton>
                      <Typography sx={{ minWidth: 32, textAlign: "center" }}>
                        {quantity}
                      </Typography>
                      <IconButton
                        size="small"
                        aria-label={`Aumentar quantidade de ${product.name}`}
                        disabled={quantity >= 99}
                        onClick={() => {
                          setQuantity(product.id, quantity + 1);
                          toast.success(`Quantidade aumentada para ${quantity + 1}.`);
                        }}
                      >
                        +
                      </IconButton>
                    </Stack>
                    <Typography sx={{ fontWeight: 600 }}>
                      {formatCurrency(
                        product.price * quantity,
                        product.currency,
                      )}
                    </Typography>
                  </Stack>
                </Stack>
              </Paper>
            ))}
          </Stack>
        )}
      </Box>
      <Stack spacing={1.5} sx={{ p: 2, borderTop: 1, borderColor: "divider" }}>
        <Stack direction="row" sx={{ justifyContent: "space-between" }}>
          <Typography>Total</Typography>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {formatCurrency(total, "BRL")}
          </Typography>
        </Stack>
        <Divider />
        <Button
          variant="contained"
          size="large"
          disabled={items.length === 0}
          onClick={() => onCheckout(items)}
        >
          Continuar para pagamento
        </Button>
      </Stack>
    </Drawer>
  );
}
