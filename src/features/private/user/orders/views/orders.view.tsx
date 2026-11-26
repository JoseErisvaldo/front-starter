import {
  Box,
  Container,
  Stack,
  Typography,
} from "@mui/material";
import { PaymentHistoryCardsView } from "../../payments/components/payment-history-cards.view";
import { PaymentDetailsView } from "../../payments/components/payment-details.view";
import { LayoutUser } from "../../../../../shared/layout/layout-user";
import { useOrdersPage } from "../hooks/use-orders-page";

export function OrdersView() {
  const {
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
  } = useOrdersPage()

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
