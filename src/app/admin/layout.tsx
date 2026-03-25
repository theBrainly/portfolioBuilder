"use client";
import { usePathname } from "next/navigation";
import { SessionProvider } from "next-auth/react";
import Sidebar from "@/components/admin/Sidebar";
import { useAdminStore } from "@/store/adminStore";
import { cn } from "@/lib/utils";
import { ADMIN_COLLAPSED_SIDEBAR_WIDTH } from "@/constants/adminLayout";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { sidebarOpen, sidebarCollapsed, sidebarWidth, setSidebarOpen, setSidebarWidth } =
    useAdminStore();

  if (pathname === "/admin/login") {
    return <SessionProvider>{children}</SessionProvider>;
  }

  const desktopSidebarWidth = sidebarCollapsed
    ? ADMIN_COLLAPSED_SIDEBAR_WIDTH
    : sidebarWidth;
  const layoutStyle = {
    "--admin-sidebar-width": `${desktopSidebarWidth}px`,
  } as React.CSSProperties;

  return (
    <SessionProvider>
      <div className="min-h-screen bg-background" style={layoutStyle}>
        <Sidebar
          isOpen={sidebarOpen}
          isCollapsed={sidebarCollapsed}
          desktopWidth={desktopSidebarWidth}
          onClose={() => setSidebarOpen(false)}
          onWidthChange={setSidebarWidth}
        />
        <main
          className={cn(
            "min-h-screen transition-[margin] duration-300 lg:ml-[var(--admin-sidebar-width)]"
          )}
        >
          {children}
        </main>
      </div>
    </SessionProvider>
  );
}
