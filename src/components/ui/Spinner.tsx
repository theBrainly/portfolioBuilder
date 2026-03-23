import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Spinner({ size = "md", className }: { size?: "sm"|"md"|"lg"; className?: string }) {
  const s = { sm: "w-4 h-4", md: "w-8 h-8", lg: "w-12 h-12" };
  return <div className="flex items-center justify-center"><Loader2 className={cn("animate-spin text-primary", s[size], className)} /></div>;
}
