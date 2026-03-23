import { cn } from "@/lib/utils";

interface CardProps { children: React.ReactNode; className?: string; hover?: boolean; padding?: "none"|"sm"|"md"|"lg"; }

export default function Card({ children, className, hover = false, padding = "md" }: CardProps) {
  const p = { none: "", sm: "p-4", md: "p-6", lg: "p-8" };
  return (
    <div className={cn("bg-surface border border-border rounded-2xl", p[padding], hover && "hover:border-primary/30 hover:shadow-lg transition-all duration-300", className)}>
      {children}
    </div>
  );
}
