import { Step, StepLabel, Stepper } from "@mui/material";

const checkoutSteps = ["Carrinho", "Revisar pedido", "Pagamento"];

type Props = {
  activeStep: number;
};

export function CheckoutProgressStepper({ activeStep }: Props) {
  return (
    <Stepper
      activeStep={activeStep}
      alternativeLabel
      sx={{
        mb: 3,
        px: 0,
        "& .MuiStepConnector-root": { top: 16 },
        "& .MuiStepConnector-line": {
          borderTopWidth: 6,
          borderColor: "divider",
          borderRadius: 3,
        },
        "& .MuiStepLabel-label": {
          mt: 1,
          fontSize: { xs: "0.65rem", sm: "0.75rem" },
          whiteSpace: "nowrap",
        },
        "& .MuiStepIcon-root": {
          fontSize: 34,
          color: "action.disabledBackground",
        },
        "& .MuiStepIcon-root.Mui-active, & .MuiStepIcon-root.Mui-completed": {
          color: "primary.main",
        },
        "& .MuiStepIcon-text": { fill: "common.white" },
      }}
    >
      {checkoutSteps.map((label) => (
        <Step key={label}>
          <StepLabel>{label}</StepLabel>
        </Step>
      ))}
    </Stepper>
  );
}
