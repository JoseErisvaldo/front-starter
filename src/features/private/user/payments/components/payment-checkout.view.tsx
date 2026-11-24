import {
  useEffect,
  useState,
  type ComponentProps,
  type FormEvent,
} from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  DialogContent,
  DialogTitle,
  Divider,
  Drawer,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { CardPayment, initMercadoPago } from "@mercadopago/sdk-react";
import { createPaymentInputSchema } from "../schema/payment.schema";
import { useCreatePaymentMutation } from "../mutations/use-create-payment-mutation";
import { usePaymentStatusQuery } from "../queries/use-payment-status-query";
import { PaymentStatusFeedback } from "./payment-status-feedback.view";
import { PixPaymentInstructions } from "./pix-payment-instructions.view";
import type { PaymentResponse } from "../types/payment.types";
import type { CartItem } from "../../../../public/cart/stores/cart.store";
import type { User } from "../../../../public/auth/types/auth.types";
import { formatCurrency } from "../../../../../shared/lib/format-currency";
import { getApiErrorMessage } from "../../../../../shared/lib/api-error";
import { logError } from "../../../../../shared/lib/log-error";
import { getPaymentState } from "../utils/payment-status";
import { submitIdempotentPayment } from "../utils/payment-idempotency";

type Props = {
  items: CartItem[];
  user: User;
  result: PaymentResponse["payment"] | null;
  onClose: () => void;
  onViewOrders: () => void;
  onResult: (payment: PaymentResponse["payment"]) => void;
};

const publicKey = import.meta.env.VITE_MP_PUBLIC_KEY;
if (publicKey) initMercadoPago(publicKey, { locale: "pt-BR" });
type CardPaymentSubmit = NonNullable<
  ComponentProps<typeof CardPayment>["onSubmit"]
>;

export function PaymentCheckoutView({
  items,
  user,
  result,
  onClose,
  onViewOrders,
  onResult,
}: Props) {
  const paymentMutation = useCreatePaymentMutation();
  const total = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );
  const itemsKey = items
    .map(({ product, quantity }) => `${product.id}:${quantity}`)
    .join(",");
  const [method, setMethod] = useState<"card" | "pix">("pix");
  const [brickError, setBrickError] = useState("");
  const [pixError, setPixError] = useState("");
  const [documentType, setDocumentType] = useState<"CPF" | "CNPJ">("CPF");
  const [documentNumber, setDocumentNumber] = useState("");
  const paymentStatusQuery = usePaymentStatusQuery(
    result?.id ?? null,
    items.length > 0,
  );
  const currentPayment = result
    ? {
        ...result,
        ...paymentStatusQuery.data?.payment,
        qrCode: paymentStatusQuery.data?.payment.qrCode ?? result.qrCode,
        qrCodeBase64:
          paymentStatusQuery.data?.payment.qrCodeBase64 ?? result.qrCodeBase64,
        ticketUrl:
          paymentStatusQuery.data?.payment.ticketUrl ?? result.ticketUrl,
      }
    : null;
  const isPaymentError = Boolean(brickError || pixError);

  useEffect(() => {
    setMethod("pix");
    setBrickError("");
    setPixError("");
    setDocumentNumber("");
    paymentMutation.reset();
  }, [itemsKey]);

  const submitCard: CardPaymentSubmit = async (formData, additionalData) => {
    if (items.length === 0) throw new Error("O carrinho está vazio");
    if (!additionalData?.paymentTypeId) {
      throw new Error("Não foi possível identificar o tipo do cartão");
    }

    setBrickError("");
    const input = createPaymentInputSchema.parse({
      method: "card",
      items: items.map(({ product, quantity }) => ({
        productId: product.id,
        quantity,
      })),
      token: formData.token,
      paymentMethodId: formData.payment_method_id,
      paymentTypeId: additionalData.paymentTypeId,
      installments: formData.installments,
      ...(formData.payer.identification
        ? { identification: formData.payer.identification }
        : {}),
    });

    try {
      const response = await submitIdempotentPayment(
        user.id,
        input,
        (idempotencyKey) => paymentMutation.mutateAsync({ input, idempotencyKey }),
      );
      onResult(response.payment);
    } catch (error) {
      setBrickError(getApiErrorMessage(error));
      throw error;
    }
  };

  async function submitPix(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (items.length === 0) return;

    setPixError("");
    const input = createPaymentInputSchema.safeParse({
      method: "pix",
      items: items.map(({ product, quantity }) => ({
        productId: product.id,
        quantity,
      })),
      identification: {
        type: documentType,
        number: documentNumber,
      },
    });
    if (!input.success) {
      setPixError(
        input.error.issues[0]?.message ?? "Confira os dados informados.",
      );
      return;
    }

    try {
      const response = await submitIdempotentPayment(
        user.id,
        input.data,
        (idempotencyKey) => paymentMutation.mutateAsync({
          input: input.data,
          idempotencyKey,
        }),
      );
      onResult(response.payment);
    } catch (error) {
      setPixError(getApiErrorMessage(error));
    }
  }

  return (
    <Drawer
      anchor="right"
      open={items.length > 0}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            width: { xs: "100%", sm: 560 },
            maxWidth: "100vw",
            display: "flex",
            flexDirection: "column",
          },
        },
      }}
    >
      {items.length > 0 && (
        <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
          {!paymentMutation.isPending && !isPaymentError && (
          <DialogTitle
            sx={{
              pr: 7,
              borderBottom: 1,
              borderColor: "divider",
              display: "flex",
              alignItems: "center",
              gap: 1.5,
            }}
          >
            <Typography component="span" variant="h6">
              Finalizar compra
            </Typography>
            <Chip
              size="small"
              variant="outlined"
              label="Mercado Pago"
              sx={{ color: "text.secondary" }}
            />
            <IconButton
              aria-label="Fechar checkout"
              onClick={onClose}
              sx={{ position: "absolute", right: 12, top: 12 }}
            >
              <span aria-hidden="true">×</span>
            </IconButton>
          </DialogTitle>
          )}
          <DialogContent
            dividers={!paymentMutation.isPending}
            sx={{
              flex: 1,
              minHeight: 0,
              p: paymentMutation.isPending || isPaymentError
                ? 0
                : { xs: 2, sm: 3 },
              display: "flex",
              flexDirection: "column",
            }}
          >
            {paymentMutation.isPending ? (
              <Box
                role="status"
                aria-live="polite"
                sx={{
                  flex: 1,
                  width: "100%",
                  minHeight: 0,
                  display: "grid",
                  placeItems: "center",
                }}
              >
                <Stack spacing={2} sx={{ alignItems: "center" }}>
                  <CircularProgress size={48} />
                  <Typography color="text.secondary">
                    Processando pagamento…
                  </Typography>
                </Stack>
              </Box>
            ) : isPaymentError ? (
              <Box
                sx={{
                  flex: 1,
                  width: "100%",
                  minHeight: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  p: { xs: 2, sm: 3 },
                }}
              >
                <PaymentStatusFeedback
                  status="failed"
                  statusDetail={null}
                  pendingMessage=""
                  message={brickError || pixError}
                  actions={
                    <Button
                      variant="contained"
                      onClick={() => {
                        setBrickError("");
                        setPixError("");
                      }}
                    >
                      Tentar novamente
                    </Button>
                  }
                />
              </Box>
            ) : (
            <Stack spacing={3}>
              {!currentPayment && <Paper
                variant="outlined"
                sx={{
                  p: { xs: 1.5, sm: 2 },
                  bgcolor: "rgba(40, 98, 77, 0.025)",
                }}
              >
                <Stack spacing={1.5}>
                  <Stack
                    direction="row"
                    sx={{
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
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
                      label={`${items.reduce((sum, item) => sum + item.quantity, 0)} ${items.reduce((sum, item) => sum + item.quantity, 0) === 1 ? "item" : "itens"}`}
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
                      <Box
                        key={product.id}
                        sx={{ display: "contents" }}
                      >
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
              </Paper>}

              {!currentPayment && !paymentMutation.isPending && (
                <FormControl fullWidth>
                  <Typography variant="subtitle1" sx={{ mb: 1 }}>
                    Forma de pagamento
                  </Typography>
                  <RadioGroup
                    value={method}
                    onChange={(event) => {
                      const value = event.target.value;
                      if (value !== "pix" && value !== "card") return;
                      setMethod(value);
                      setBrickError("");
                      setPixError("");
                    }}
                    aria-label="Forma de pagamento"
                    sx={{
                      display: "grid",
                      gridTemplateColumns: {
                        xs: "1fr",
                        sm: "repeat(2, minmax(0, 1fr))",
                      },
                      gap: 1,
                    }}
                  >
                    {[
                      {
                        value: "pix",
                        title: "Pix",
                        description: "QR Code ou Pix copia e cola",
                      },
                      {
                        value: "card",
                        title: "Cartão",
                        description: "Crédito ou débito",
                      },
                    ].map((option) => (
                      <FormControlLabel
                        key={option.value}
                        value={option.value}
                        control={
                          <Radio
                            icon={
                              <Box
                                aria-hidden="true"
                                sx={{
                                  width: 20,
                                  height: 20,
                                  border: 1,
                                  borderColor: "divider",
                                  borderRadius: 0.75,
                                }}
                              />
                            }
                            checkedIcon={
                              <Box
                                aria-hidden="true"
                                sx={{
                                  width: 20,
                                  height: 20,
                                  display: "grid",
                                  placeItems: "center",
                                  bgcolor: "primary.main",
                                  color: "primary.contrastText",
                                  borderRadius: 0.75,
                                  fontSize: 14,
                                  lineHeight: 1,
                                }}
                              >
                                ✓
                              </Box>
                            }
                          />
                        }
                        label={
                          <Box>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 600 }}
                            >
                              {option.title}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {option.description}
                            </Typography>
                          </Box>
                        }
                        sx={{
                          m: 0,
                          p: 1,
                          border: 1,
                          borderColor:
                            method === option.value
                              ? "primary.main"
                              : "divider",
                          borderRadius: 1,
                          bgcolor:
                            method === option.value
                              ? "rgba(40, 98, 77, 0.05)"
                              : "background.paper",
                          "& .MuiFormControlLabel-label": { flex: 1 },
                        }}
                      />
                    ))}
                  </RadioGroup>
                </FormControl>
              )}

              {method === "card" &&
                !publicKey &&
                !currentPayment &&
                !paymentMutation.isPending && (
                  <Alert severity="warning">
                    Configure VITE_MP_PUBLIC_KEY no frontend para habilitar o
                    formulário do Mercado Pago.
                  </Alert>
                )}
              {currentPayment && (
                <PaymentStatusFeedback
                  status={currentPayment.status}
                  statusDetail={currentPayment.statusDetail}
                  expiresAt={currentPayment.expiresAt}
                  pendingMessage={
                    currentPayment.paymentMethod === "pix"
                      ? "Pix gerado. Aguardando a confirmação do pagamento."
                      : "Pedido enviado ao Mercado Pago."
                  }
                  actions={
                    <Stack direction="row" spacing={1}>
                      <Button
                        variant="contained"
                        onClick={() => {
                          if (
                            getPaymentState(
                              currentPayment.status,
                              currentPayment.statusDetail,
                              currentPayment.expiresAt,
                            ) === "success"
                          ) {
                            onViewOrders();
                          } else {
                            onClose();
                          }
                        }}
                      >
                        {getPaymentState(
                          currentPayment.status,
                          currentPayment.statusDetail,
                          currentPayment.expiresAt,
                        ) === "success"
                          ? "Ver meus pedidos"
                          : "Fechar"}
                      </Button>
                    </Stack>
                  }
                >
                  {currentPayment.paymentMethod === "pix" && (
                    <PixPaymentInstructions
                      qrCode={currentPayment.qrCode}
                      qrCodeBase64={currentPayment.qrCodeBase64}
                      ticketUrl={currentPayment.ticketUrl}
                      expiresAt={currentPayment.expiresAt}
                    />
                  )}
                  {paymentStatusQuery.isFetching && (
                    <Typography variant="caption" color="text.secondary">
                      Atualizando status do pagamento…
                    </Typography>
                  )}
                  {paymentStatusQuery.error && (
                    <Alert severity="warning">
                      Não foi possível atualizar o status:{" "}
                      {getApiErrorMessage(paymentStatusQuery.error)}
                    </Alert>
                  )}
                </PaymentStatusFeedback>
              )}

              {!currentPayment &&
                method === "card" &&
                publicKey && (
                  <Paper
                    variant="outlined"
                    sx={{
                      p: { xs: 1.5, sm: 2 },
                      minWidth: 0,
                      borderColor: "divider",
                      borderRadius: 1.5,
                    }}
                  >
                    <CardPayment
                      initialization={{
                        amount: total,
                        payer: { email: user.email },
                      }}
                      onSubmit={submitCard}
                      onError={(error) => {
                        logError("mercadoPagoCardBrick", error);
                      }}
                      locale="pt-BR"
                    />
                  </Paper>
                )}

              {!currentPayment && method === "pix" && (
                  <Stack spacing={1.5}>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        Pagar com Pix
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        O código Pix será enviado para {user.email}.
                      </Typography>
                    </Box>
                    <Box
                      component="form"
                      onSubmit={(event) => void submitPix(event)}
                    >
                      <Stack spacing={2}>
                        <FormControl fullWidth required>
                        <InputLabel id="pix-document-type-label">
                          Documento
                        </InputLabel>
                        <Select
                          labelId="pix-document-type-label"
                          value={documentType}
                          label="Documento"
                          onChange={(event) => {
                            setDocumentType(
                              event.target.value as "CPF" | "CNPJ",
                            );
                            setDocumentNumber("");
                          }}
                        >
                          <MenuItem value="CPF">CPF</MenuItem>
                          <MenuItem value="CNPJ">CNPJ</MenuItem>
                        </Select>
                        </FormControl>
                        <TextField
                        label={documentType}
                        value={documentNumber}
                        onChange={(event) =>
                          setDocumentNumber(
                            event.target.value.replace(/\D/g, "").slice(0, 14),
                          )
                        }
                        slotProps={{
                          htmlInput: { inputMode: "numeric", maxLength: 14 },
                        }}
                        required
                        fullWidth
                        />
                        <Button
                        type="submit"
                        variant="contained"
                        disabled={paymentMutation.isPending}
                        >
                          Gerar Pix
                        </Button>
                      </Stack>
                    </Box>
                  </Stack>
                )}
            </Stack>
            )}
          </DialogContent>
        </Box>
      )}
    </Drawer>
  );
}
