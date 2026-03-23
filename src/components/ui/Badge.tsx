import { cn } from "@/lib/utils";

interface BadgeProps { children: React.ReactNode; variant?: "default"|"primary"|"secondary"|"success"|"warning"|"danger"; size?: "sm"|"md"; className?: string; }

export default function Badge({ children, variant = "default", size = "sm", className }: BadgeProps) {
  const v = {
    default: "bg-surface-2 text-text-secondary border-border",
    primary: "bg-primary/10 text-primary border-primary/20",
    secondary: "bg-secondary/10 text-secondary border-secondary/20",
    success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    warning: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    danger: "bg-red-500/10 text-red-400 border-red-500/20",
  };
  const s = { sm: "px-2 py-0.5 text-xs", md: "px-3 py-1 text-sm" };
  return <span className={cn("inline-flex items-center rounded-full border font-medium font-mono", v[variant], s[size], className)}>{children}</span>;
}
