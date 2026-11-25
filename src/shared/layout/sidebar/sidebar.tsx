import {
  Box,
  Button,
  Collapse,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  SvgIcon,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { useEffect, type ReactNode } from "react";
import { useSidebarStore } from "./sidebar.store";

export const SIDEBAR_WIDTH = { collapsed: 80, expanded: 280 };

type MobileSidebarBarProps = {
  onOpen: () => void;
  action?: ReactNode;
};

export function MobileSidebarBar({ onOpen, action }: MobileSidebarBarProps) {
  return (
    <Box
      component="header"
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: (theme) => theme.zIndex.appBar,
        height: 56,
        display: "flex",
        alignItems: "center",
        px: 2,
        bgcolor: "#fff",
        borderBottom: "1px solid #e3e9e4",
      }}
    >
      <Box sx={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <IconButton aria-label="Abrir menu" onClick={onOpen}>
          <SvgIcon>
            <path d="M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z" />
          </SvgIcon>
        </IconButton>
        {action}
      </Box>
    </Box>
  );
}

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
  role?: "USER" | "ADMIN" | "MODERATOR";
  expanded: boolean;
  mobileOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
};

export function Sidebar({ onLogout, role = "ADMIN", expanded, mobileOpen, onToggle, onClose }: Props) {
  const { pathname } = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const showLabels = isMobile || expanded;
  const isUser = role === "USER";
  const openGroups = useSidebarStore((state) => state.openGroups);
  const toggleGroup = useSidebarStore((state) => state.toggleGroup);
  const isGroupOpen = (groupId: string) => openGroups[groupId] ?? true;
  const userGroups = isUser
    ? [
        {
          id: "customer-store",
          label: "LOJA",
          routes: [
            { label: "Produtos", to: "/produtos", icon: <path d="M20 6h-3V4a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v2H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2ZM9 4h6v2H9V4zm11 16H4V8h3v2h2V8h6v2h2V8h3v12z" /> },
            { label: "Meus pedidos", to: "/pedidos", icon: <path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Zm0 16H5V5h14v14ZM7 7h10v2H7zm0 4h10v2H7zm0 4h6v2H7z" /> },
          ],
        },
        {
          id: "customer-recurring",
          label: "RECORRÊNCIA",
          routes: [
            { label: "Planos de assinaturas", to: "/assinaturas", icon: <path d="M12 6V3L8 7l4 4V8c2.21 0 4 1.79 4 4 0 .73-.2 1.41-.54 2h2.31c.15-.63.23-1.3.23-2 0-3.31-2.69-6-6-6zm-4 6c0-.73.2-1.41.54-2H6.23C6.08 10.63 6 11.3 6 12c0 3.31 2.69 6 6 6v3l4-4-4-4v3c-2.21 0-4-1.79-4-4z" /> },
            { label: "Minhas assinaturas", to: "/minhas-assinaturas", icon: <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3ZM8 11c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3Zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5C15 14.17 10.33 13 8 13Zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.98 1.97 3.45V19h7v-2.5c0-2.33-4.67-3.5-8-3.5Z" /> },
          ],
        },
        {
          id: "customer-account",
          label: "CONTA",
          routes: [
            { label: "Minha conta", to: "/conta", icon: <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10zm0 2c-4.42 0-8 2.24-8 5v3h16v-3c0-2.76-3.58-5-8-5z" /> },
          ],
        },
      ]
    : [];

  useEffect(() => {
    if (isMobile && mobileOpen) onClose();
  }, [pathname]);

  return (
    <Drawer
      variant={isMobile ? "temporary" : "permanent"}
      open={isMobile ? mobileOpen : true}
      onClose={onClose}
      aria-label="Navegação principal"
      sx={{
        width: isMobile ? 0 : expanded ? SIDEBAR_WIDTH.expanded : SIDEBAR_WIDTH.collapsed,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: isMobile || expanded ? SIDEBAR_WIDTH.expanded : SIDEBAR_WIDTH.collapsed,
          boxSizing: "border-box",
          px: showLabels ? 2.5 : 1.5,
          bgcolor: "#fff",
          borderRight: "1px solid #e3e9e4",
        },
      }}
    >
      <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: showLabels ? "row" : "column",
            alignItems: "center",
            justifyContent: showLabels ? "space-between" : "center",
            gap: showLabels ? 1 : 1.5,
            px: 0.25,
            py: 3,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, minWidth: 0 }}>
            <BrandMark />
            <Typography
              variant="h6"
              sx={{ display: showLabels ? "block" : "none", color: "#24362c", fontWeight: 750, letterSpacing: "-.03em" }}
            >
              Vitrite
            </Typography>
          </Box>
          <IconButton
            size="small"
            aria-label={isMobile ? "Fechar menu" : expanded ? "Recolher menu" : "Expandir menu"}
            onClick={isMobile ? onClose : onToggle}
            sx={{ flexShrink: 0 }}
          >
            <SvgIcon>
              {isMobile || expanded ? (
                <path d="M19 6.4 17.6 5 12 10.6 6.4 5 5 6.4l5.6 5.6L5 17.6 6.4 19l5.6-5.6 5.6 5.6 1.4-1.4-5.6-5.6z" />
              ) : (
                <path d="M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z" />
              )}
            </SvgIcon>
          </IconButton>
        </Box>

        <Typography
          variant="overline"
          sx={{ px: 1, mt: 2, mb: 1, color: "#89988d", fontSize: 10, fontWeight: 700, letterSpacing: ".12em", display: showLabels ? "block" : "none" }}
        >
          {isUser ? "MINHA CONTA" : "ESPAÇO DE TRABALHO"}
        </Typography>
        <List disablePadding>
          {userGroups.map((group) => (
            <Box key={group.id}>
              {showLabels && (
                <ListItemButton
                  aria-expanded={isGroupOpen(group.id)}
                  aria-controls={`sidebar-group-${group.id}`}
                  onClick={() => toggleGroup(group.id)}
                  sx={{ minHeight: 36, mt: 1.5, px: 1, color: "#89988d" }}
                >
                  <Typography variant="overline" sx={{ flex: 1, fontSize: 10, fontWeight: 700, letterSpacing: ".12em" }}>
                    {group.label}
                  </Typography>
                  <SvgIcon sx={{ fontSize: 18, transform: isGroupOpen(group.id) ? "rotate(180deg)" : "none", transition: "transform .2s" }}>
                    <path d="m7.41 8.59 4.59 4.58 4.59-4.58L18 10l-6 6-6-6z" />
                  </SvgIcon>
                </ListItemButton>
              )}
              <Collapse
                id={`sidebar-group-${group.id}`}
                in={!showLabels || isGroupOpen(group.id)}
                timeout="auto"
                unmountOnExit={showLabels}
              >
                <Box>
                  {group.routes.map(({ label, to, icon }) => (
                    <ListItemButton
                      key={to}
                      component={RouterLink}
                      to={to}
                      selected={pathname === to}
                      aria-label={label}
                      sx={{
                        minHeight: 48, mt: 0.5, borderRadius: 2,
                        px: showLabels ? 2 : 1.5, color: "#66766b",
                        "&:hover": { bgcolor: "#edf6ef", color: "#1d6848" },
                        "&.Mui-selected": { bgcolor: "#e1f0e5", color: "#1d6848" },
                        "&.Mui-selected:hover": { bgcolor: "#d5eadb", color: "#17583d" },
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: showLabels ? 36 : 0, color: "inherit" }}><SvgIcon>{icon}</SvgIcon></ListItemIcon>
                      <ListItemText primary={label} sx={{ display: showLabels ? "block" : "none", "& .MuiTypography-root": { fontSize: 14, fontWeight: 700 } }} />
                    </ListItemButton>
                  ))}
                </Box>
              </Collapse>
            </Box>
          ))}
          {!isUser && <>
          <ListItemButton
            component={RouterLink}
            to="/admin"
            selected={pathname === "/admin"}
            aria-label="Início"
            sx={{
              minHeight: 48,
              borderRadius: 2,
              px: showLabels ? 2 : 1.5,
              color: "#66766b",
              "&:hover": { bgcolor: "#edf6ef", color: "#1d6848" },
              "&.Mui-selected": { bgcolor: "#e1f0e5", color: "#1d6848" },
              "&.Mui-selected:hover": { bgcolor: "#d5eadb", color: "#17583d" },
            }}
          >
            <ListItemIcon sx={{ minWidth: showLabels ? 36 : 0, color: "inherit" }}>
              <SvgIcon>
                <path d="M3 3h8v8H3V3zm10 0h8v5h-8V3zM3 13h8v8H3v-8zm10-3h8v11h-8V10z" />
              </SvgIcon>
            </ListItemIcon>
            <ListItemText
              primary="Início"
              sx={{ display: showLabels ? "block" : "none", "& .MuiTypography-root": { fontSize: 14, fontWeight: 700 } }}
            />
          </ListItemButton>
          {showLabels && (
            <ListItemButton
              aria-expanded={isGroupOpen("dashboard")}
              onClick={() => toggleGroup("dashboard")}
              sx={{ minHeight: 36, mt: 1.5, px: 1, color: "#89988d" }}
            >
              <Typography variant="overline" sx={{ flex: 1, fontSize: 10, fontWeight: 700, letterSpacing: ".12em" }}>
                DASHBOARD
              </Typography>
              <SvgIcon sx={{ fontSize: 18, transform: isGroupOpen("dashboard") ? "rotate(180deg)" : "none", transition: "transform .2s" }}>
                <path d="m7.41 8.59 4.59 4.58 4.59-4.58L18 10l-6 6-6-6z" />
              </SvgIcon>
            </ListItemButton>
          )}
          <Collapse in={!showLabels || isGroupOpen("dashboard")} timeout="auto" unmountOnExit={showLabels}>
            <ListItemButton
              component={RouterLink}
              to="/admin/dashboard/pedidos"
              selected={pathname === "/admin/dashboard/pedidos"}
              aria-label="Dashboard de pedidos"
              sx={{
                minHeight: 48, mt: 0.5, borderRadius: 2,
                px: showLabels ? 2 : 1.5, color: "#66766b",
                "&:hover": { bgcolor: "#edf6ef", color: "#1d6848" },
                "&.Mui-selected": { bgcolor: "#e1f0e5", color: "#1d6848" },
                "&.Mui-selected:hover": { bgcolor: "#d5eadb", color: "#17583d" },
              }}
            >
              <ListItemIcon sx={{ minWidth: showLabels ? 36 : 0, color: "inherit" }}>
                <SvgIcon><path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Zm0 16H5V5h14v14ZM7 7h10v2H7zm0 4h10v2H7zm0 4h6v2H7z" /></SvgIcon>
              </ListItemIcon>
              <ListItemText
                primary="Pedidos"
                sx={{ display: showLabels ? "block" : "none", "& .MuiTypography-root": { fontSize: 14, fontWeight: 700 } }}
              />
            </ListItemButton>
            <ListItemButton
              component={RouterLink}
              to="/admin/dashboard/clientes"
              selected={pathname === "/admin/dashboard/clientes"}
              aria-label="Dashboard de clientes"
              sx={{
                minHeight: 48, mt: 0.5, borderRadius: 2,
                px: showLabels ? 2 : 1.5, color: "#66766b",
                "&:hover": { bgcolor: "#edf6ef", color: "#1d6848" },
                "&.Mui-selected": { bgcolor: "#e1f0e5", color: "#1d6848" },
                "&.Mui-selected:hover": { bgcolor: "#d5eadb", color: "#17583d" },
              }}
            >
              <ListItemIcon sx={{ minWidth: showLabels ? 36 : 0, color: "inherit" }}>
                <SvgIcon><path d="M3 3h18v2H3zm2 4h3v12H5zm5 5h3v7h-3zm5-4h3v11h-3z" /></SvgIcon>
              </ListItemIcon>
              <ListItemText
                primary="Clientes"
                sx={{ display: showLabels ? "block" : "none", "& .MuiTypography-root": { fontSize: 14, fontWeight: 700 } }}
              />
            </ListItemButton>
            <ListItemButton
              component={RouterLink}
              to="/admin/dashboard/assinaturas"
              selected={pathname === "/admin/dashboard/assinaturas"}
              aria-label="Dashboard de assinaturas"
              sx={{
                minHeight: 48, mt: 0.5, borderRadius: 2,
                px: showLabels ? 2 : 1.5, color: "#66766b",
                "&:hover": { bgcolor: "#edf6ef", color: "#1d6848" },
                "&.Mui-selected": { bgcolor: "#e1f0e5", color: "#1d6848" },
                "&.Mui-selected:hover": { bgcolor: "#d5eadb", color: "#17583d" },
              }}
            >
              <ListItemIcon sx={{ minWidth: showLabels ? 36 : 0, color: "inherit" }}>
                <SvgIcon><path d="M4 4h16v16H4zm2 2v12h12V6zm2 7h2v3H8zm3-4h2v7h-2zm3 2h2v5h-2z" /></SvgIcon>
              </ListItemIcon>
              <ListItemText
                primary="Assinaturas"
                sx={{ display: showLabels ? "block" : "none", "& .MuiTypography-root": { fontSize: 14, fontWeight: 700 } }}
              />
            </ListItemButton>
          </Collapse>
        {showLabels && (
            <ListItemButton
              aria-expanded={isGroupOpen("sales")}
              onClick={() => toggleGroup("sales")}
              sx={{ minHeight: 36, mt: 1.5, px: 1, color: "#89988d" }}
            >
              <Typography variant="overline" sx={{ flex: 1, fontSize: 10, fontWeight: 700, letterSpacing: ".12em" }}>
                VENDAS
              </Typography>
              <SvgIcon sx={{ fontSize: 18, transform: isGroupOpen("sales") ? "rotate(180deg)" : "none", transition: "transform .2s" }}>
                <path d="m7.41 8.59 4.59 4.58 4.59-4.58L18 10l-6 6-6-6z" />
              </SvgIcon>
            </ListItemButton>
        )}
        <Collapse in={!showLabels || isGroupOpen("sales")} timeout="auto" unmountOnExit={showLabels}>
            <Box>
        <ListItemButton
            component={RouterLink}
            to="/admin/produtos"
          selected={pathname === "/admin/produtos"}
          aria-label="Produtos"
          sx={{
            minHeight: 48,
            mt: 0.5,
            borderRadius: 2,
            px: showLabels ? 2 : 1.5,
            color: "#66766b",
            "&:hover": { bgcolor: "#edf6ef", color: "#1d6848" },
            "&.Mui-selected": { bgcolor: "#e1f0e5", color: "#1d6848" },
            "&.Mui-selected:hover": { bgcolor: "#d5eadb", color: "#17583d" },
          }}
        >
          <ListItemIcon sx={{ minWidth: showLabels ? 36 : 0, color: "inherit" }}>
            <SvgIcon>
              <path d="M20 6h-3V4a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v2H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2ZM9 4h6v2H9V4zm11 16H4V8h3v2h2V8h6v2h2V8h3v12z" />
            </SvgIcon>
          </ListItemIcon>
          <ListItemText
            primary="Produtos"
            sx={{ display: showLabels ? "block" : "none", "& .MuiTypography-root": { fontSize: 14, fontWeight: 700 } }}
          />
        </ListItemButton>
        <ListItemButton
          component={RouterLink}
          to="/admin/pedidos"
          selected={pathname === "/admin/pedidos"}
          aria-label="Pedidos"
          sx={{
            minHeight: 48,
            mt: 0.5,
            borderRadius: 2,
            px: showLabels ? 2 : 1.5,
            color: "#66766b",
            "&:hover": { bgcolor: "#edf6ef", color: "#1d6848" },
            "&.Mui-selected": { bgcolor: "#e1f0e5", color: "#1d6848" },
            "&.Mui-selected:hover": { bgcolor: "#d5eadb", color: "#17583d" },
          }}
        >
          <ListItemIcon sx={{ minWidth: showLabels ? 36 : 0, color: "inherit" }}>
            <SvgIcon>
              <path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Zm0 16H5V5h14v14ZM7 7h10v2H7zm0 4h10v2H7zm0 4h6v2H7z" />
            </SvgIcon>
          </ListItemIcon>
          <ListItemText
            primary="Pedidos"
            sx={{ display: showLabels ? "block" : "none", "& .MuiTypography-root": { fontSize: 14, fontWeight: 700 } }}
          />
        </ListItemButton>
          </Box>
        </Collapse>
        {showLabels && (
          <ListItemButton
            aria-expanded={isGroupOpen("customers")}
            onClick={() => toggleGroup("customers")}
            sx={{ minHeight: 36, mt: 1.5, px: 1, color: "#89988d" }}
          >
            <Typography variant="overline" sx={{ flex: 1, fontSize: 10, fontWeight: 700, letterSpacing: ".12em" }}>
              CLIENTES
            </Typography>
            <SvgIcon sx={{ fontSize: 18, transform: isGroupOpen("customers") ? "rotate(180deg)" : "none", transition: "transform .2s" }}>
              <path d="m7.41 8.59 4.59 4.58 4.59-4.58L18 10l-6 6-6-6z" />
            </SvgIcon>
          </ListItemButton>
        )}
        <Collapse in={!showLabels || isGroupOpen("customers")} timeout="auto" unmountOnExit={showLabels}>
          <ListItemButton
            component={RouterLink}
            to="/admin/clientes"
            selected={pathname === "/admin/clientes"}
            aria-label="Todos os clientes"
            sx={{
              minHeight: 48,
              mt: 0.5,
              borderRadius: 2,
              px: showLabels ? 2 : 1.5,
              color: "#66766b",
              "&:hover": { bgcolor: "#edf6ef", color: "#1d6848" },
              "&.Mui-selected": { bgcolor: "#e1f0e5", color: "#1d6848" },
              "&.Mui-selected:hover": { bgcolor: "#d5eadb", color: "#17583d" },
            }}
          >
            <ListItemIcon sx={{ minWidth: showLabels ? 36 : 0, color: "inherit" }}>
              <SvgIcon>
                <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3ZM8 11c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3Zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5C15 14.17 10.33 13 8 13Zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.98 1.97 3.45V19h7v-2.5c0-2.33-4.67-3.5-8-3.5Z" />
              </SvgIcon>
            </ListItemIcon>
            <ListItemText
              primary="Todos os clientes"
              sx={{ display: showLabels ? "block" : "none", "& .MuiTypography-root": { fontSize: 14, fontWeight: 700 } }}
            />
          </ListItemButton>
        </Collapse>
        {showLabels && (
          <ListItemButton
            aria-expanded={isGroupOpen("subscriptions")}
            onClick={() => toggleGroup("subscriptions")}
            sx={{ minHeight: 36, mt: 1.5, px: 1, color: "#89988d" }}
          >
            <Typography variant="overline" sx={{ flex: 1, fontSize: 10, fontWeight: 700, letterSpacing: ".12em" }}>
              RECORRÊNCIA
            </Typography>
            <SvgIcon sx={{ fontSize: 18, transform: isGroupOpen("subscriptions") ? "rotate(180deg)" : "none", transition: "transform .2s" }}>
              <path d="m7.41 8.59 4.59 4.58 4.59-4.58L18 10l-6 6-6-6z" />
            </SvgIcon>
          </ListItemButton>
        )}
        <Collapse in={!showLabels || isGroupOpen("subscriptions")} timeout="auto" unmountOnExit={showLabels}>
          <Box>
        <ListItemButton
        component={RouterLink}
        to="/admin/assinaturas"
        selected={pathname === "/admin/assinaturas"}
        aria-label="Assinaturas"
        sx={{
          minHeight: 48,
          mt: 0.5,
          borderRadius: 2,
          px: showLabels ? 2 : 1.5,
          color: "#66766b",
          "&:hover": { bgcolor: "#edf6ef", color: "#1d6848" },
          "&.Mui-selected": { bgcolor: "#e1f0e5", color: "#1d6848" },
          "&.Mui-selected:hover": { bgcolor: "#d5eadb", color: "#17583d" },
        }}
        >
        <ListItemIcon sx={{ minWidth: showLabels ? 36 : 0, color: "inherit" }}>
          <SvgIcon><path d="M12 6V3L8 7l4 4V8c2.21 0 4 1.79 4 4 0 .73-.2 1.41-.54 2h2.31c.15-.63.23-1.3.23-2 0-3.31-2.69-6-6-6zm-4 6c0-.73.2-1.41.54-2H6.23C6.08 10.63 6 11.3 6 12c0 3.31 2.69 6 6 6v3l4-4-4-4v3c-2.21 0-4-1.79-4-4z" /></SvgIcon>
        </ListItemIcon>
        <ListItemText primary="Assinaturas" sx={{ display: showLabels ? "block" : "none", "& .MuiTypography-root": { fontSize: 14, fontWeight: 700 } }} />
        </ListItemButton>
        <ListItemButton
          component={RouterLink}
          to="/admin/assinantes"
          selected={pathname === "/admin/assinantes"}
          aria-label="Assinantes"
          sx={{
            minHeight: 48,
            mt: 0.5,
            borderRadius: 2,
            px: showLabels ? 2 : 1.5,
            color: "#66766b",
            "&:hover": { bgcolor: "#edf6ef", color: "#1d6848" },
            "&.Mui-selected": { bgcolor: "#e1f0e5", color: "#1d6848" },
            "&.Mui-selected:hover": { bgcolor: "#d5eadb", color: "#17583d" },
          }}
        >
          <ListItemIcon sx={{ minWidth: showLabels ? 36 : 0, color: "inherit" }}>
            <SvgIcon>
              <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3ZM8 11c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3Zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5C15 14.17 10.33 13 8 13Zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.98 1.97 3.45V19h7v-2.5c0-2.33-4.67-3.5-8-3.5Z" />
            </SvgIcon>
          </ListItemIcon>
          <ListItemText
            primary="Assinantes"
            sx={{ display: showLabels ? "block" : "none", "& .MuiTypography-root": { fontSize: 14, fontWeight: 700 } }}
          />
        </ListItemButton>
          </Box>
        </Collapse>
        {showLabels && (
          <ListItemButton
            aria-expanded={isGroupOpen("account")}
            onClick={() => toggleGroup("account")}
            sx={{ minHeight: 36, mt: 1.5, px: 1, color: "#89988d" }}
          >
            <Typography variant="overline" sx={{ flex: 1, fontSize: 10, fontWeight: 700, letterSpacing: ".12em" }}>
              CONTA
            </Typography>
            <SvgIcon sx={{ fontSize: 18, transform: isGroupOpen("account") ? "rotate(180deg)" : "none", transition: "transform .2s" }}>
              <path d="m7.41 8.59 4.59 4.58 4.59-4.58L18 10l-6 6-6-6z" />
            </SvgIcon>
          </ListItemButton>
        )}
        <Collapse in={!showLabels || isGroupOpen("account")} timeout="auto" unmountOnExit={showLabels}>
          <Box>
        <ListItemButton
          component={RouterLink}
          to="/admin/conta"
          selected={pathname === "/admin/conta"}
          aria-label="Minha conta"
          sx={{
            minHeight: 48,
            mt: 0.5,
            borderRadius: 2,
            px: showLabels ? 2 : 1.5,
            color: "#66766b",
            "&:hover": { bgcolor: "#edf6ef", color: "#1d6848" },
            "&.Mui-selected": { bgcolor: "#e1f0e5", color: "#1d6848" },
            "&.Mui-selected:hover": { bgcolor: "#d5eadb", color: "#17583d" },
          }}
        >
          <ListItemIcon sx={{ minWidth: showLabels ? 36 : 0, color: "inherit" }}>
            <SvgIcon>
              <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10zm0 2c-4.42 0-8 2.24-8 5v3h16v-3c0-2.76-3.58-5-8-5z" />
            </SvgIcon>
          </ListItemIcon>
          <ListItemText
            primary="Minha conta"
            sx={{ display: showLabels ? "block" : "none", "& .MuiTypography-root": { fontSize: 14, fontWeight: 700 } }}
          />
        </ListItemButton>
          </Box>
        </Collapse>
          </>}
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
              justifyContent: showLabels ? "flex-start" : "center",
              minHeight: 46,
              px: showLabels ? 2 : 1,
              color: "#66766b",
              "&:hover": { bgcolor: "#edf6ef", color: "#1d6848" },
              "& .MuiButton-startIcon": { mr: showLabels ? 1.5 : 0 },
            }}
          >
            <Box component="span" sx={{ display: showLabels ? "inline" : "none" }}>
              Sair da conta
            </Box>
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
}
