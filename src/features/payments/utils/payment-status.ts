export type PaymentState = "success" | "pending" | "error";

const successfulStatuses = new Set(["processed", "approved"]);
const failedStatuses = new Set([
  "failed",
  "cancelled",
  "rejected",
  "expired",
  "declined",
  "error",
  "processing_error",
  "refunded",
  "charged_back",
]);

export function getPaymentState(
  status: string,
  statusDetail: string | null,
): PaymentState {
  const normalizedStatus = status.toLowerCase();
  const normalizedDetail = statusDetail?.toLowerCase() ?? "";

  if (successfulStatuses.has(normalizedStatus)) return "success";
  if (
    failedStatuses.has(normalizedStatus) ||
    normalizedDetail.includes("error") ||
    normalizedDetail.includes("rejected")
  ) {
    return "error";
  }
  return "pending";
}

export function isPaymentFinal(
  status: string,
  statusDetail: string | null,
): boolean {
  return getPaymentState(status, statusDetail) !== "pending";
}
