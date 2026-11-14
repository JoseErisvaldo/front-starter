export type PaymentState = "success" | "pending" | "error";

export function isPaymentExpired(expiresAt: string | null): boolean {
  if (!expiresAt) return false;
  const expirationTimestamp = Date.parse(expiresAt);
  return Number.isFinite(expirationTimestamp) && expirationTimestamp <= Date.now();
}

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
  expiresAt: string | null = null,
): PaymentState {
  const normalizedStatus = status.toLowerCase();
  const normalizedDetail = statusDetail?.toLowerCase() ?? "";

  if (successfulStatuses.has(normalizedStatus)) return "success";
  if (
    isPaymentExpired(expiresAt) ||
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
  expiresAt: string | null = null,
): boolean {
  return getPaymentState(status, statusDetail, expiresAt) !== "pending";
}
