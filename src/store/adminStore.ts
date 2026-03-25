import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ADMIN_DEFAULT_SIDEBAR_WIDTH } from "@/constants/adminLayout";

interface AdminState {
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  sidebarWidth: number;
  setSidebarOpen: (open: boolean) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebarCollapsed: () => void;
  setSidebarWidth: (value: number | ((current: number) => number)) => void;
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set) => ({
      sidebarOpen: false,
      sidebarCollapsed: false,
      sidebarWidth: ADMIN_DEFAULT_SIDEBAR_WIDTH,
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      toggleSidebarCollapsed: () =>
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setSidebarWidth: (value) =>
        set((state) => ({
          sidebarWidth:
            typeof value === "function" ? value(state.sidebarWidth) : value,
        })),
    }),
    {
      name: "portfolio-admin-layout",
      partialize: (state) => ({
        sidebarCollapsed: state.sidebarCollapsed,
        sidebarWidth: state.sidebarWidth,
      }),
    }
  )
);
