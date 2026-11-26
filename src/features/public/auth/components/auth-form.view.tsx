import { useState, type FormEvent } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Link,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { loginInputSchema, registerInputSchema } from "../schema/auth.schema";
import { useAuthForm } from "../hooks/use-auth-form";

type Props = { mode: "login" | "register"; redirectTo?: string | null };

export function AuthFormView({ mode, redirectTo }: Props) {
  const isRegister = mode === "register";
  const { onSubmit, isPending, errorMessage } = useAuthForm(mode);
  const [formError, setFormError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");
    const formData = new FormData(event.currentTarget);
    const input = isRegister
      ? registerInputSchema.safeParse({
          name: formData.get("name"),
          email: formData.get("email"),
          password: formData.get("password"),
        })
      : loginInputSchema.safeParse({
          email: formData.get("email"),
          password: formData.get("password"),
        });

    if (!input.success) {
      setFormError(
        input.error.issues[0]?.message ?? "Confira os dados informados.",
      );
      return;
    }
    onSubmit(input.data);
  }

  const benefits = isRegister
    ? [
        "Acesso personalizado",
        "Seus dados em um só lugar",
        "Comece em poucos passos",
      ]
    : [
        "Acesse sua área pessoal",
        "Continue de onde parou",
        "Seus dados sempre à mão",
      ];

  return (
    <Box
      component="main"
      sx={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        p: { xs: 0, sm: 3 },
        bgcolor: "#f1f6f2",
      }}
    >
      <Paper
        component="section"
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 1080,
          minHeight: { xs: "100vh", sm: 640 },
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          overflow: "hidden",
          border: { xs: 0, sm: 1 },
          borderColor: "divider",
          borderRadius: { xs: 0, sm: 4 },
          boxShadow: { xs: "none", sm: "0 24px 80px rgba(24, 67, 45, .12)" },
        }}
      >
        <Box
          sx={{
            minHeight: { xs: 185, md: "100%" },
            position: "relative",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            p: { xs: 3, sm: 4, md: 6 },
            color: "#fff",
            background:
              "linear-gradient(145deg, #173d30 0%, #26714f 58%, #39875f 100%)",
            "&::before": {
              content: '""',
              position: "absolute",
              width: 420,
              height: 420,
              right: { xs: -220, md: -180 },
              top: { xs: -280, md: -150 },
              border: "1px solid rgba(255,255,255,.18)",
              borderRadius: "50%",
            },
            "&::after": {
              content: '""',
              position: "absolute",
              width: 520,
              height: 520,
              right: { xs: -270, md: -230 },
              bottom: { xs: -390, md: -270 },
              border: "1px solid rgba(255,255,255,.14)",
              borderRadius: "50%",
            },
          }}
        >
          <Stack
            direction="row"
            spacing={1.25}
            sx={{ alignItems: "center", position: "relative", zIndex: 1 }}
          >
            <Box
              aria-hidden="true"
              sx={{
                width: 42,
                height: 42,
                display: "grid",
                placeItems: "center",
                borderRadius: 2,
                bgcolor: "rgba(255,255,255,.16)",
                border: "1px solid rgba(255,255,255,.24)",
                fontSize: 22,
                fontWeight: 800,
              }}
            >
              V
            </Box>
            <Typography
              variant="h6"
              sx={{ fontWeight: 750, letterSpacing: ".02em" }}
            >
              VITRINE
            </Typography>
          </Stack>
          <Stack
            spacing={2}
            sx={{
              maxWidth: 390,
              position: "relative",
              zIndex: 1,
              display: { xs: "none", md: "flex" },
            }}
          >
            <Typography
              variant="overline"
              sx={{ color: "#bfe3ca", letterSpacing: ".16em", fontWeight: 700 }}
            >
              SEU ESPAÇO DIGITAL
            </Typography>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 750,
                lineHeight: 1.12,
                letterSpacing: "-.04em",
              }}
            >
              {isRegister
                ? "Crie seu acesso em poucos passos."
                : "Acesse sua conta com simplicidade."}
            </Typography>
            <Typography
              sx={{ color: "rgba(255,255,255,.78)", lineHeight: 1.75 }}
            >
              {isRegister
                ? "Preencha seus dados e tenha um espaço personalizado para acompanhar suas informações."
                : "Entre para acessar suas informações e continuar de onde parou."}
            </Typography>
            <Stack spacing={1}>
              {benefits.map((item) => (
                <Stack
                  key={item}
                  direction="row"
                  spacing={1.25}
                  sx={{ alignItems: "center" }}
                >
                  <Box
                    aria-hidden="true"
                    sx={{
                      width: 22,
                      height: 22,
                      display: "grid",
                      placeItems: "center",
                      borderRadius: "50%",
                      bgcolor: "rgba(191,227,202,.18)",
                      color: "#c9efd3",
                      fontSize: 13,
                      fontWeight: 800,
                    }}
                  >
                    ✓
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{ color: "rgba(255,255,255,.88)" }}
                  >
                    {item}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </Stack>
          <Typography
            variant="caption"
            sx={{
              color: "rgba(255,255,255,.62)",
              position: "relative",
              zIndex: 1,
              display: { xs: "none", md: "block" },
            }}
          >
            Uma base pronta para a sua próxima ideia.
          </Typography>
        </Box>
        <Box
          sx={{
            display: "grid",
            placeItems: "center",
            p: { xs: 3, sm: 5, md: 6 },
          }}
        >
          <Stack spacing={3} sx={{ width: "100%", maxWidth: 390 }}>
            <Stack spacing={1}>
              <Typography
                variant="overline"
                sx={{
                  color: "primary.main",
                  fontWeight: 700,
                  letterSpacing: ".12em",
                }}
              >
                {isRegister ? "COMECE AGORA" : "ACESSO À CONTA"}
              </Typography>
              <Typography
                variant="h4"
                component="h1"
                sx={{ fontWeight: 750, letterSpacing: "-.04em" }}
              >
                {isRegister ? "Crie sua conta" : "Entre na sua conta"}
              </Typography>
              <Typography color="text.secondary">
                {isRegister
                  ? "Preencha seus dados para começar."
                  : "Informe seus dados para continuar."}
              </Typography>
            </Stack>
            <Stack
              direction="row"
              spacing={0.5}
              sx={{ p: 0.5, borderRadius: 2, bgcolor: "#f1f5f2" }}
            >
              <Button
                component={RouterLink}
                to="/login"
                state={redirectTo ? { from: redirectTo } : undefined}
                fullWidth
                variant={!isRegister ? "contained" : "text"}
                sx={{
                  py: 1,
                  boxShadow: "none",
                  color: !isRegister ? "common.white" : "text.secondary",
                  "&:hover": { boxShadow: "none" },
                }}
              >
                Entrar
              </Button>
              <Button
                component={RouterLink}
                to="/register"
                state={redirectTo ? { from: redirectTo } : undefined}
                fullWidth
                variant={isRegister ? "contained" : "text"}
                sx={{
                  py: 1,
                  boxShadow: "none",
                  color: isRegister ? "common.white" : "text.secondary",
                  "&:hover": { boxShadow: "none" },
                }}
              >
                Criar conta
              </Button>
            </Stack>
            <Box component="form" onSubmit={handleSubmit}>
              <Stack spacing={2}>
                {isRegister && (
                  <TextField
                    name="name"
                    label="Nome completo"
                    autoComplete="name"
                    placeholder="Como podemos te chamar?"
                    required
                    fullWidth
                  />
                )}
                <TextField
                  name="email"
                  label="E-mail"
                  type="email"
                  autoComplete="email"
                  placeholder="voce@exemplo.com"
                  required
                  fullWidth
                />
                <TextField
                  name="password"
                  label="Senha"
                  type="password"
                  autoComplete={
                    isRegister ? "new-password" : "current-password"
                  }
                  placeholder={
                    isRegister ? "Mínimo de 8 caracteres" : "Sua senha"
                  }
                  required
                  fullWidth
                />
                {(formError || errorMessage) && (
                  <Alert severity="error" role="alert">
                    {formError || errorMessage}
                  </Alert>
                )}
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={isPending}
                  fullWidth
                  sx={{ py: 1.35, fontWeight: 700 }}
                >
                  {isPending
                    ? "Aguarde..."
                    : isRegister
                      ? "Criar minha conta"
                      : "Entrar"}
                </Button>
              </Stack>
            </Box>
            <Stack spacing={1} sx={{ alignItems: "center" }}>
              <Link
                component={RouterLink}
                to="/produtos"
                underline="hover"
                variant="body2"
              >
                Voltar para a loja
              </Link>
            </Stack>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
}
