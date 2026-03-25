"use client";
import MotionWrapper from "@/components/animations/MotionWrapper";
import type { DesignPreset } from "@/constants/siteCustomization";
import { cn } from "@/lib/cn";

export default function SectionHeader({
  label,
  title,
  description,
  align,
  preset = "classic",
}: {
  label: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  preset?: DesignPreset;
}) {
  const resolvedAlign = align || (preset === "minimal" ? "center" : "left");
  const isRetro = preset === "retro";
  const isOs = preset === "os";

  return (
    <MotionWrapper
      className={cn(
        "section-shell mb-12 md:mb-16",
        resolvedAlign === "center" && "text-center"
      )}
    >
      {resolvedAlign === "left" ? (
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <span
              className={cn(
                "mb-4 inline-block border px-4 py-1.5 text-xs uppercase tracking-wider",
                isRetro
                  ? "rounded-md border-primary/30 bg-primary/10 font-mono text-primary"
                  : isOs
                    ? "rounded-xl border-white/10 bg-white/5 font-display text-muted-foreground"
                    : "premium-badge rounded-full"
              )}
            >
              {isRetro ? `[${label.toLowerCase()}]` : label}
            </span>
            <h2
              className={cn(
                "whitespace-pre-line text-3xl font-bold leading-tight md:text-4xl lg:text-5xl",
                isRetro ? "font-mono tracking-tight" : preset === "minimal" ? "font-display" : "font-serif"
                ,
                isOs ? "text-white" : "text-foreground"
              )}
            >
              {title}
            </h2>
          </div>
          {description && (
            <p
            className={cn(
                "max-w-sm text-sm leading-relaxed text-muted-foreground md:text-right",
                isRetro && "font-mono text-primary/75",
                isOs && "text-white/70"
              )}
            >
              {description}
            </p>
          )}
        </div>
      ) : (
        <div className="text-center">
          <span
            className={cn(
              "mb-4 inline-block border px-4 py-1.5 text-xs uppercase tracking-wider",
              isRetro
                ? "rounded-md border-primary/30 bg-primary/10 font-mono text-primary"
                : isOs
                  ? "rounded-xl border-white/10 bg-white/5 font-display text-muted-foreground"
                  : "premium-badge rounded-full"
            )}
          >
            {isRetro ? `[${label.toLowerCase()}]` : label}
          </span>
          <h2
            className={cn(
              "whitespace-pre-line text-3xl font-bold md:text-4xl lg:text-5xl",
              isRetro ? "font-mono tracking-tight" : preset === "minimal" ? "font-display" : "font-serif"
              ,
              isOs ? "text-white" : "text-foreground"
            )}
          >
            {title}
          </h2>
          {description && (
            <p
              className={cn(
                "mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground",
                isRetro && "font-mono text-base text-primary/75",
                isOs && "text-white/70"
              )}
            >
              {description}
            </p>
          )}
        </div>
      )}
    </MotionWrapper>
  );
}
