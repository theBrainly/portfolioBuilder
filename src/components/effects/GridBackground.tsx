"use client";
import type { DesignPreset } from "@/constants/siteCustomization";

export default function GridBackground({
  preset = "classic",
}: {
  preset?: DesignPreset;
}) {
  if (preset === "minimal") {
    return (
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at top, hsl(var(--primary-color) / 0.06), transparent 40%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0), rgba(255,255,255,0.6))",
          }}
        />
      </div>
    );
  }

  if (preset === "retro") {
    return (
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[#020706]" />
        <div className="absolute inset-0 opacity-[0.16]" style={{
          backgroundImage:
            "repeating-linear-gradient(180deg, rgba(120,255,190,0.08) 0px, rgba(120,255,190,0.08) 1px, transparent 2px, transparent 4px)",
        }} />
        <div className="absolute inset-0 opacity-[0.06]" style={{
          backgroundImage:
            "linear-gradient(rgba(120,255,190,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(120,255,190,0.4) 1px, transparent 1px)",
          backgroundSize: "42px 42px",
        }} />
        <div className="absolute top-10 left-10 h-72 w-72 rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute bottom-10 right-10 h-80 w-80 rounded-full bg-emerald-400/10 blur-[140px]" />
      </div>
    );
  }

  if (preset === "os") {
    return (
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at top left, hsl(var(--primary-color) / 0.3), transparent 38%), radial-gradient(circle at bottom right, hsl(var(--secondary-color) / 0.18), transparent 34%), linear-gradient(135deg, #0f172a, #111827 42%, #1f2937)",
          }}
        />
        <div className="absolute inset-0 opacity-[0.05]" style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }} />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: "linear-gradient(var(--text-muted) 1px, transparent 1px), linear-gradient(90deg, var(--text-muted) 1px, transparent 1px)",
        backgroundSize: "60px 60px",
      }} />
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[120px]" />
    </div>
  );
}
