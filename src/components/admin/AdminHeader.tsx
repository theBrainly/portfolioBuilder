"use client";
import { useSession } from "next-auth/react";
import { Menu } from "lucide-react";
import { getInitials } from "@/lib/utils";

interface Props { title: string; subtitle?: string; onMenuClick: () => void; actions?: React.ReactNode; }

export default function AdminHeader({ title, subtitle, onMenuClick, actions }: Props) {
  const { data: session } = useSession();
  return (
    <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="flex items-center justify-between px-4 md:px-6 h-16">
        <div className="flex items-center gap-4">
          <button onClick={onMenuClick} className="p-2 hover:bg-surface-2 rounded-lg transition-colors" aria-label="Toggle sidebar">
            <Menu className="w-5 h-5" />
          </button>
          <div><h1 className="text-lg font-bold">{title}</h1>{subtitle && <p className="text-sm text-text-muted">{subtitle}</p>}</div>
        </div>
        <div className="flex items-center gap-3">
          {actions}
          <div className="flex items-center gap-3 pl-3 border-l border-border">
            <div className="w-8 h-8 bg-primary/20 text-primary rounded-full flex items-center justify-center text-sm font-bold">
              {session?.user?.name ? getInitials(session.user.name) : "A"}
            </div>
            <span className="hidden md:block text-sm font-medium">{session?.user?.name || "Admin"}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
