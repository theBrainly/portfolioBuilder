"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/cn";
import type { DesignPreset } from "@/constants/siteCustomization";
import { getPortfolioProjectPath } from "@/lib/portfolioUrl";
import type { IProject, ISiteSettings } from "@/types";

export default function ProjectCard({
  project,
  index,
  preset = "classic",
  settings = null,
}: {
  project: IProject;
  index: number;
  preset?: DesignPreset;
  settings?: ISiteSettings | null;
}) {
  const techPreview = project.techStack?.filter(Boolean).slice(0, 3).join(" • ");
  const isRetro = preset === "retro";
  const isOs = preset === "os";
  const isMinimal = preset === "minimal";
  const projectHref = getPortfolioProjectPath(project.slug, settings);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true }}
      className="group h-full"
    >
      <Link href={projectHref} className="block h-full">
        <div
          className={cn(
            "relative h-full overflow-hidden",
            isMinimal
              ? "rounded-[28px] border border-border bg-background/90"
              : isRetro
                ? "rounded-[24px] border border-primary/20 bg-black/35"
                : isOs
                  ? "rounded-[28px] border border-white/10 bg-slate-950/60 backdrop-blur-xl"
                  : "premium-panel rounded-[28px]"
          )}
        >
          {isOs && (
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-[#FF5F57]" />
                <span className="h-3 w-3 rounded-full bg-[#FEBC2E]" />
                <span className="h-3 w-3 rounded-full bg-[#28C840]" />
              </div>
              <span className="text-[11px] uppercase tracking-[0.18em] text-white/45">
                {project.title}.app
              </span>
            </div>
          )}

          <div
            className={cn(
              "relative",
              isMinimal
                ? "aspect-[4/3] overflow-hidden"
                : isRetro
                  ? "aspect-[4/3] overflow-hidden border-b border-primary/20"
                : isOs
                  ? "aspect-[4/3] overflow-hidden"
                    : "h-full min-h-[260px] md:min-h-[320px]"
            )}
          >
            {project.thumbnail ? (
              <Image
                src={project.thumbnail}
                alt={project.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-muted to-muted/50">
                <span className="text-5xl">🚀</span>
              </div>
            )}

            {!isMinimal && !isRetro && !isOs && (
              <>
                <div className="absolute inset-0 bg-gradient-to-t from-[rgba(7,10,18,0.92)] via-[rgba(7,10,18,0.18)] to-transparent opacity-85 transition-opacity duration-300 group-hover:opacity-95" />
                <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[hsl(var(--accent-color)/0.18)] to-transparent opacity-80" />
              </>
            )}
          </div>

          {isMinimal ? (
            <div className="p-5 md:p-6">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                {project.category}
              </p>
              <h3 className="mt-2 text-xl font-semibold text-foreground">{project.title}</h3>
              {project.shortDescription && (
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {project.shortDescription}
                </p>
              )}
              {techPreview && (
                <p className="mt-4 text-xs uppercase tracking-[0.16em] text-muted-foreground">
                  {techPreview}
                </p>
              )}
            </div>
          ) : isRetro ? (
            <div className="p-5 font-mono">
              <p className="text-[11px] uppercase tracking-[0.18em] text-primary/60">
                {project.category}
              </p>
              <h3 className="mt-2 text-lg text-primary">{project.title}</h3>
              {techPreview && (
                <p className="mt-3 text-[11px] uppercase tracking-[0.18em] text-primary/55">
                  {techPreview}
                </p>
              )}
              {project.shortDescription && (
                <p className="mt-3 text-xs leading-relaxed text-primary/75">
                  {project.shortDescription}
                </p>
              )}
            </div>
          ) : isOs ? (
            <div className="p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-white/45">
                {project.category}
              </p>
              <h3 className="mt-2 text-xl font-semibold text-white">{project.title}</h3>
              {project.shortDescription && (
                <p className="mt-3 text-sm leading-relaxed text-white/70">
                  {project.shortDescription}
                </p>
              )}
              {techPreview && (
                <p className="mt-4 text-xs uppercase tracking-[0.16em] text-white/45">
                  {techPreview}
                </p>
              )}
            </div>
          ) : (
            <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
              <p className="mb-2 inline-flex rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-white/75 backdrop-blur">
                {project.category}
              </p>
              <h3 className="text-lg font-semibold leading-snug text-white md:text-2xl">
                {project.title}
              </h3>
              {techPreview && <p className="mt-2 line-clamp-1 text-xs uppercase tracking-[0.14em] text-white/70">{techPreview}</p>}
              {project.shortDescription && (
                <p className="mt-3 max-w-md line-clamp-2 text-sm text-white/68">
                  {project.shortDescription}
                </p>
              )}
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
