import { useEffect, useState, type ComponentProps, type FormEvent } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { CardPayment, initMercadoPago } from "@mercadopago/sdk-react";
import { createPaymentInputSchema } from "../schema/payment.schema";
import { useCreatePaymentMutation } from "../mutations/use-create-payment-mutation";
import { usePaymentStatusQuery } from "../queries/use-payment-status-query";
import { PaymentStatusFeedback } from "./payment-status-feedback.view";
import type { PaymentResponse } from "../types/payment.types";
import type { Product } from "../../products/types/product.types";
import type { User } from "../../auth/types/auth.types";
import { formatCurrency } from "../../../shared/lib/format-currency";
import { getApiErrorMessage } from "../../../shared/lib/api-error";
import { logError } from "../../../shared/lib/log-error";

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
  const [method, setMethod] = useState<"card" | "pix">("card");
  const [brickError, setBrickError] = useState("");
  const [pixError, setPixError] = useState("");
  const [documentType, setDocumentType] = useState<"CPF" | "CNPJ">("CPF");
  const [documentNumber, setDocumentNumber] = useState("");
  const [copied, setCopied] = useState(false);
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
        ticketUrl: paymentStatusQuery.data?.payment.ticketUrl ?? result.ticketUrl,
      }
    : null;

  useEffect(() => {
    setMethod("card");
    setBrickError("");
    setPixError("");
    setDocumentNumber("");
    setCopied(false);
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
      setPixError(input.error.issues[0]?.message ?? "Confira os dados informados.");
      return;
    }

    try {
      const response = await paymentMutation.mutateAsync(input.data);
      onResult(response.payment);
    } catch (error) {
      setPixError(getApiErrorMessage(error));
    }
  }

  async function copyPixCode() {
    if (!currentPayment?.qrCode) return;
    try {
      await navigator.clipboard.writeText(currentPayment.qrCode);
      setCopied(true);
      setPixError("");
    } catch (error) {
      logError("copyPixCode", error);
      setPixError("Não foi possível copiar o código. Selecione e copie manualmente.");
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

              {!currentPayment && (
                <Tabs
                  value={method}
                  onChange={(_, value: "card" | "pix") => {
                    setMethod(value);
                    setBrickError("");
                    setPixError("");
                  }}
                  aria-label="Forma de pagamento"
                >
                  <Tab value="card" label="Cartão" />
                  <Tab value="pix" label="Pix" />
                </Tabs>
              )}

              {method === "card" && !publicKey && !currentPayment && (
                <Alert severity="warning">
                  Configure VITE_MP_PUBLIC_KEY no frontend para habilitar o
                  formulário do Mercado Pago.
                </Alert>
              )}
              {brickError && <Alert severity="error">{brickError}</Alert>}
              {pixError && <Alert severity="error">{pixError}</Alert>}
              {paymentMutation.isPending && <CircularProgress size={24} />}

              {currentPayment && (
                <PaymentStatusFeedback
                  status={currentPayment.status}
                  statusDetail={currentPayment.statusDetail}
                  pendingMessage={
                    currentPayment.paymentMethod === "pix"
                      ? "Pix gerado. Aguardando a confirmação do pagamento."
                      : "Pedido enviado ao Mercado Pago."
                  }
                >
                  {currentPayment.paymentMethod === "pix" && (
                    <>
                      {currentPayment.qrCodeBase64 && (
                        <Box
                          component="img"
                          src={`data:image/png;base64,${currentPayment.qrCodeBase64}`}
                          alt="QR code para pagamento Pix"
                          sx={{
                            width: 220,
                            height: 220,
                            alignSelf: "center",
                            objectFit: "contain",
                          }}
                        />
                      )}
                      {currentPayment.qrCode && (
                        <Stack spacing={1} sx={{ width: "100%" }}>
                          <Typography variant="subtitle2">
                            Pix copia e cola
                          </Typography>
                          <TextField
                            value={currentPayment.qrCode}
                            multiline
                            minRows={3}
                            fullWidth
                            slotProps={{ input: { readOnly: true } }}
                          />
                          <Button variant="outlined" onClick={copyPixCode}>
                            {copied ? "Código copiado" : "Copiar código Pix"}
                          </Button>
                        </Stack>
                      )}
                      {currentPayment.ticketUrl && (
                        <Button
                          component="a"
                          href={currentPayment.ticketUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Abrir instruções de pagamento
                        </Button>
                      )}
                      {!currentPayment.qrCode &&
                        !currentPayment.qrCodeBase64 &&
                        !currentPayment.ticketUrl && (
                          <Alert severity="warning">
                            O pedido foi criado, mas o Mercado Pago não retornou
                            os dados do Pix. Consulte o status novamente em
                            instantes ou contate o suporte.
                          </Alert>
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
                    </>
                  )}
                </PaymentStatusFeedback>
              )}

              {!currentPayment && method === "card" && publicKey && (
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

              {!currentPayment && method === "pix" && (
                <Box component="form" onSubmit={(event) => void submitPix(event)}>
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
                          setDocumentType(event.target.value as "CPF" | "CNPJ");
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
