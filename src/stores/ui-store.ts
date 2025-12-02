import { create } from "zustand";

interface UiState {
  // Controls whether the mobile sidebar (off-canvas nav) is visible
  mobileSidebarOpen: boolean;
  // Explicitly open the mobile sidebar
  openMobileSidebar: () => void;
  // Explicitly close the mobile sidebar
  closeMobileSidebar: () => void;
  // Convenience toggle for the sidebar (used by hamburger button)
  toggleMobileSidebar: () => void;
}

// UI-only store for cross-cutting interface state
//
// This keeps layout concerns (like the mobile sidebar) out of component-local
// state, so topbar, sidebar, and layout can coordinate without prop drilling
export const useUiStore = create<UiState>((set) => ({
  mobileSidebarOpen: false,

  openMobileSidebar() {
    set({ mobileSidebarOpen: true });
  },

  closeMobileSidebar() {
    set({ mobileSidebarOpen: false });
  },

  toggleMobileSidebar() {
    // Use the functional form of set to avoid depending on stale state
    set((state) => ({ mobileSidebarOpen: !state.mobileSidebarOpen }));
  },
}));
