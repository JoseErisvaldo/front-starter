import {
  Box,
  Container,
  Stack,
  Typography,
} from "@mui/material";
import type { User } from "../../auth/types/auth.types";
import type { PaymentListResponse } from "../../payments/types/payment.types";
import { PaymentHistoryCardsView } from "../../payments/components/payment-history-cards.view";
import { PaymentDetailsView } from "../../payments/components/payment-details.view";
import { StoreHeader } from "../../../shared/components/store-header";

type Props = {
  user: User;
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
  user,
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
    <Box component="main" sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <StoreHeader user={user} activePage="orders" onLogout={onLogout} />
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
        </Stack>
      </Container>
      <PaymentDetailsView
        paymentId={selectedPaymentId}
        onClose={onClosePaymentDetails}
      />
    </Box>
  );
}
