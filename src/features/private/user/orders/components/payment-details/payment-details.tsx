import {
  Alert,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { getApiErrorMessage } from "../../../../../../shared/lib/api-error";
import { formatCurrency } from "../../../../../../shared/lib/format-currency";
import {
  translatePaymentMethod,
  translatePaymentStatus,
  translatePaymentStatusDetail,
} from "../../../../../../shared/i18n/payment";
import {
  PaymentStatusFeedback,
  PixPaymentInstructions,
  usePaymentStatusQuery,
} from "../../../../../../shared/cross-features/payments";

type Props = {
  paymentId: string | null;
  onClose: () => void;
};

function getStatusLabel(status: string | null) {
  return translatePaymentStatus(status);
}

function getProcessingModeLabel(processingMode: string | null) {
  if (processingMode === "automatic") return "Processamento automático";
  return null;
}

function getStatusDetailLabel(statusDetail: string | null) {
  return translatePaymentStatusDetail(statusDetail);
}

function getCaptureModeLabel(captureMode: string | null) {
  if (captureMode === "automatic_async") return "Captura automática";
  if (captureMode === "manual") return "Captura manual";
  return null;
}

function getPaymentTypeLabel(type: string | null) {
  if (type === "online") return "Online";
  return null;
}

function getPaymentMethodTypeLabel(type: string | null) {
  if (type === "bank_transfer") return "Transferência bancária";
  if (type === "credit_card") return "Cartão de crédito";
  if (type === "debit_card") return "Cartão de débito";
  return null;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(new Date(value));
}

export function PaymentDetailsView({ paymentId, onClose }: Props) {
  const paymentQuery = usePaymentStatusQuery(paymentId, Boolean(paymentId));
  const payment = paymentQuery.data?.payment;
  const providerOrder = payment?.providerOrderDetails;
  const currency =
    providerOrder?.currency ?? payment?.currency ?? "BRL";

  function formatAmount(amount: number | null | undefined) {
    return amount == null ? "Não informado" : formatCurrency(amount, currency);
  }

  const productsSubtotal =
    payment?.items.reduce((total, item) => total + item.lineTotal, 0) ?? 0;
  const providerPayment = providerOrder?.payment;
  const installments = providerPayment?.installments ?? null;
  const installmentAmount = providerPayment?.installmentAmount ?? null;
  const installmentPlanTotal =
    installments != null && installmentAmount != null
      ? Math.round(installments * installmentAmount * 100) / 100
      : null;
  const providerPaidTotal =
    providerOrder?.totalPaidAmount != null &&
    providerOrder.totalPaidAmount > 0
      ? providerOrder.totalPaidAmount
      : null;
  const isPaymentPaid = ["processed", "approved", "accredited"].includes(
    payment?.status.toLowerCase() ?? "",
  );
  const finalPaymentTotal = isPaymentPaid
    ? providerPaidTotal ?? installmentPlanTotal ?? providerOrder?.totalAmount ?? payment?.amount
    : installmentPlanTotal ??
      providerPaidTotal ??
      providerOrder?.totalAmount ??
      payment?.amount;
  const installmentCharges =
    finalPaymentTotal != null
      ? Math.max(0, Math.round((finalPaymentTotal - productsSubtotal) * 100) / 100)
      : 0;

  return (
    <Dialog
      open={Boolean(paymentId)}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle sx={{ pr: 7 }}>
        Detalhes do pagamento
        <IconButton
          aria-label="Fechar detalhes do pagamento"
          onClick={onClose}
          sx={{ position: "absolute", right: 12, top: 12 }}
        >
          <span aria-hidden="true">×</span>
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2.5}>
          {paymentQuery.isLoading && <CircularProgress size={24} />}
          {paymentQuery.error && (
            <Alert severity="error">
              Não foi possível consultar o pagamento:{" "}
              {getApiErrorMessage(paymentQuery.error)}
            </Alert>
          )}
          {payment && (
            <>
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Stack spacing={1.5}>
                  <Typography variant="h6">Resumo do pedido</Typography>
                  {payment.items.map((item, index) => (
                    <Stack
                      key={`${payment.id}-${index}`}
                      direction="row"
                      sx={{ justifyContent: "space-between", gap: 2 }}
                    >
                      <Typography color="text.secondary">
                        {item.productName} × {item.quantity}
                      </Typography>
                      <Typography sx={{ textAlign: "right" }}>
                        {formatCurrency(item.lineTotal, item.currency)}
                      </Typography>
                    </Stack>
                  ))}
                  <Stack
                    direction="row"
                    sx={{ justifyContent: "space-between", gap: 2 }}
                  >
                    <Typography color="text.secondary">
                      Subtotal dos produtos
                    </Typography>
                    <Typography>
                      {formatCurrency(productsSubtotal, payment.currency ?? "BRL")}
                    </Typography>
                  </Stack>
                  {payment.paymentMethod === "credit_card" && (
                    <Stack
                      direction="row"
                      sx={{ justifyContent: "space-between", gap: 2 }}
                    >
                      <Typography color="text.secondary">Parcelamento</Typography>
                      <Typography sx={{ textAlign: "right" }}>
                        {installments == null
                          ? "Não informado"
                          : installments === 1
                            ? `1 parcela de ${formatAmount(installmentAmount ?? finalPaymentTotal)}`
                            : `${installments} parcelas${
                                installmentAmount == null
                                  ? ""
                                  : ` de ${formatAmount(installmentAmount)}`
                              }`}
                      </Typography>
                    </Stack>
                  )}
                  {payment.paymentMethod === "credit_card" &&
                    (installments ?? 1) > 1 &&
                    installmentCharges > 0 && (
                    <Stack
                      direction="row"
                      sx={{ justifyContent: "space-between", gap: 2 }}
                    >
                      <Typography color="text.secondary">
                        Juros do parcelamento
                      </Typography>
                      <Typography>{formatAmount(installmentCharges)}</Typography>
                    </Stack>
                  )}
                  <Stack
                    direction="row"
                    sx={{ justifyContent: "space-between", gap: 2 }}
                  >
                    <Typography sx={{ fontWeight: 700 }}>
                      {isPaymentPaid ? "Total pago" : "Total final previsto"}
                    </Typography>
                    <Typography sx={{ fontWeight: 700 }}>
                      {formatAmount(finalPaymentTotal)}
                    </Typography>
                  </Stack>
                  <Stack
                    direction="row"
                    sx={{ justifyContent: "space-between", gap: 2 }}
                  >
                    <Typography color="text.secondary">
                      Forma de pagamento
                    </Typography>
                    <Typography sx={{ textAlign: "right" }}>
                      {translatePaymentMethod(payment.paymentMethod)}
                    </Typography>
                  </Stack>
                  {payment.createdAt && (
                    <Stack
                      direction="row"
                      sx={{ justifyContent: "space-between", gap: 2 }}
                    >
                      <Typography color="text.secondary">Data</Typography>
                      <Typography sx={{ textAlign: "right" }}>
                        {formatDate(payment.createdAt)}
                      </Typography>
                    </Stack>
                  )}
                  {payment.providerOrderId && (
                    <>
                      <Divider />
                      <Stack spacing={0.5}>
                        <Typography color="text.secondary" variant="body2">
                          Número do pedido
                        </Typography>
                        <Typography variant="body2" sx={{ overflowWrap: "anywhere" }}>
                          {payment.providerOrderId}
                        </Typography>
                      </Stack>
                    </>
                  )}
                </Stack>
              </Paper>
              {providerOrder && (
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Stack spacing={1.5}>
                    <Typography variant="h6">Detalhes do pedido</Typography>
                    <Stack
                      direction="row"
                      sx={{ justifyContent: "space-between", gap: 2 }}
                    >
                      <Typography color="text.secondary">Identificador</Typography>
                      <Typography variant="body2" sx={{ overflowWrap: "anywhere" }}>
                        {providerOrder.id}
                      </Typography>
                    </Stack>
                    {getPaymentTypeLabel(providerOrder.type) && (
                      <Stack
                        direction="row"
                        sx={{ justifyContent: "space-between", gap: 2 }}
                      >
                        <Typography color="text.secondary">Tipo</Typography>
                        <Typography>
                          {getPaymentTypeLabel(providerOrder.type)}
                        </Typography>
                      </Stack>
                    )}
                    <Stack
                      direction="row"
                      sx={{ justifyContent: "space-between", gap: 2 }}
                    >
                      <Typography color="text.secondary">Status</Typography>
                      <Typography>{getStatusLabel(providerOrder.status)}</Typography>
                    </Stack>
                    {getStatusDetailLabel(providerOrder.statusDetail) && (
                      <Stack
                        direction="row"
                        sx={{ justifyContent: "space-between", gap: 2 }}
                      >
                        <Typography color="text.secondary">
                          Detalhe do status
                        </Typography>
                        <Typography>
                          {getStatusDetailLabel(providerOrder.statusDetail)}
                        </Typography>
                      </Stack>
                    )}
                    {providerOrder.captureMode && (
                      <Stack
                        direction="row"
                        sx={{ justifyContent: "space-between", gap: 2 }}
                      >
                        <Typography color="text.secondary">Captura</Typography>
                        <Typography>
                          {getCaptureModeLabel(providerOrder.captureMode) ??
                            "Não informado"}
                        </Typography>
                      </Stack>
                    )}
                    {getProcessingModeLabel(providerOrder.processingMode) && (
                      <Stack
                        direction="row"
                        sx={{ justifyContent: "space-between", gap: 2 }}
                      >
                        <Typography color="text.secondary">
                          Processamento
                        </Typography>
                        <Typography>
                          {getProcessingModeLabel(
                            providerOrder.processingMode,
                          )}
                        </Typography>
                      </Stack>
                    )}
                    {providerOrder.countryCode === "BRA" && (
                      <Stack
                        direction="row"
                        sx={{ justifyContent: "space-between", gap: 2 }}
                      >
                        <Typography color="text.secondary">País</Typography>
                        <Typography>Brasil</Typography>
                      </Stack>
                    )}
                    {providerOrder.createdAt && (
                      <Stack
                        direction="row"
                        sx={{ justifyContent: "space-between", gap: 2 }}
                      >
                        <Typography color="text.secondary">Criado em</Typography>
                        <Typography sx={{ textAlign: "right" }}>
                          {formatDate(providerOrder.createdAt)}
                        </Typography>
                      </Stack>
                    )}
                    {providerOrder.updatedAt && (
                      <Stack
                        direction="row"
                        sx={{ justifyContent: "space-between", gap: 2 }}
                      >
                        <Typography color="text.secondary">
                          Atualizado em
                        </Typography>
                        <Typography sx={{ textAlign: "right" }}>
                          {formatDate(providerOrder.updatedAt)}
                        </Typography>
                      </Stack>
                    )}
                    {providerOrder.externalReference && (
                      <Stack spacing={0.5}>
                        <Typography color="text.secondary" variant="body2">
                          Referência externa
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ overflowWrap: "anywhere" }}
                        >
                          {providerOrder.externalReference}
                        </Typography>
                      </Stack>
                    )}
                    {providerOrder.payment && (
                      <>
                        <Divider />
                        <Typography variant="subtitle1">
                          Dados do pagamento
                        </Typography>
                        {providerOrder.payment.id && (
                          <Stack spacing={0.5}>
                            <Typography color="text.secondary" variant="body2">
                              Identificador do pagamento
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ overflowWrap: "anywhere" }}
                            >
                              {providerOrder.payment.id}
                            </Typography>
                          </Stack>
                        )}
                        <Stack
                          direction="row"
                          sx={{ justifyContent: "space-between", gap: 2 }}
                        >
                          <Typography color="text.secondary">Status</Typography>
                          <Typography>
                            {getStatusLabel(providerOrder.payment.status)}
                          </Typography>
                        </Stack>
                        {getStatusDetailLabel(
                          providerOrder.payment.statusDetail,
                        ) && (
                          <Stack
                            direction="row"
                            sx={{ justifyContent: "space-between", gap: 2 }}
                          >
                            <Typography color="text.secondary">Detalhe</Typography>
                            <Typography>
                              {getStatusDetailLabel(
                                providerOrder.payment.statusDetail,
                              )}
                            </Typography>
                          </Stack>
                        )}
                        {providerOrder.payment.method && (
                          <Stack
                            direction="row"
                            sx={{ justifyContent: "space-between", gap: 2 }}
                          >
                            <Typography color="text.secondary">
                              Método
                            </Typography>
                            <Typography>
                              {translatePaymentMethod(providerOrder.payment.method)}
                            </Typography>
                          </Stack>
                        )}
                        {getPaymentMethodTypeLabel(
                          providerOrder.payment.methodType,
                        ) && (
                          <Stack
                            direction="row"
                            sx={{ justifyContent: "space-between", gap: 2 }}
                          >
                            <Typography color="text.secondary">
                              Tipo de pagamento
                            </Typography>
                            <Typography>
                              {getPaymentMethodTypeLabel(
                                providerOrder.payment.methodType,
                              )}
                            </Typography>
                          </Stack>
                        )}
                        {providerOrder.payment.referenceId && (
                          <Stack spacing={0.5}>
                            <Typography color="text.secondary" variant="body2">
                              Referência do pagamento
                            </Typography>
                            <Typography variant="body2">
                              {providerOrder.payment.referenceId}
                            </Typography>
                          </Stack>
                        )}
                        {providerOrder.payment.expiresAt && (
                          <Stack
                            direction="row"
                            sx={{ justifyContent: "space-between", gap: 2 }}
                          >
                            <Typography color="text.secondary">
                              Válido até
                            </Typography>
                            <Typography sx={{ textAlign: "right" }}>
                              {formatDate(providerOrder.payment.expiresAt)}
                            </Typography>
                          </Stack>
                        )}
                        {providerOrder.payment.expirationTime && (
                          <Stack
                            direction="row"
                            sx={{ justifyContent: "space-between", gap: 2 }}
                          >
                            <Typography color="text.secondary">
                              Prazo configurado
                            </Typography>
                            <Typography>
                              {providerOrder.payment.expirationTime === "PT24H"
                                ? "24 horas"
                                : "Conforme informado pelo provedor"}
                            </Typography>
                          </Stack>
                        )}
                      </>
                    )}
                  </Stack>
                </Paper>
              )}
            <PaymentStatusFeedback
              status={payment.status}
              statusDetail={payment.statusDetail}
              expiresAt={payment.expiresAt}
              pendingMessage={
                payment.paymentMethod === "pix"
                  ? "Pix gerado. Aguardando a confirmação do pagamento."
                  : "Pagamento enviado. Aguardando a confirmação."
              }
              actions={
                <Button variant="outlined" onClick={onClose}>
                  Fechar
                </Button>
              }
            >
              {payment.paymentMethod === "pix" && (
                <PixPaymentInstructions
                  qrCode={payment.qrCode}
                  qrCodeBase64={payment.qrCodeBase64}
                  ticketUrl={payment.ticketUrl}
                  expiresAt={payment.expiresAt}
                />
              )}
              {paymentQuery.isFetching && (
                <CircularProgress size={20} />
              )}
            </PaymentStatusFeedback>
            </>
          )}
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
