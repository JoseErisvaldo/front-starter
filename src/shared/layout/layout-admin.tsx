import { useState, type ReactNode } from 'react'
import {
  Box,
  Button,
  Drawer,
  IconButton,
  Stack,
  SvgIcon,
  Typography,
} from '@mui/material'
import { SIDEBAR_WIDTH, Sidebar } from './sidebar/sidebar'

type DrawerAction = {
  id: string
  label: string
  title: string
  subtitle?: string
  content: ReactNode | ((controls: { close: () => void }) => ReactNode)
}

type Props = {
  title: string
  subtitle: string
  actions?: DrawerAction[]
  onLogout: () => void
  children: ReactNode
}

export function LayoutAdmin({ title, subtitle, actions = [], onLogout, children }: Props) {
  const [activeActionId, setActiveActionId] = useState<string | null>(null)
  const activeAction = actions.find((action) => action.id === activeActionId)
  const closeDrawer = () => setActiveActionId(null)

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f2f6f3' }}>
      <Sidebar onLogout={onLogout} />
      <Box
        component="main"
        sx={{
          ml: { xs: `${SIDEBAR_WIDTH.xs}px`, sm: `${SIDEBAR_WIDTH.sm}px` },
          minHeight: '100vh',
          p: { xs: 2, sm: 3, md: 5 },
        }}
      >
        <Stack spacing={3}>
          <Box
            sx={{
              display: 'flex',
              alignItems: { xs: 'flex-start', sm: 'center' },
              justifyContent: 'space-between',
              gap: 2,
              flexDirection: { xs: 'column', sm: 'row' },
            }}
          >
            <Box>
              <Typography variant="h4" component="h1" sx={{ color: '#173d30', fontWeight: 700 }}>
                {title}
              </Typography>
              <Typography color="text.secondary" sx={{ mt: 1 }}>
                {subtitle}
              </Typography>
            </Box>
            {actions.length > 0 && (
              <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
                {actions.map((action) => (
                  <Button
                    key={action.id}
                    variant="contained"
                    onClick={() => setActiveActionId(action.id)}
                  >
                    {action.label}
                  </Button>
                ))}
              </Stack>
            )}
          </Box>
          <Box>{children}</Box>
        </Stack>
      </Box>

      <Drawer
        anchor="right"
        open={Boolean(activeAction)}
        onClose={closeDrawer}
        aria-labelledby="admin-action-drawer-title"
        sx={{
          '& .MuiDrawer-paper': {
            width: { xs: '100%', sm: 480 },
            boxSizing: 'border-box',
            p: { xs: 2.5, sm: 3 },
          },
        }}
      >
        {activeAction && (
          <Stack spacing={3} sx={{ height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
              <Box>
                <Typography id="admin-action-drawer-title" variant="h5" component="h2">
                  {activeAction.title}
                </Typography>
                {activeAction.subtitle && (
                  <Typography color="text.secondary" sx={{ mt: 0.75 }}>
                    {activeAction.subtitle}
                  </Typography>
                )}
              </Box>
              <IconButton aria-label="Fechar" onClick={closeDrawer} edge="end">
                <SvgIcon>
                  <path d="M19 6.4 17.6 5 12 10.6 6.4 5 5 6.4l5.6 5.6L5 17.6 6.4 19l5.6-5.6 5.6 5.6 1.4-1.4-5.6-5.6z" />
                </SvgIcon>
              </IconButton>
            </Box>
            <Box sx={{ flex: 1, overflowY: 'auto' }}>
              {typeof activeAction.content === 'function'
                ? activeAction.content({ close: closeDrawer })
                : activeAction.content}
            </Box>
          </Stack>
        )}
      </Drawer>
    </Box>
  )
}
