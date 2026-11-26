import type { FormEvent } from "react";
import { Box, FormControl, InputLabel, MenuItem, Select, Stack, TextField, Typography } from "@mui/material";

type Props = {
  email: string;
  documentType: "CPF" | "CNPJ";
  documentNumber: string;
  onDocumentTypeChange: (type: "CPF" | "CNPJ") => void;
  onDocumentNumberChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export function PixPaymentForm({
  email,
  documentType,
  documentNumber,
  onDocumentTypeChange,
  onDocumentNumberChange,
  onSubmit,
}: Props) {
  return (
    <Stack spacing={1.5}>
      <Box>
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          Pagar com Pix
        </Typography>
        <Typography variant="body2" color="text.secondary">
          O código Pix será enviado para {email}.
        </Typography>
      </Box>
      <Box id="pix-payment-form" component="form" onSubmit={onSubmit}>
        <Stack spacing={2}>
          <FormControl fullWidth required>
            <InputLabel id="pix-document-type-label">Documento</InputLabel>
            <Select
              labelId="pix-document-type-label"
              value={documentType}
              label="Documento"
              onChange={(event) =>
                onDocumentTypeChange(event.target.value as "CPF" | "CNPJ")
              }
            >
              <MenuItem value="CPF">CPF</MenuItem>
              <MenuItem value="CNPJ">CNPJ</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label={documentType}
            value={documentNumber}
            onChange={(event) => onDocumentNumberChange(event.target.value)}
            slotProps={{
              htmlInput: { inputMode: "numeric", maxLength: 14 },
            }}
            required
            fullWidth
          />
        </Stack>
      </Box>
    </Stack>
  );
}
