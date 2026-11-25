import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

type SidebarState = {
  expanded: boolean
  openGroups: Record<string, boolean>
  setExpanded: (expanded: boolean) => void
  toggle: () => void
  toggleGroup: (groupId: string) => void
}

export const useSidebarStore = create<SidebarState>()(
  persist(
    (set) => ({
      expanded: true,
      openGroups: {},
      setExpanded: (expanded) => set({ expanded }),
      toggle: () => set((state) => ({ expanded: !state.expanded })),
      toggleGroup: (groupId) => set((state) => ({
        openGroups: {
          ...state.openGroups,
          [groupId]: !(state.openGroups[groupId] ?? false),
        },
      })),
    }),
    {
      name: 'vitrite-admin-sidebar',
      storage: createJSONStorage(() => localStorage),
      partialize: ({ expanded, openGroups }) => ({ expanded, openGroups }),
    },
  ),
)
