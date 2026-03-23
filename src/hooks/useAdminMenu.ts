"use client";

export function useAdminMenu() {
  const onMenuClick = () => {
    if (typeof window !== "undefined" && (window as any).__adminMenuClick) {
      (window as any).__adminMenuClick();
    }
  };

  return { onMenuClick };
}
