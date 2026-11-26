import { useState } from 'react'
import { useMediaQuery, useTheme } from '@mui/material'
import { useSidebarStore } from '../../../../../shared/layout/sidebar/sidebar.store'

export function useAdminAccountPage() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const sidebarExpanded = useSidebarStore((state) => state.expanded)
  const toggleSidebar = useSidebarStore((state) => state.toggle)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  return {
    isMobile,
    sidebarExpanded,
    toggleSidebar,
    mobileSidebarOpen,
    openMobileSidebar: () => setMobileSidebarOpen(true),
    closeMobileSidebar: () => setMobileSidebarOpen(false),
  }
}
