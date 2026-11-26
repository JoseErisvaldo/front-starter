import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { logError } from "../../../../lib/log-error";

type Props = {
  qrCode: string | null;
  qrCodeBase64: string | null;
  ticketUrl: string | null;
  expiresAt: string | null;
};

function formatExpiration(expiresAt: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(expiresAt));
}

export function PixPaymentInstructions({
  qrCode,
  qrCodeBase64,
  ticketUrl,
  expiresAt,
}: Props) {
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState("");

  async function copyPixCode() {
    if (!qrCode) return;
    try {
      await navigator.clipboard.writeText(qrCode);
      setCopied(true);
      setCopyError("");
    } catch (error) {
      logError("copyPixCode", error);
      setCopyError("Não foi possível copiar. Selecione e copie o código manualmente.");
    }
  }

  const isWithinDeadline =
    expiresAt !== null && Date.parse(expiresAt) > Date.now();

  if (!expiresAt) {
    return (
      <Alert severity="warning">
        Não foi possível confirmar o prazo deste Pix. Consulte o pedido no
        Mercado Pago antes de tentar pagá-lo.
      </Alert>
    );
  }

  if (!isWithinDeadline) {
    return <Alert severity="warning">O prazo deste Pix expirou.</Alert>;
  }

  if (!qrCode && !qrCodeBase64 && !ticketUrl) {
    return (
      <Alert severity="warning">
        O Mercado Pago não retornou os dados de pagamento deste Pix.
      </Alert>
    );
  }

  return (
    <Stack spacing={2} sx={{ width: "100%", alignItems: "center" }}>
      <Typography variant="caption" color="text.secondary">
        Pix válido até {formatExpiration(expiresAt)}
      </Typography>
      {qrCodeBase64 && (
        <Box
          component="img"
          src={`data:image/png;base64,${qrCodeBase64}`}
          alt="QR code para pagamento Pix"
          sx={{ width: 220, height: 220, objectFit: "contain" }}
        />
      )}
      {qrCode && (
        <Stack spacing={1} sx={{ width: "100%" }}>
          <Typography variant="subtitle2">Pix copia e cola</Typography>
          <TextField
            value={qrCode}
            multiline
            minRows={3}
            fullWidth
            slotProps={{ input: { readOnly: true } }}
          />
          <Button variant="outlined" onClick={copyPixCode}>
            {copied ? "Código copiado" : "Copiar código Pix"}
          </Button>
          {copyError && <Alert severity="error">{copyError}</Alert>}
        </Stack>
      )}
      {ticketUrl && (
        <Button
          component="a"
          href={ticketUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          Abrir instruções de pagamento
        </Button>
      )}
    </Stack>
  );
}
