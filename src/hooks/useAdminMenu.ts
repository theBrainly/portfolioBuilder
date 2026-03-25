"use client";

import { useAdminStore } from "@/store/adminStore";

export function useAdminMenu() {
  const setSidebarOpen = useAdminStore((state) => state.setSidebarOpen);
  const toggleSidebarCollapsed = useAdminStore(
    (state) => state.toggleSidebarCollapsed
  );

  const onMenuClick = () => {
    if (typeof window !== "undefined" && window.innerWidth >= 1024) {
      toggleSidebarCollapsed();
      return;
    }

    setSidebarOpen(true);
  };

  return { onMenuClick };
}
