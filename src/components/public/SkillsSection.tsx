"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import MotionWrapper from "@/components/animations/MotionWrapper";
import SectionHeader from "./SectionHeader";
import { cn } from "@/lib/cn";
import type { DesignPreset } from "@/constants/siteCustomization";
import type { ISkill } from "@/types";

const CATEGORY_CONTEXT: Record<string, string> = {
  Frontend: "Building responsive, accessible interfaces that feel clear and fast to use.",
  Backend: "Designing APIs, application logic, and integrations that keep products reliable.",
  Database: "Structuring and querying data so products stay stable as they grow.",
  DevOps: "Handling deployment, delivery workflows, and infrastructure with maintainability in mind.",
  Tools: "Using the right supporting tools to streamline collaboration, testing, and day-to-day delivery.",
  Other: "Adding supporting capabilities wherever the product or workflow needs them.",
};

export default function SkillsSection({
  skills,
  preset = "classic",
}: {
  skills: ISkill[];
  preset?: DesignPreset;
}) {
  const displayCards = skills.length > 0
    ? Object.entries(
        skills.reduce((acc, skill) => {
          (acc[skill.category] = acc[skill.category] || []).push(skill);
          return acc;
        }, {} as Record<string, ISkill[]>)
      )
        .slice(0, 4)
        .map(([category, items], index) => ({
          title: category,
          description: `${CATEGORY_CONTEXT[category] || CATEGORY_CONTEXT.Other} Working regularly with ${items
            .slice(0, 3)
            .map((skill) => skill.name)
            .join(", ")}${items.length > 3 ? `, plus ${items.length - 3} more tools` : ""}.`,
          toolsLabel: `${items.length} ${items.length === 1 ? "tool" : "tools"}`,
          featured: index === 2,
        }))
    : [
        {
          title: "Skills in progress",
          description:
            "The detailed skill breakdown is being updated. The rest of the portfolio still reflects the tools, workflow, and delivery approach behind the work here.",
          toolsLabel: "Awaiting content",
          featured: true,
        },
      ];

  if (preset === "minimal") {
    return (
      <section id="skills" className="section-padding">
        <div className="section-container">
          <SectionHeader
            label="Skills"
            title="The capabilities behind the work"
            description="A cleaner view of the disciplines, tools, and technical strengths that repeatedly show up in shipped projects."
            preset={preset}
            align="center"
          />

          <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-2 xl:grid-cols-4">
            {displayCards.map((card, index) => (
              <MotionWrapper key={card.title} delay={index * 0.08}>
                <motion.div
                  whileHover={{ y: -4 }}
                  className="flex h-full flex-col justify-between gap-6 rounded-[28px] border border-border bg-background/90 p-6"
                >
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      {card.toolsLabel}
                    </p>
                    <h3 className="mt-3 text-xl font-semibold text-foreground">{card.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {card.description}
                    </p>
                  </div>
                  <button
                    onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}
                    className="inline-flex items-center gap-2 text-sm font-medium text-foreground"
                  >
                    See related work
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </motion.div>
              </MotionWrapper>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (preset === "retro") {
    return (
      <section id="skills" className="section-padding">
        <div className="section-container">
          <SectionHeader
            label="Skills"
            title="Capability modules loaded"
            description="The stack and working strengths exposed as a compact terminal-style module list."
            preset={preset}
          />

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {displayCards.map((card, index) => (
              <MotionWrapper key={card.title} delay={index * 0.08}>
                <motion.div
                  whileHover={{ y: -4 }}
                  className="flex h-full flex-col justify-between gap-6 rounded-[24px] border border-primary/20 bg-black/35 p-5 font-mono"
                >
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.2em] text-primary/65">
                      {card.toolsLabel}
                    </p>
                    <h3 className="mt-3 text-lg text-primary">{card.title}</h3>
                    <p className="mt-3 text-xs leading-relaxed text-primary/75">{card.description}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] uppercase tracking-[0.18em] text-primary/55">
                      module {index + 1}
                    </span>
                    <ArrowRight className="h-4 w-4 text-primary/70" />
                  </div>
                </motion.div>
              </MotionWrapper>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (preset === "os") {
    return (
      <section id="skills" className="section-padding">
        <div className="section-container">
          <SectionHeader
            label="Skills"
            title="Core tools in the workspace"
            description="A desktop-style library of the categories that shape planning, design, implementation, and delivery."
            preset={preset}
          />

          <div className="grid gap-4 md:grid-cols-2">
            {displayCards.map((card, index) => (
              <MotionWrapper key={card.title} delay={index * 0.08}>
                <motion.div
                  whileHover={{ y: -4 }}
                  className="rounded-[28px] border border-white/10 bg-slate-950/60 p-5 backdrop-blur-xl"
                >
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-full bg-[#FF5F57]" />
                      <span className="h-3 w-3 rounded-full bg-[#FEBC2E]" />
                      <span className="h-3 w-3 rounded-full bg-[#28C840]" />
                    </div>
                    <span className="text-xs uppercase tracking-[0.18em] text-white/45">
                      {card.title}.app
                    </span>
                  </div>
                  <div className="pt-5">
                    <p className="text-xs uppercase tracking-[0.18em] text-white/45">
                      {card.toolsLabel}
                    </p>
                    <h3 className="mt-3 text-xl font-semibold text-white">{card.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-white/70">{card.description}</p>
                  </div>
                </motion.div>
              </MotionWrapper>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="skills" className="section-padding">
      <div className="section-container">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-4">
            <MotionWrapper direction="left">
              <span className="mb-4 inline-block rounded-full border border-border px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Skills
              </span>
              <h2 className="mb-6 font-serif text-3xl font-bold leading-tight text-foreground md:text-4xl lg:text-5xl">
                The capabilities behind the work
              </h2>
              <p className="mb-8 text-sm leading-relaxed text-muted-foreground">
                The stack, disciplines, and working strengths that show up across this portfolio, from product thinking to shipped code.
              </p>
              <button
                onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                See Projects
              </button>
            </MotionWrapper>
          </div>

          <div className="lg:col-span-8">
            <div className="grid gap-4 sm:grid-cols-2">
              {displayCards.map((card, index) => (
                <MotionWrapper key={card.title} delay={index * 0.1}>
                  <motion.div
                    whileHover={{ y: -4 }}
                    className={cn(
                      "flex h-full flex-col justify-between gap-6 rounded-2xl border p-6 md:p-8",
                      card.featured
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background hover:border-primary/20"
                    )}
                  >
                    <div>
                      <p
                        className={cn(
                          "mb-3 text-xs uppercase tracking-[0.2em]",
                          card.featured ? "text-primary-foreground/65" : "text-muted-foreground"
                        )}
                      >
                        {card.toolsLabel}
                      </p>
                      <h3
                        className={cn(
                          "mb-3 text-lg font-semibold",
                          card.featured ? "text-primary-foreground" : "text-foreground"
                        )}
                      >
                        {card.title}
                      </h3>
                      <p
                        className={cn(
                          "text-sm leading-relaxed",
                          card.featured ? "text-primary-foreground/75" : "text-muted-foreground"
                        )}
                      >
                        {card.description}
                      </p>
                    </div>
                    <div className="flex justify-end">
                      <div
                        className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-full border transition-transform hover:scale-110",
                          card.featured
                            ? "border-primary-foreground/30 text-primary-foreground"
                            : "border-border text-foreground"
                        )}
                      >
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    </div>
                  </motion.div>
                </MotionWrapper>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
