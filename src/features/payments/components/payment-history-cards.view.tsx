import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { formatCurrency } from "../../../shared/lib/format-currency";
import { getPaymentState, isPaymentExpired } from "../utils/payment-status";
import type { PaymentListResponse } from "../types/payment.types";

type Props = {
  payments: PaymentListResponse["payments"];
  page: number;
  pageSize: number;
  total: number;
  isLoading: boolean;
  isFetching: boolean;
  error: string;
  onRefresh: () => void;
  onViewPayment: (paymentId: string) => void;
  onPageChange: (event: unknown, page: number) => void;
};

const paymentMethodLabels: Record<string, string> = {
  pix: "Pix",
  card: "Cartão",
  credit_card: "Cartão de crédito",
  debit_card: "Cartão de débito",
  prepaid_card: "Cartão pré-pago",
};

function getStatusLabel(
  status: string,
  statusDetail: string | null,
  expiresAt: string | null,
) {
  const state = getPaymentState(status, statusDetail, expiresAt);
  if (state === "success") return "Pago";
  if (isPaymentExpired(expiresAt)) return "Pix expirado";
  if (state === "error") return "Falhou";
  if (status === "action_required") return "Aguardando pagamento";
  return "Em processamento";
}

function getStatusColor(
  status: string,
  statusDetail: string | null,
  expiresAt: string | null,
): "success" | "warning" | "error" {
  const state = getPaymentState(status, statusDetail, expiresAt);
  if (state === "success") return "success";
  if (state === "error") return "error";
  return "warning";
}

export function PaymentHistoryCardsView({
  payments,
  page,
  pageSize,
  total,
  isLoading,
  isFetching,
  error,
  onRefresh,
  onViewPayment,
  onPageChange,
}: Props) {
  const [actionMenu, setActionMenu] = useState<{
    anchor: HTMLElement;
    paymentId: string;
  } | null>(null);
  function closeActionMenu() {
    setActionMenu(null);
  }

  return (
    <Stack spacing={2}>
      <Stack
        direction="row"
        sx={{ alignItems: "center", justifyContent: "space-between", gap: 2 }}
      >
        <Button onClick={onRefresh} disabled={isFetching}>
          {isFetching ? "Atualizando…" : "Atualizar"}
        </Button>
      </Stack>

      {error && <Alert severity="error">{error}</Alert>}

      {isLoading ? (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "minmax(0, 1fr)",
              sm: "repeat(2, minmax(0, 1fr))",
              md: "repeat(3, minmax(0, 1fr))",
            },
            gap: 2,
          }}
        >
          {Array.from({ length: 6 }, (_, index) => (
            <Skeleton key={index} variant="rounded" height={220} />
          ))}
        </Box>
      ) : error ? (
        <Paper variant="outlined" sx={{ p: 3, textAlign: "center" }}>
          <Typography color="text.secondary">
            Não foi possível carregar os pedidos.
          </Typography>
        </Paper>
      ) : payments.length === 0 ? (
        <Paper variant="outlined" sx={{ p: 3, textAlign: "center" }}>
          <Typography color="text.secondary">
            Você ainda não tem pedidos.
          </Typography>
        </Paper>
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "minmax(0, 1fr)",
              sm: "repeat(2, minmax(0, 1fr))",
              md: "repeat(3, minmax(0, 1fr))",
            },
            gap: 2,
          }}
        >
          {payments.map((payment) => (
            <Card key={payment.id} variant="outlined" sx={{ minWidth: 0 }}>
              <CardContent>
                <Stack spacing={1.5}>
                  <Stack
                    direction="row"
                    sx={{
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      gap: 1,
                    }}
                  >
                    <Typography variant="h6" component="h2" sx={{ overflowWrap: "anywhere" }}>
                      {payment.items.length > 1
                        ? `${payment.items.length} produtos`
                        : payment.productName}
                    </Typography>
                    <IconButton
                      size="small"
                      aria-label="Ações do pedido"
                      aria-haspopup="menu"
                      onClick={(event) =>
                        setActionMenu({
                          anchor: event.currentTarget,
                          paymentId: payment.id,
                        })
                      }
                    >
                      <span aria-hidden="true">⋮</span>
                    </IconButton>
                  </Stack>
                  <Stack spacing={0.5}>
                    {payment.items.map((item, index) => (
                      <Typography
                        key={`${payment.id}-${index}`}
                        variant="body2"
                        color="text.secondary"
                        sx={{ overflowWrap: "anywhere" }}
                      >
                        {item.productName} × {item.quantity}
                      </Typography>
                    ))}
                  </Stack>
                  <Chip
                    size="small"
                    color={getStatusColor(
                      payment.status,
                      payment.statusDetail,
                      payment.expiresAt,
                    )}
                    label={getStatusLabel(
                      payment.status,
                      payment.statusDetail,
                      payment.expiresAt,
                    )}
                    sx={{ alignSelf: "flex-start" }}
                  />
                  <Divider />
                  <Stack
                    direction="row"
                    sx={{ justifyContent: "space-between", gap: 2 }}
                  >
                    <Typography color="text.secondary">Valor</Typography>
                    <Typography sx={{ fontWeight: 600 }}>
                      {formatCurrency(payment.amount, payment.currency)}
                    </Typography>
                  </Stack>
                  <Stack
                    direction="row"
                    sx={{ justifyContent: "space-between", gap: 2 }}
                  >
                    <Typography color="text.secondary">Pagamento</Typography>
                    <Typography sx={{ textAlign: "right" }}>
                      {paymentMethodLabels[payment.paymentMethod] ?? "Outro"}
                    </Typography>
                  </Stack>
                  <Stack
                    direction="row"
                    sx={{ justifyContent: "space-between", gap: 2 }}
                  >
                    <Typography color="text.secondary">Data</Typography>
                    <Typography variant="body2" sx={{ textAlign: "right" }}>
                      {new Intl.DateTimeFormat("pt-BR", {
                        dateStyle: "short",
                        timeStyle: "short",
                      }).format(new Date(payment.createdAt))}
                    </Typography>
                  </Stack>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    title={payment.providerOrderId ?? payment.id}
                    sx={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Pedido: {payment.providerOrderId ?? payment.id}
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
      <Menu
        anchorEl={actionMenu?.anchor}
        open={Boolean(actionMenu)}
        onClose={closeActionMenu}
      >
        <MenuItem
          onClick={() => {
            if (actionMenu) onViewPayment(actionMenu.paymentId);
            closeActionMenu();
          }}
        >
          Detalhes do pedido
        </MenuItem>
      </Menu>
      <Paper variant="outlined" sx={{ px: 2, py: 1 }}>
        <Stack
          direction="row"
          sx={{ alignItems: "center", justifyContent: "space-between" }}
        >
          <Typography color="text.secondary">
            Total: {total} {total === 1 ? "pedido" : "pedidos"}
          </Typography>
          <Stack direction="row">
            <IconButton
              size="large"
              aria-label="Página anterior"
              disabled={page <= 0}
              onClick={() => onPageChange(null, page - 1)}
            >
              <span aria-hidden="true" style={{ fontSize: 24 }}>
                ←
              </span>
            </IconButton>
            <IconButton
              size="large"
              aria-label="Próxima página"
              disabled={page >= Math.ceil(total / pageSize) - 1}
              onClick={() => onPageChange(null, page + 1)}
            >
              <span aria-hidden="true" style={{ fontSize: 24 }}>
                →
              </span>
            </IconButton>
          </Stack>
        </Stack>
      </Paper>
    </Stack>
  );
}
