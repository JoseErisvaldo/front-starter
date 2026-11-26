import { useMemo } from "react";
import {
  Box,
  Button,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlineOutlined";
import RemoveIcon from "@mui/icons-material/Remove";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import { formatCurrency } from "../../../../shared/lib/format-currency";
import { CheckoutProgressStepper } from "../../../../shared/cross-features/payments";
import { DrawerHeader } from "../../../../shared/components/drawer-header";
import { useCartStore, type CartItem } from "../stores/cart.store";
import { toast } from "react-toastify";

type Props = {
  onClose: () => void;
  onCheckout: (items: CartItem[]) => void;
};

export function CartDrawer({ onClose, onCheckout }: Props) {
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

  function handleRemove(productId: string) {
    removeItem(productId);
    toast.success("Produto removido do carrinho.");
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%", bgcolor: "#f8faf8" }}>
      <DrawerHeader
        title="Seu carrinho"
        subtitle="Revise seus produtos antes de continuar"
        itemCount={itemCount}
        onClose={onClose}
        closeLabel="Fechar carrinho"
      />

      <Box sx={{ flex: 1, overflowY: "auto", p: { xs: 2, sm: 3 } }}>
        {items.length > 0 && <CheckoutProgressStepper activeStep={0} />}
        {items.length === 0 ? (
          <Stack
            sx={{
              minHeight: 360,
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              px: 3,
            }}
            spacing={1.5}
          >
            <Box
              sx={{
                width: 76,
                height: 76,
                display: "grid",
                placeItems: "center",
                borderRadius: "50%",
                bgcolor: "action.hover",
                color: "text.secondary",
              }}
            >
              <ShoppingBagOutlinedIcon sx={{ fontSize: 36 }} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Seu carrinho está vazio
            </Typography>
            <Typography color="text.secondary">
              Explore os produtos e adicione algo para continuar.
            </Typography>
            <Button onClick={onClose} sx={{ mt: 1 }}>
              Continuar comprando
            </Button>
          </Stack>
        ) : (
          <Stack divider={<Divider flexItem />} spacing={0}>
            {items.map(({ product, quantity }) => (
              <Stack
                key={product.id}
                direction="row"
                sx={{
                  alignItems: "center",
                  gap: { xs: 0.5, sm: 1.5 },
                  py: 1.5,
                }}
              >
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 600, overflowWrap: "anywhere" }}
                  >
                    {product.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {formatCurrency(product.price, product.currency)} cada
                  </Typography>
                </Box>
                <Stack
                  direction="row"
                  sx={{
                    alignItems: "center",
                    flexShrink: 0,
                    border: 1,
                    borderColor: "divider",
                    borderRadius: 1,
                  }}
                >
                  <IconButton
                    size="small"
                    aria-label={`Diminuir quantidade de ${product.name}`}
                    onClick={() => {
                      if (quantity === 1) {
                        handleRemove(product.id);
                        return;
                      }
                      setQuantity(product.id, quantity - 1);
                    }}
                  >
                    <RemoveIcon fontSize="small" />
                  </IconButton>
                  <Typography
                    aria-live="polite"
                    sx={{ minWidth: 24, textAlign: "center", fontSize: 14 }}
                  >
                    {quantity}
                  </Typography>
                  <IconButton
                    size="small"
                    aria-label={`Aumentar quantidade de ${product.name}`}
                    disabled={quantity >= 99}
                    onClick={() => {
                      setQuantity(product.id, quantity + 1);
                    }}
                  >
                    <AddIcon fontSize="small" />
                  </IconButton>
                </Stack>
                <Typography
                  variant="body2"
                  sx={{ minWidth: { xs: 68, sm: 84 }, textAlign: "right", fontWeight: 600 }}
                >
                  {formatCurrency(product.price * quantity, product.currency)}
                </Typography>
                <IconButton
                  size="small"
                  aria-label={`Remover ${product.name} do carrinho`}
                  onClick={() => handleRemove(product.id)}
                  sx={{ color: "text.secondary" }}
                >
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              </Stack>
            ))}
          </Stack>
        )}
      </Box>

      {items.length > 0 && (
        <Stack
          spacing={1.5}
          sx={{
            p: { xs: 2, sm: 3 },
            bgcolor: "background.paper",
            borderTop: 1,
            borderColor: "divider",
          }}
        >
          <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "baseline" }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              Total
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 750 }}>
              {formatCurrency(total, "BRL")}
            </Typography>
          </Stack>
          <Button
            variant="contained"
            size="large"
            fullWidth
            onClick={() => onCheckout(items)}
            sx={{ minHeight: 52, borderRadius: 2, fontWeight: 700 }}
          >
            Revisar pedido
          </Button>
        </Stack>
      )}
    </Box>
  );
}
