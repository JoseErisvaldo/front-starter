import { Box, Chip, Divider, Paper, Stack, Typography } from "@mui/material";
import type { PaymentCheckoutItem } from "../../types/payment.types";
import { formatCurrency } from "../../../../lib/format-currency";

type Props = {
  items: PaymentCheckoutItem[];
  total: number;
};

export function CheckoutOrderSummary({ items, total }: Props) {
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Paper
      variant="outlined"
      sx={{
        p: { xs: 1.5, sm: 2 },
        bgcolor: "rgba(40, 98, 77, 0.025)",
      }}
    >
      <Stack spacing={1.5}>
        <Stack
          direction="row"
          sx={{ alignItems: "center", justifyContent: "space-between" }}
        >
          <Typography
            variant="overline"
            color="text.secondary"
            sx={{ fontWeight: 700 }}
          >
            Resumo do pedido
          </Typography>
          <Chip
            size="small"
            label={`${itemCount} ${itemCount === 1 ? "item" : "itens"}`}
          />
        </Stack>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr) 32px 76px 76px",
            alignItems: "center",
            gap: 0.75,
          }}
        >
          {["Produto", "Qtd.", "Unit.", "Total"].map((label) => (
            <Typography
              key={label}
              variant="caption"
              color="text.secondary"
              sx={{ textAlign: label === "Produto" ? "left" : "right" }}
            >
              {label}
            </Typography>
          ))}
          {items.map(({ product, quantity }) => (
            <Box key={product.id} sx={{ display: "contents" }}>
              <Typography
                variant="body2"
                sx={{ overflowWrap: "anywhere", py: 1 }}
              >
                {product.name}
              </Typography>
              <Typography variant="body2" sx={{ textAlign: "right" }}>
                {quantity}
              </Typography>
              <Typography variant="body2" sx={{ textAlign: "right" }}>
                {formatCurrency(product.price, product.currency)}
              </Typography>
              <Typography
                variant="body2"
                sx={{ textAlign: "right", fontWeight: 600 }}
              >
                {formatCurrency(product.price * quantity, product.currency)}
              </Typography>
            </Box>
          ))}
        </Box>
        <Divider />
        <Stack
          direction="row"
          sx={{ alignItems: "center", justifyContent: "space-between" }}
        >
          <Typography sx={{ fontWeight: 600 }}>Total</Typography>
          <Typography
            variant="h6"
            sx={{ color: "primary.main", fontWeight: 700 }}
          >
            {formatCurrency(total, "BRL")}
          </Typography>
        </Stack>
      </Stack>
    </Paper>
  );
}
