import { useState, type ReactNode } from 'react'
import { Box, useMediaQuery, useTheme } from '@mui/material'
import { MobileSidebarBar, SIDEBAR_WIDTH, Sidebar } from './sidebar/sidebar'
import { useSidebarStore } from './sidebar/sidebar.store'

type Props = {
  onLogout: () => void
  children: ReactNode
  mobileAction?: ReactNode
}

export function LayoutUser({ onLogout, children, mobileAction }: Props) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const expanded = useSidebarStore((state) => state.expanded)
  const toggle = useSidebarStore((state) => state.toggle)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f2f6f3' }}>
      {isMobile && <MobileSidebarBar onOpen={() => setMobileOpen(true)} action={mobileAction} />}
      <Sidebar
        role="USER"
        onLogout={onLogout}
        expanded={expanded}
        mobileOpen={mobileOpen}
        onToggle={toggle}
        onClose={() => setMobileOpen(false)}
      />
      <Box
        sx={{
          ml: isMobile ? 0 : expanded ? `${SIDEBAR_WIDTH.expanded}px` : `${SIDEBAR_WIDTH.collapsed}px`,
          minHeight: '100vh',
          pt: { xs: 9, sm: 0 },
        }}
      >
        {children}
      </Box>
    </Box>
  )
}
