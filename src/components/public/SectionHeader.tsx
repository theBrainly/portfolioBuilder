"use client";
import MotionWrapper from "@/components/animations/MotionWrapper";

export default function SectionHeader({ label, title, description, align = "center" }: {
  label: string; title: string; description?: string; align?: "left" | "center";
}) {
  return (
    <MotionWrapper className={`mb-12 md:mb-16 ${align === "center" ? "text-center" : ""}`}>
      <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-mono font-medium rounded-full mb-4">{label}</span>
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary">{title}</h2>
      {description && <p className="mt-4 text-text-secondary max-w-2xl mx-auto text-lg leading-relaxed">{description}</p>}
    </MotionWrapper>
  );
}
