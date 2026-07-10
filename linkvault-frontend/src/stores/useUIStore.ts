import { create } from "zustand"

interface UIState {
  sidebarOpen: boolean
  commandPaletteOpen: boolean
  commandSearch: string
  commandIndex: number
  theme: string
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
  setCommandPaletteOpen: (open: boolean) => void
  setCommandSearch: (search: string) => void
  setCommandIndex: (index: number | ((prev: number) => number)) => void
  setTheme: (theme: string) => void
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  commandPaletteOpen: false,
  commandSearch: "",
  commandIndex: 0,
  theme: "dark",
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open, commandSearch: "", commandIndex: 0 }),
  setCommandSearch: (search) => set({ commandSearch: search }),
  setCommandIndex: (index) => set((s) => ({ commandIndex: typeof index === "function" ? index(s.commandIndex) : index })),
  setTheme: (theme) => set({ theme }),
}))
