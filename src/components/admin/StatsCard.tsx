import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface Props { title: string; value: number | string; icon: LucideIcon; color?: "primary"|"secondary"|"accent"|"info"; }

export default function StatsCard({ title, value, icon: Icon, color = "primary" }: Props) {
  const c = { primary: "bg-primary/10 text-primary", secondary: "bg-secondary/10 text-secondary", accent: "bg-accent/10 text-accent", info: "bg-blue-500/10 text-blue-400" };
  return (
    <div className="bg-surface border border-border rounded-2xl p-6 hover:border-primary/20 transition-colors">
      <div className="flex items-start justify-between">
        <div className="space-y-2"><p className="text-sm text-text-muted font-medium">{title}</p><p className="text-3xl font-bold">{value}</p></div>
        <div className={cn("p-3 rounded-xl", c[color])}><Icon className="w-6 h-6" /></div>
      </div>
    </div>
  );
}
