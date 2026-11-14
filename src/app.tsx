import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import type { Product } from "./features/products/types/product.types";
import type { PaymentResponse } from "./features/payments/types/payment.types";
import { AuthFormView } from "./features/auth/components/auth-form.view";
import { useMeQuery } from "./features/auth/queries/use-me-query";
import { authQueryKeys } from "./features/auth/endpoints-keys/auth.keys";
import { CatalogView } from "./features/products/views/catalog.view";
import { useProductsQuery } from "./features/products/queries/use-products-query";
import { PaymentCheckoutView } from "./features/payments/components/payment-checkout.view";
import { paymentQueryKeys } from "./features/payments/endpoints-keys/payment.keys";
import { OrdersView } from "./features/home/views/orders.view";
import { useHome } from "./features/home/hooks/use-home";
import { getApiErrorMessage } from "./shared/lib/api-error";
import { TOKEN_STORAGE_KEY } from "./shared/services/http-client";

function getRedirectTo(state: unknown): string | null {
  if (!state || typeof state !== "object" || !("from" in state)) return null;
  const from = state.from;
  if (typeof from !== "string") return null;
  if (from === "/pedidos" || from === "/produtos" || from.startsWith("/produtos?")) {
    return from;
  }
  return null;
}

function useLogout() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return () => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    queryClient.removeQueries({ queryKey: authQueryKeys.all });
    queryClient.removeQueries({ queryKey: paymentQueryKeys.all });
    navigate("/produtos", { replace: true });
  };
}

function CatalogRoute() {
  const { data: user, isLoading: isAuthLoading } = useMeQuery();
  const productsQuery = useProductsQuery();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [paymentResult, setPaymentResult] = useState<
    PaymentResponse["payment"] | null
  >(null);
  const redirectProductId = searchParams.get("comprar");

  useEffect(() => {
    if (!user || !redirectProductId || !productsQuery.data) return;
    const product = productsQuery.data.find(
      (item) => item.id === redirectProductId,
    );
    if (product) setSelectedProduct(product);
    const nextSearchParams = new URLSearchParams(searchParams);
    nextSearchParams.delete("comprar");
    setSearchParams(nextSearchParams, { replace: true });
  }, [
    productsQuery.data,
    redirectProductId,
    searchParams,
    setSearchParams,
    user,
  ]);

  function handleBuy(product: Product) {
    if (!user) {
      navigate("/login", {
        state: { from: `/produtos?comprar=${encodeURIComponent(product.id)}` },
      });
      return;
    }
    setPaymentResult(null);
    setSelectedProduct(product);
  }

  function handlePaymentResult(payment: PaymentResponse["payment"]) {
    setPaymentResult(payment);
    void queryClient.invalidateQueries({ queryKey: paymentQueryKeys.all });
  }

  const logout = useLogout();

  return (
    <>
      <CatalogView
        user={user ?? null}
        isAuthLoading={isAuthLoading}
        products={productsQuery.data ?? []}
        isLoading={productsQuery.isLoading}
        error={
          productsQuery.error
            ? getApiErrorMessage(productsQuery.error)
            : ""
        }
        onLogout={logout}
        onBuy={handleBuy}
      />
      {user && (
        <PaymentCheckoutView
          product={selectedProduct}
          user={user}
          result={paymentResult}
          onClose={() => setSelectedProduct(null)}
          onResult={handlePaymentResult}
        />
      )}
    </>
  );
}

function OrdersRoute() {
  const { data: user, isLoading, isError } = useMeQuery();
  const orders = useHome(Boolean(user));
  const logout = useLogout();

  if (!localStorage.getItem(TOKEN_STORAGE_KEY)) {
    return <Navigate to="/login" state={{ from: "/pedidos" }} replace />;
  }
  if (isLoading) return <main className="loading-screen">Carregando...</main>;
  if (isError || !user) {
    return <Navigate to="/login" state={{ from: "/pedidos" }} replace />;
  }

  return <OrdersView user={user} {...orders} onLogout={logout} />;
}

function AuthRoute({ mode }: { mode: "login" | "register" }) {
  const { data: user, isLoading } = useMeQuery();
  const location = useLocation();
  const redirectTo = getRedirectTo(location.state);

  if (isLoading && localStorage.getItem(TOKEN_STORAGE_KEY)) {
    return <main className="loading-screen">Carregando...</main>;
  }
  if (user) return <Navigate to={redirectTo ?? "/produtos"} replace />;
  return <AuthFormView mode={mode} redirectTo={redirectTo} />;
}

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/produtos" replace />} />
      <Route path="/produtos" element={<CatalogRoute />} />
      <Route path="/pedidos" element={<OrdersRoute />} />
      <Route path="/login" element={<AuthRoute mode="login" />} />
      <Route path="/register" element={<AuthRoute mode="register" />} />
      <Route path="*" element={<Navigate to="/produtos" replace />} />
    </Routes>
  );
}
