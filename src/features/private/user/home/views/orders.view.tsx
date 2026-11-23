import {
  Box,
  Container,
  Stack,
  Typography,
} from "@mui/material";
import type { PaymentListResponse } from "../../payments/types/payment.types";
import { PaymentHistoryCardsView } from "../../payments/components/payment-history-cards.view";
import { PaymentDetailsView } from "../../payments/components/payment-details.view";
import { LayoutUser } from "../../../../../shared/layout/layout-user";

type Props = {
  payments: PaymentListResponse["payments"];
  paymentsPage: number;
  paymentsPageSize: number;
  paymentsTotal: number;
  isPaymentsLoading: boolean;
  isPaymentsFetching: boolean;
  paymentsError: string;
  selectedPaymentId: string | null;
  onLogout: () => void;
  onPaymentsPageChange: (event: unknown, page: number) => void;
  onPaymentsRefresh: () => void;
  onViewPaymentDetails: (paymentId: string) => void;
  onClosePaymentDetails: () => void;
};

export function OrdersView({
  payments,
  paymentsPage,
  paymentsPageSize,
  paymentsTotal,
  isPaymentsLoading,
  isPaymentsFetching,
  paymentsError,
  selectedPaymentId,
  onLogout,
  onPaymentsPageChange,
  onPaymentsRefresh,
  onViewPaymentDetails,
  onClosePaymentDetails,
}: Props) {
  return (
    <LayoutUser onLogout={onLogout}>
      <Box component="main" sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
        <Stack spacing={3}>
          <Box>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
              Meus pedidos
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 1 }}>
              Acompanhe seus pagamentos e consulte os detalhes de cada pedido.
            </Typography>
          </Box>
          <PaymentHistoryCardsView
            payments={payments}
            page={paymentsPage}
            pageSize={paymentsPageSize}
            total={paymentsTotal}
            isLoading={isPaymentsLoading}
            isFetching={isPaymentsFetching}
            error={paymentsError}
            onRefresh={onPaymentsRefresh}
            onViewPayment={onViewPaymentDetails}
            onPageChange={onPaymentsPageChange}
          />
          <PaymentDetailsView
            paymentId={selectedPaymentId}
            onClose={onClosePaymentDetails}
          />
        </Stack>
      </Container>
      </Box>
    </LayoutUser>
  );
}
