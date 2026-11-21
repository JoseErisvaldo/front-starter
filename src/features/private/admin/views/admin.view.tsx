import { Box, Paper, Typography } from "@mui/material";
import { BrandMark, SIDEBAR_WIDTH, Sidebar } from "../../../../shared/layout/sidebar/sidebar";

type Props = {
  onLogout: () => void;
};

export function AdminView({ onLogout }: Props) {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f2f6f3" }}>
      <Sidebar onLogout={onLogout} />
      <Box
        component="main"
        sx={{
          ml: { xs: `${SIDEBAR_WIDTH.xs}px`, sm: `${SIDEBAR_WIDTH.sm}px` },
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          p: { xs: 2, sm: 4, md: 6 },
        }}
      >
        <Paper
          elevation={0}
          sx={{
            width: "100%",
            maxWidth: 728,
            minHeight: { xs: 320, sm: 372 },
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            px: { xs: 3, sm: 6, md: 8 },
            py: { xs: 4, sm: 6 },
            border: "1px solid #dce8df",
            borderRadius: 3,
            boxShadow: "0 24px 70px rgba(18, 60, 50, .08)",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 4 }}>
            <BrandMark />
            <Typography variant="h6" sx={{ color: "#173d30", fontWeight: 750, letterSpacing: "-.03em" }}>
              Vitrite
            </Typography>
          </Box>
          <Typography
            variant="overline"
            sx={{ color: "#26714f", fontWeight: 750, letterSpacing: ".12em" }}
          >
            PAINEL DE VENDAS E ASSINATURAS
          </Typography>
          <Typography
            component="h1"
            sx={{
              mt: 1,
              color: "#173d30",
              fontSize: { xs: 34, sm: 48 },
              fontWeight: 750,
              lineHeight: 1.12,
              letterSpacing: "-.045em",
            }}
          >
            Vendas e assinaturas dos seus produtos
          </Typography>
          <Typography sx={{ mt: 2, maxWidth: 570, color: "#64766b", lineHeight: 1.7 }}>
            Acompanhe pedidos, pagamentos e assinaturas dos seus produtos em um só lugar.
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
}
