"use client";
import { usePathname } from "next/navigation";
import { SessionProvider } from "next-auth/react";
import Sidebar from "@/components/admin/Sidebar";
import { useAdminStore } from "@/store/adminStore";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { sidebarOpen, setSidebarOpen } = useAdminStore();

  if (pathname === "/admin/login") {
    return <SessionProvider>{children}</SessionProvider>;
  }

  return (
    <SessionProvider>
      <div className="min-h-screen bg-background">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="lg:ml-64 min-h-screen">{children}</main>
      </div>
    </SessionProvider>
  );
}
