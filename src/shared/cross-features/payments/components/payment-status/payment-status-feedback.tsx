import type { ReactNode } from "react";
import { Alert, Box, Stack, SvgIcon, Typography } from "@mui/material";
import { getPaymentState } from "../../utils/payment-status";

type Props = {
  status: string;
  statusDetail: string | null;
  expiresAt?: string | null;
  pendingMessage: string;
  children?: ReactNode;
  actions?: ReactNode;
  message?: string;
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
    return "Não foi possível processar o pagamento.";
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
  message,
}: Props) {
  const normalizedStatus = status.toLowerCase();
  const state = getPaymentState(status, statusDetail, expiresAt);
  const severity =
    state === "success" ? "success" : state === "error" ? "error" : "info";

  return (
    <Stack
      spacing={2}
      sx={{
        alignItems: state === "pending" ? "flex-start" : "center",
        justifyContent: state === "pending" ? "flex-start" : "center",
        textAlign: state === "pending" ? "left" : "center",
        width: "100%",
        flex: 1,
        minHeight: state === "pending" ? undefined : 320,
      }}
    >
      {state === "pending" ? (
        <Alert severity={severity} sx={{ width: "100%" }}>
          {message ?? getStatusMessage(state, normalizedStatus, pendingMessage, expiresAt)}
        </Alert>
      ) : (
        <>
          <Box
            sx={{
              width: 132,
              height: 132,
              display: "grid",
              placeItems: "center",
              borderRadius: "50%",
              bgcolor:
                state === "success"
                  ? "success.main"
                  : "error.main",
              color: "common.white",
              boxShadow: (theme) =>
                `0 0 0 10px ${state === "success" ? theme.palette.success.light : theme.palette.error.light}`,
            }}
          >
            <SvgIcon sx={{ fontSize: 88 }} viewBox="0 0 24 24">
              {state === "success" ? (
                <path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
              ) : (
                <path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
              )}
            </SvgIcon>
          </Box>
          <Typography variant="h6" component="p" sx={{ fontWeight: 700 }}>
            {message ?? getStatusMessage(state, normalizedStatus, pendingMessage, expiresAt)}
          </Typography>
        </>
      )}
      {state === "pending" ? children : null}
      {state !== "pending" ? actions : null}
    </Stack>
  );
}
