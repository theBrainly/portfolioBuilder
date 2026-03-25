"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import DragResizeHandle from "@/components/ui/DragResizeHandle";
import { getPortfolioHomePath } from "@/lib/portfolioUrl";
import {
  ADMIN_MAX_SIDEBAR_WIDTH,
  ADMIN_MIN_SIDEBAR_WIDTH,
} from "@/constants/adminLayout";
import { LayoutDashboard, FolderKanban, Briefcase, Wrench, MessageSquareQuote, Mail, Settings, LogOut, Code2, X } from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Projects", href: "/admin/projects", icon: FolderKanban },
  { label: "Experience", href: "/admin/experience", icon: Briefcase },
  { label: "Skills", href: "/admin/skills", icon: Wrench },
  { label: "Testimonials", href: "/admin/testimonials", icon: MessageSquareQuote },
  { label: "Messages", href: "/admin/messages", icon: Mail },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

interface Props {
  isOpen: boolean;
  isCollapsed: boolean;
  desktopWidth: number;
  onClose: () => void;
  onWidthChange: (value: number | ((current: number) => number)) => void;
}

export default function Sidebar({
  isOpen,
  isCollapsed,
  desktopWidth,
  onClose,
  onWidthChange,
}: Props) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const publicPortfolioHref = getPortfolioHomePath({
    portfolioSlug: session?.user?.portfolioSlug || "",
  });
  const sidebarStyle = {
    "--admin-sidebar-width": `${desktopWidth}px`,
  } as React.CSSProperties;

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />}
      <aside className={cn(
        "fixed top-0 left-0 h-full w-64 lg:w-[var(--admin-sidebar-width)] bg-surface border-r border-border z-50 flex flex-col transition-[width,transform] duration-300",
        "lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full",
      )} style={sidebarStyle}>
        <div className={cn("flex items-center justify-between px-4 h-16 border-b border-border", isCollapsed && "lg:justify-center lg:px-3")}>
          <Link href="/admin/dashboard" className={cn("flex items-center gap-3 min-w-0", isCollapsed && "lg:justify-center")}>
            <div className="w-9 h-9 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center flex-shrink-0"><Code2 className="w-5 h-5 text-white" /></div>
            <span className={cn("font-bold text-lg gradient-text truncate", isCollapsed && "lg:hidden")}>Admin</span>
          </Link>
          <button onClick={onClose} className="lg:hidden p-1"><X className="w-5 h-5 text-text-muted" /></button>
        </div>
        <nav className={cn("flex-1 py-4 px-3 space-y-1 overflow-y-auto", isCollapsed && "lg:px-2")}>
          {navItems.map((item) => {
            const active = pathname === item.href || (item.href !== "/admin/dashboard" && pathname.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href} onClick={onClose} title={isCollapsed ? item.label : undefined}
                className={cn("flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                  isCollapsed && "lg:justify-center lg:px-0",
                  active ? "bg-primary/10 text-primary" : "text-text-secondary hover:text-text-primary hover:bg-surface-2")}>
                <item.icon className="w-5 h-5 flex-shrink-0" />
                <span className={cn(isCollapsed && "lg:hidden")}>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className={cn("p-3 border-t border-border space-y-1", isCollapsed && "lg:px-2")}>
          <Link href={publicPortfolioHref} target="_blank" title={isCollapsed ? "View Site" : undefined}
            className={cn("flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-text-muted hover:text-text-primary hover:bg-surface-2 transition-colors",
              isCollapsed && "lg:justify-center lg:px-0")}>
            <Code2 className="w-5 h-5" />
            <span className={cn(isCollapsed && "lg:hidden")}>View Site</span>
          </Link>
          <button onClick={() => signOut({ callbackUrl: "/login" })} title={isCollapsed ? "Logout" : undefined}
            className={cn("flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors w-full",
              isCollapsed && "lg:justify-center lg:px-0")}>
            <LogOut className="w-5 h-5" />
            <span className={cn(isCollapsed && "lg:hidden")}>Logout</span>
          </button>
        </div>

        {!isCollapsed && (
          <DragResizeHandle
            ariaLabel="Resize sidebar"
            className="absolute right-0 top-0 hidden h-full translate-x-1/2 lg:flex"
            onResize={(deltaX) =>
              onWidthChange((current) =>
                Math.min(
                  ADMIN_MAX_SIDEBAR_WIDTH,
                  Math.max(ADMIN_MIN_SIDEBAR_WIDTH, current + deltaX)
                )
              )
            }
          />
        )}
      </aside>
    </>
  );
}
