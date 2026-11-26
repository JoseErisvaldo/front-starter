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
  DialogContent,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { CardPayment, initMercadoPago } from "@mercadopago/sdk-react";
import { createPaymentInputSchema } from "../../schema/payment.schema";
import { useCreatePaymentMutation } from "../../mutations/use-create-payment-mutation";
import { usePaymentStatusQuery } from "../../queries/use-payment-status-query";
import { PaymentStatusFeedback } from "../payment-status/payment-status-feedback";
import { PixPaymentInstructions } from "../payment-status/pix-payment-instructions";
import { CheckoutOrderSummary } from "./checkout-order-summary";
import { CheckoutProgressStepper } from "./checkout-progress-stepper";
import { PaymentMethodSelector } from "./payment-method-selector";
import { PixPaymentForm } from "./pix-payment-form";
import { DrawerHeader } from "../../../../components/drawer-header";
import type { PaymentResponse } from "../../types/payment.types";
import type { PaymentCheckoutItem, PaymentCustomer } from "../../types/payment.types";
import { getApiErrorMessage } from "../../../../lib/api-error";
import { logError } from "../../../../lib/log-error";
import { getPaymentState } from "../../utils/payment-status";
import { submitIdempotentPayment } from "../../utils/payment-idempotency";

type Props = {
  items: PaymentCheckoutItem[];
  user: PaymentCustomer;
  result: PaymentResponse["payment"] | null;
  onBack: () => void;
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
  onBack,
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
  const [checkoutStep, setCheckoutStep] = useState<"review" | "payment">(
    "review",
  );
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
  const currentPaymentState = currentPayment
    ? getPaymentState(
        currentPayment.status,
        currentPayment.statusDetail,
        currentPayment.expiresAt,
      )
    : null;
  const showProgressStepper =
    !currentPayment || currentPaymentState === "pending";
  const showCloseOnlyHeader =
    isPaymentError ||
    currentPaymentState === "success" ||
    currentPaymentState === "error";
  const activeStep =
    currentPaymentState === "pending"
      ? 2
      : checkoutStep === "payment"
        ? 2
        : 1;

  useEffect(() => {
    setMethod("pix");
    setCheckoutStep("review");
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
    <Box sx={{ height: "100%", width: "100%" }}>
      {items.length > 0 && (
        <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
          {!paymentMutation.isPending && (
            <DrawerHeader
              title={
                checkoutStep === "review"
                  ? "Revisar pedido"
                  : "Finalizar compra"
              }
              subtitle={
                currentPayment
                  ? "Acompanhe o status do seu pagamento"
                  : checkoutStep === "review"
                    ? "Confira os itens antes de continuar"
                    : "Escolha uma forma de pagamento segura"
              }
              itemCount={items.reduce((sum, item) => sum + item.quantity, 0)}
              onClose={onClose}
              closeLabel="Fechar checkout"
              closeOnly={showCloseOnlyHeader}
              leadingAction={
                !showCloseOnlyHeader && !currentPayment
                  ? {
                      ariaLabel:
                        checkoutStep === "payment"
                          ? "Voltar para revisar o pedido"
                          : "Voltar ao carrinho",
                      onClick: () => {
                        if (checkoutStep === "payment") {
                          setCheckoutStep("review");
                          return;
                        }
                        onBack();
                      },
                    }
                  : undefined
              }
            />
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
                  display: "flex",
                  flexDirection: "column",
                  p: { xs: 2, sm: 3 },
                }}
              >
                <Box
                  sx={{
                    flex: 1,
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
              {showProgressStepper && (
                <CheckoutProgressStepper activeStep={activeStep} />
              )}

              {!currentPayment && checkoutStep === "review" && (
                <Stack spacing={1.5}>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                      Revisar pedido
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Confira os produtos e as quantidades antes de continuar.
                    </Typography>
                  </Box>
                  <CheckoutOrderSummary items={items} total={total} />
                </Stack>
              )}

              {!currentPayment &&
                checkoutStep === "payment" &&
                !paymentMutation.isPending && (
                <Stack spacing={1.5}>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                      Escolha como deseja pagar
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Selecione uma forma de pagamento para concluir seu pedido.
                    </Typography>
                  </Box>
                  <PaymentMethodSelector
                    value={method}
                    onChange={(value) => {
                      setMethod(value);
                      setBrickError("");
                      setPixError("");
                    }}
                  />
                </Stack>
              )}

              {!currentPayment &&
                checkoutStep === "payment" &&
                method === "card" &&
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
                checkoutStep === "payment" &&
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
                      customization={{
                        visual: {
                          style: {
                            customVariables: {
                              baseColor: "#28624d",
                              baseColorFirstVariant: "#1d4b3b",
                              baseColorSecondVariant: "#4e806d",
                              buttonTextColor: "#ffffff",
                            },
                          },
                        },
                      }}
                      onSubmit={submitCard}
                      onError={(error) => {
                        logError("mercadoPagoCardBrick", error);
                      }}
                      locale="pt-BR"
                    />
                  </Paper>
                )}

              {!currentPayment &&
                checkoutStep === "payment" &&
                method === "pix" && (
                <PixPaymentForm
                  email={user.email}
                  documentType={documentType}
                  documentNumber={documentNumber}
                  onDocumentTypeChange={(value) => {
                    setDocumentType(value);
                    setDocumentNumber("");
                  }}
                  onDocumentNumberChange={(value) =>
                    setDocumentNumber(value.replace(/\D/g, "").slice(0, 14))
                  }
                  onSubmit={(event) => void submitPix(event)}
                />
              )}
            </Stack>
            )}
          </DialogContent>
          {!paymentMutation.isPending &&
            !isPaymentError &&
            !currentPayment &&
            ((checkoutStep === "review") ||
              (checkoutStep === "payment" && method === "pix")) && (
              <Stack
                sx={{
                  p: { xs: 2, sm: 3 },
                  bgcolor: "background.paper",
                  borderTop: 1,
                  borderColor: "divider",
                }}
              >
                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  type={
                    checkoutStep === "payment" && method === "pix"
                      ? "submit"
                      : "button"
                  }
                  form={
                    checkoutStep === "payment" && method === "pix"
                      ? "pix-payment-form"
                      : undefined
                  }
                  onClick={() => {
                    if (checkoutStep === "review") setCheckoutStep("payment");
                  }}
                  sx={{ minHeight: 52, borderRadius: 2, fontWeight: 700 }}
                >
                  {checkoutStep === "review" ? "Ir para pagamento" : "Gerar Pix"}
                </Button>
              </Stack>
            )}
        </Box>
      )}
    </Box>
  );
}
