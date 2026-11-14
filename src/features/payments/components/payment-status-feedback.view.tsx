import type { ReactNode } from "react";
import { Alert, Stack } from "@mui/material";
import { getPaymentState } from "../utils/payment-status";

type Props = {
  status: string;
  statusDetail: string | null;
  pendingMessage: string;
  children?: ReactNode;
};

function getStatusMessage(
  state: ReturnType<typeof getPaymentState>,
  status: string,
  pendingMessage: string,
) {
  if (state === "success") return "Pagamento confirmado.";
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
  pendingMessage,
  children,
}: Props) {
  const normalizedStatus = status.toLowerCase();
  const state = getPaymentState(status, statusDetail);
  const severity =
    state === "success" ? "success" : state === "error" ? "error" : "info";

  return (
    <Stack spacing={2} sx={{ alignItems: "flex-start", width: "100%" }}>
      <Alert severity={severity} sx={{ width: "100%" }}>
        {getStatusMessage(state, normalizedStatus, pendingMessage)}
        {" "}Status: {status}
        {statusDetail ? ` (${statusDetail})` : ""}
      </Alert>
      {state === "pending" ? children : null}
    </Stack>
  );
}
