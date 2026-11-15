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
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  MenuItem,
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
import type { Product } from "../../products/types/product.types";
import type { User } from "../../auth/types/auth.types";
import { formatCurrency } from "../../../shared/lib/format-currency";
import { getApiErrorMessage } from "../../../shared/lib/api-error";
import { logError } from "../../../shared/lib/log-error";
import { getPaymentState } from "../utils/payment-status";

type Props = {
  product: Product | null;
  user: User;
  result: PaymentResponse["payment"] | null;
  onClose: () => void;
  onResult: (payment: PaymentResponse["payment"]) => void;
};

const publicKey = import.meta.env.VITE_MP_PUBLIC_KEY;
if (publicKey) initMercadoPago(publicKey, { locale: "pt-BR" });
type CardPaymentSubmit = NonNullable<
  ComponentProps<typeof CardPayment>["onSubmit"]
>;

export function PaymentCheckoutView({
  product,
  user,
  result,
  onClose,
  onResult,
}: Props) {
  const paymentMutation = useCreatePaymentMutation();
  const [method, setMethod] = useState<"card" | "pix">("pix");
  const [brickError, setBrickError] = useState("");
  const [pixError, setPixError] = useState("");
  const [documentType, setDocumentType] = useState<"CPF" | "CNPJ">("CPF");
  const [documentNumber, setDocumentNumber] = useState("");
  const paymentStatusQuery = usePaymentStatusQuery(
    result?.id ?? null,
    Boolean(product),
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

  useEffect(() => {
    setMethod("pix");
    setBrickError("");
    setPixError("");
    setDocumentNumber("");
    paymentMutation.reset();
  }, [product?.id]);

  const submitCard: CardPaymentSubmit = async (formData, additionalData) => {
    if (!product) throw new Error("Nenhum produto selecionado");
    if (!additionalData?.paymentTypeId) {
      throw new Error("Não foi possível identificar o tipo do cartão");
    }

    setBrickError("");
    const input = createPaymentInputSchema.parse({
      method: "card",
      productId: product.id,
      token: formData.token,
      paymentMethodId: formData.payment_method_id,
      paymentTypeId: additionalData.paymentTypeId,
      installments: formData.installments,
      ...(formData.payer.identification
        ? { identification: formData.payer.identification }
        : {}),
    });

    try {
      const response = await paymentMutation.mutateAsync(input);
      onResult(response.payment);
    } catch (error) {
      setBrickError(getApiErrorMessage(error));
      throw error;
    }
  };

  async function submitPix(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!product) return;

    setPixError("");
    const input = createPaymentInputSchema.safeParse({
      method: "pix",
      productId: product.id,
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
      const response = await paymentMutation.mutateAsync(input.data);
      onResult(response.payment);
    } catch (error) {
      setPixError(getApiErrorMessage(error));
    }
  }

  return (
    <Dialog open={Boolean(product)} onClose={onClose} fullWidth maxWidth="sm">
      {product && (
        <>
          <DialogTitle sx={{ pr: 7 }}>
            Finalizar compra
            <IconButton
              aria-label="Fechar checkout"
              onClick={onClose}
              sx={{ position: "absolute", right: 12, top: 12 }}
            >
              <span aria-hidden="true">×</span>
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            <Stack spacing={2.5}>
              <Box>
                <Typography variant="h6">{product.name}</Typography>
                <Typography color="text.secondary">
                  {formatCurrency(product.price, product.currency)}
                </Typography>
              </Box>

              {!currentPayment && !paymentMutation.isPending && (
                <FormControl fullWidth>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
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
              {!paymentMutation.isPending && brickError && (
                <Alert severity="error">{brickError}</Alert>
              )}
              {!paymentMutation.isPending && pixError && (
                <Alert severity="error">{pixError}</Alert>
              )}
              {paymentMutation.isPending && (
                <Box
                  role="status"
                  aria-live="polite"
                  sx={{
                    display: "grid",
                    placeItems: "center",
                    minHeight: 240,
                    width: "100%",
                  }}
                >
                  <Stack spacing={2} sx={{ alignItems: "center" }}>
                    <CircularProgress size={32} />
                    <Typography color="text.secondary">
                      Processando pagamento…
                    </Typography>
                  </Stack>
                </Box>
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
                      <Button variant="contained" onClick={onClose}>
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
                !paymentMutation.isPending &&
                method === "card" &&
                publicKey && (
                  <CardPayment
                    initialization={{
                      amount: product.price,
                      payer: { email: user.email },
                    }}
                    onSubmit={submitCard}
                    onError={(error) => {
                      logError("mercadoPagoCardBrick", error);
                      setBrickError(
                        "O formulário do cartão encontrou um erro. Revise os dados e tente novamente.",
                      );
                    }}
                    locale="pt-BR"
                  />
                )}

              {!currentPayment &&
                !paymentMutation.isPending &&
                method === "pix" && (
                  <Box
                    component="form"
                    onSubmit={(event) => void submitPix(event)}
                  >
                    <Stack spacing={2}>
                      <Typography color="text.secondary">
                        O código Pix será enviado para {user.email}.
                      </Typography>
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
                )}
            </Stack>
          </DialogContent>
        </>
      )}
    </Dialog>
  );
}
