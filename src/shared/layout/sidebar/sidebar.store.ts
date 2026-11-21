import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

type SidebarState = {
  expanded: boolean
  setExpanded: (expanded: boolean) => void
  toggle: () => void
}

export const useSidebarStore = create<SidebarState>()(
  persist(
    (set) => ({
      expanded: true,
      setExpanded: (expanded) => set({ expanded }),
      toggle: () => set((state) => ({ expanded: !state.expanded })),
    }),
    {
      name: 'vitrite-admin-sidebar',
      storage: createJSONStorage(() => localStorage),
      partialize: ({ expanded }) => ({ expanded }),
    },
  ),
)
