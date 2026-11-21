import {
  Box,
  Button,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  SvgIcon,
  Typography,
} from "@mui/material";
import { Link as RouterLink, useLocation } from "react-router-dom";

export const SIDEBAR_WIDTH = { xs: 80, sm: 280 };

export function BrandMark() {
  return (
    <Box
      aria-hidden="true"
      sx={{
        position: "relative",
        width: 34,
        height: 34,
        flexShrink: 0,
      }}
    >
      <Box
        sx={{
          width: "100%",
          height: "100%",
          display: "grid",
          placeItems: "center",
          borderRadius: "10px",
          bgcolor: "#26714f",
          boxShadow: "0 5px 14px rgba(24, 97, 69, .22)",
        }}
      >
        <SvgIcon sx={{ color: "#fff", fontSize: 22 }}>
          <path d="M19 6h-2a5 5 0 0 0-10 0H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2ZM9 6a3 3 0 0 1 6 0H9Zm3 8a4 4 0 0 1-4-4h2a2 2 0 0 0 4 0h2a4 4 0 0 1-4 4Z" />
        </SvgIcon>
      </Box>
      <Box
        sx={{
          position: "absolute",
          right: -4,
          bottom: -3,
          width: 16,
          height: 16,
          display: "grid",
          placeItems: "center",
          border: "2px solid #fff",
          borderRadius: "50%",
          bgcolor: "#dcefe3",
          color: "#1d6848",
        }}
      >
        <SvgIcon sx={{ fontSize: 11 }}>
          <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8ZM6 12c0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3c-3.31 0-6-2.69-6-6Z" />
        </SvgIcon>
      </Box>
    </Box>
  );
}

type Props = {
  onLogout: () => void;
};

export function Sidebar({ onLogout }: Props) {
  const { pathname } = useLocation();

  return (
    <Drawer
      variant="permanent"
      aria-label="Navegação administrativa"
      sx={{
        width: SIDEBAR_WIDTH,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: SIDEBAR_WIDTH,
          boxSizing: "border-box",
          px: { xs: 1.5, sm: 2.5 },
          bgcolor: "#fff",
          borderRight: "1px solid #e3e9e4",
        },
      }}
    >
      <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, px: { xs: 0.5, sm: 0.75 }, py: 3 }}>
          <BrandMark />
          <Typography
            variant="h6"
            sx={{ display: { xs: "none", sm: "block" }, color: "#24362c", fontWeight: 750, letterSpacing: "-.03em" }}
          >
            Vitrite
          </Typography>
        </Box>

        <Typography
          variant="overline"
          sx={{ px: 1, mt: 2, mb: 1, color: "#89988d", fontSize: 10, fontWeight: 700, letterSpacing: ".12em", display: { xs: "none", sm: "block" } }}
        >
          ESPAÇO DE TRABALHO
        </Typography>
        <List disablePadding>
          <ListItemButton
            component={RouterLink}
            to="/admin"
            selected={pathname === "/admin"}
            aria-label="Início"
            sx={{
              minHeight: 48,
              borderRadius: 2,
              px: { xs: 1.5, sm: 2 },
              color: "#66766b",
              "&:hover": { bgcolor: "#edf6ef", color: "#1d6848" },
              "&.Mui-selected": { bgcolor: "#e1f0e5", color: "#1d6848" },
              "&.Mui-selected:hover": { bgcolor: "#d5eadb", color: "#17583d" },
            }}
          >
            <ListItemIcon sx={{ minWidth: { xs: 0, sm: 36 }, color: "inherit" }}>
              <SvgIcon>
                <path d="M3 3h8v8H3V3zm10 0h8v5h-8V3zM3 13h8v8H3v-8zm10-3h8v11h-8V10z" />
              </SvgIcon>
            </ListItemIcon>
            <ListItemText
              primary="Início"
              sx={{ display: { xs: "none", sm: "block" }, "& .MuiTypography-root": { fontSize: 14, fontWeight: 700 } }}
            />
          </ListItemButton>
        <ListItemButton
          component={RouterLink}
          to="/admin/conta"
          selected={pathname === "/admin/conta"}
          aria-label="Minha conta"
          sx={{
            minHeight: 48,
            mt: 0.5,
            borderRadius: 2,
            px: { xs: 1.5, sm: 2 },
            color: "#66766b",
            "&:hover": { bgcolor: "#edf6ef", color: "#1d6848" },
            "&.Mui-selected": { bgcolor: "#e1f0e5", color: "#1d6848" },
            "&.Mui-selected:hover": { bgcolor: "#d5eadb", color: "#17583d" },
          }}
        >
          <ListItemIcon sx={{ minWidth: { xs: 0, sm: 36 }, color: "inherit" }}>
            <SvgIcon>
              <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10zm0 2c-4.42 0-8 2.24-8 5v3h16v-3c0-2.76-3.58-5-8-5z" />
            </SvgIcon>
          </ListItemIcon>
          <ListItemText
            primary="Minha conta"
            sx={{ display: { xs: "none", sm: "block" }, "& .MuiTypography-root": { fontSize: 14, fontWeight: 700 } }}
          />
        </ListItemButton>
        </List>

        <Box sx={{ flex: 1 }} />
        <Box sx={{ borderTop: "1px solid #e3e9e4", py: 1.5 }}>
          <Button
            fullWidth
            onClick={onLogout}
            aria-label="Sair da conta"
            startIcon={
              <SvgIcon>
                <path d="M10 17v-3H3v-4h7V7l5 5-5 5zm9-14H5a2 2 0 0 0-2 2v3h2V5h14v14H5v-3H3v3a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z" />
              </SvgIcon>
            }
            sx={{
              justifyContent: { xs: "center", sm: "flex-start" },
              minHeight: 46,
              px: { xs: 1, sm: 2 },
              color: "#66766b",
              "&:hover": { bgcolor: "#edf6ef", color: "#1d6848" },
              "& .MuiButton-startIcon": { mr: { xs: 0, sm: 1.5 } },
            }}
          >
            <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
              Sair da conta
            </Box>
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
}
