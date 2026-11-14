import type { ReactNode } from "react";
import { Alert, Stack } from "@mui/material";
import { getPaymentState } from "../utils/payment-status";

type Props = {
  status: string;
  statusDetail: string | null;
  expiresAt?: string | null;
  pendingMessage: string;
  children?: ReactNode;
  actions?: ReactNode;
};

function getStatusMessage(
  state: ReturnType<typeof getPaymentState>,
  status: string,
  pendingMessage: string,
  expiresAt: string | null,
) {
  if (state === "success") return "Pagamento confirmado.";
  if (expiresAt && Date.parse(expiresAt) <= Date.now()) {
    return "O prazo para pagamento Pix expirou.";
  }
  if (status === "expired") return "O pagamento expirou.";
  if (status === "cancelled") return "O pagamento foi cancelado.";
  if (status === "refunded") return "O pagamento foi estornado.";
  if (status === "charged_back") return "O pagamento foi contestado.";
  if (state === "error") {
    return "O pagamento não foi aprovado. Confira os dados ou tente outra forma de pagamento.";
  }
  return pendingMessage;
}

export function PaymentStatusFeedback({
  status,
  statusDetail,
  expiresAt = null,
  pendingMessage,
  children,
  actions,
}: Props) {
  const normalizedStatus = status.toLowerCase();
  const state = getPaymentState(status, statusDetail, expiresAt);
  const severity =
    state === "success" ? "success" : state === "error" ? "error" : "info";

  return (
    <Stack spacing={2} sx={{ alignItems: "flex-start", width: "100%" }}>
      <Alert severity={severity} sx={{ width: "100%" }}>
        {getStatusMessage(state, normalizedStatus, pendingMessage, expiresAt)}
      </Alert>
      {state === "pending" ? children : null}
      {state !== "pending" ? actions : null}
    </Stack>
  );
}
