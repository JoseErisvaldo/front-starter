import {
  Box,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import {
  paymentMethodOptions,
  type PaymentMethod,
} from "../../constants/payment-method-options";

type Props = {
  value: PaymentMethod;
  onChange: (method: PaymentMethod) => void;
};

export function PaymentMethodSelector({ value, onChange }: Props) {
  return (
    <FormControl fullWidth>
      <RadioGroup
        value={value}
        onChange={(event) => {
          const method = event.target.value;
          if (method === "pix" || method === "card") onChange(method);
        }}
        aria-label="Forma de pagamento"
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, minmax(0, 1fr))",
          },
          gap: 1,
        }}
      >
        {paymentMethodOptions.map((option) => (
          <FormControlLabel
            key={option.value}
            value={option.value}
            control={
              <Radio
                icon={
                  <Box
                    aria-hidden="true"
                    sx={{
                      width: 20,
                      height: 20,
                      border: 1,
                      borderColor: "divider",
                      borderRadius: 0.75,
                    }}
                  />
                }
                checkedIcon={
                  <Box
                    aria-hidden="true"
                    sx={{
                      width: 20,
                      height: 20,
                      display: "grid",
                      placeItems: "center",
                      bgcolor: "primary.main",
                      color: "primary.contrastText",
                      borderRadius: 0.75,
                      fontSize: 14,
                      lineHeight: 1,
                    }}
                  >
                    ✓
                  </Box>
                }
              />
            }
            label={
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {option.title}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {option.description}
                </Typography>
              </Box>
            }
            sx={{
              m: 0,
              p: 1,
              border: 1,
              borderColor: value === option.value ? "primary.main" : "divider",
              borderRadius: 1,
              bgcolor:
                value === option.value
                  ? "rgba(40, 98, 77, 0.05)"
                  : "background.paper",
              "& .MuiFormControlLabel-label": { flex: 1 },
            }}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
}
