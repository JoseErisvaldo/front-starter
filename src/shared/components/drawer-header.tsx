import type { ReactNode } from "react";
import {
  Box,
  Chip,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloseIcon from "@mui/icons-material/Close";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";

type Props = {
  title: string;
  subtitle: string;
  itemCount: number;
  onClose: () => void;
  closeLabel: string;
  icon?: ReactNode;
  leadingAction?: {
    ariaLabel: string;
    onClick: () => void;
  };
  closeOnly?: boolean;
};

export function DrawerHeader({
  title,
  subtitle,
  itemCount,
  onClose,
  closeLabel,
  icon,
  leadingAction,
  closeOnly = false,
}: Props) {
  return (
    <Stack
      component="header"
      direction="row"
      sx={{
        alignItems: "center",
        justifyContent: closeOnly ? "flex-end" : "flex-start",
        gap: 1.5,
        px: { xs: 2, sm: 3 },
        py: closeOnly ? 1 : 2.5,
        bgcolor: "background.paper",
        borderBottom: 1,
        borderColor: "divider",
      }}
    >
      {closeOnly ? (
        <IconButton aria-label={closeLabel} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : (
        <>
          <Box
            sx={{
              width: 44,
              height: 44,
              flexShrink: 0,
              display: "grid",
              placeItems: "center",
              borderRadius: 2,
              bgcolor: "rgba(40, 98, 77, 0.08)",
              color: "primary.main",
            }}
          >
            {leadingAction ? (
              <IconButton
                aria-label={leadingAction.ariaLabel}
                onClick={leadingAction.onClick}
                sx={{ width: "100%", height: "100%", borderRadius: 2 }}
              >
                <ArrowBackIcon />
              </IconButton>
            ) : (
              icon ?? <ShoppingBagOutlinedIcon />
            )}
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, lineHeight: 1.25 }}
            >
              {title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          </Box>
          <Chip
            size="small"
            label={`${itemCount} ${itemCount === 1 ? "item" : "itens"}`}
            color="primary"
            variant="filled"
          />
          <IconButton aria-label={closeLabel} onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </>
      )}
    </Stack>
  );
}
