"use client";
import { motion } from "framer-motion";
import type { DesignPreset } from "@/constants/siteCustomization";

const LOGOS = [
  "Coinbase", "Spotify", "Zoom", "Slack", "Dropbox",
  "Stripe", "Figma", "Notion", "Vercel", "GitHub"
];

export default function LogoMarquee({
  preset = "classic",
}: {
  preset?: DesignPreset;
}) {
  const labelClass =
    preset === "retro"
      ? "font-mono text-sm md:text-base uppercase tracking-[0.24em]"
      : preset === "minimal"
        ? "text-sm md:text-lg font-medium uppercase tracking-[0.22em]"
        : preset === "os"
          ? "font-display text-base md:text-lg tracking-wide"
          : "font-display text-lg md:text-xl font-semibold tracking-wide";

  const dotClass =
    preset === "retro"
      ? "rounded-sm bg-primary/50"
      : preset === "os"
        ? "rounded-md bg-primary/50"
        : "rounded-full bg-muted-foreground/30";

  return (
    <section
      className={`overflow-hidden border-y border-border py-8 ${
        preset === "retro"
          ? "bg-black/25"
          : preset === "minimal"
            ? "bg-background/60"
            : preset === "os"
              ? "bg-slate-950/20"
              : "bg-background/40 backdrop-blur"
      }`}
    >
      <div className="relative">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="flex animate-marquee whitespace-nowrap"
        >
          {[...LOGOS, ...LOGOS].map((logo, i) => (
            <div key={i} className="flex items-center mx-8 md:mx-12">
              <span
                className={`flex items-center gap-2 ${preset === "classic" ? "text-foreground/60" : "text-muted-foreground/60"} ${labelClass}`}
              >
                <span className={`h-2 w-2 ${dotClass}`} />
                {logo}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
