"use client";

import MotionWrapper from "@/components/animations/MotionWrapper";
import SectionHeader from "./SectionHeader";
import type { DesignPreset } from "@/constants/siteCustomization";
import type { IExperience } from "@/types";

function getYearRange(exp: IExperience): string {
  const startYear = new Date(exp.startDate).getFullYear();
  if (exp.isCurrent) return `${startYear} - Now`;
  const endYear = exp.endDate ? new Date(exp.endDate).getFullYear() : startYear;
  return `${startYear} - ${endYear}`;
}

export default function ExperienceTimeline({
  experiences,
  preset = "classic",
}: {
  experiences: IExperience[];
  preset?: DesignPreset;
}) {
  if (!experiences.length) return null;

  if (preset === "minimal") {
    return (
      <section id="experience" className="section-padding">
        <div className="section-container">
          <SectionHeader
            label="Experience"
            title="Experience that shaped how I build"
            description="A cleaner timeline of roles, responsibilities, and lessons that continue to influence the work."
            preset={preset}
            align="center"
          />

          <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-2">
            {experiences.map((experience, index) => (
              <MotionWrapper key={experience._id} delay={index * 0.08}>
                <div className="h-full rounded-[28px] border border-border bg-background/90 p-6">
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    {getYearRange(experience)}
                  </p>
                  <h3 className="mt-3 text-xl font-semibold text-foreground">
                    {experience.position}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">{experience.company}</p>
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                    {experience.description}
                  </p>
                </div>
              </MotionWrapper>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (preset === "retro") {
    return (
      <section id="experience" className="section-padding">
        <div className="section-container">
          <SectionHeader
            label="Experience"
            title="Build history"
            description="Roles and delivery logs shown as terminal-style entries instead of a standard timeline."
            preset={preset}
          />

          <div className="space-y-4">
            {experiences.map((experience, index) => (
              <MotionWrapper key={experience._id} delay={index * 0.08}>
                <div className="rounded-[24px] border border-primary/20 bg-black/35 p-5 font-mono">
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.18em] text-primary/60">
                        {experience.type}
                      </p>
                      <h3 className="mt-3 text-lg text-primary">
                        {experience.position} @ {experience.company}
                      </h3>
                      <p className="mt-3 text-xs leading-relaxed text-primary/75">
                        {experience.description}
                      </p>
                    </div>
                    <span className="rounded-md border border-primary/20 px-3 py-2 text-xs uppercase tracking-[0.16em] text-primary/70">
                      {getYearRange(experience)}
                    </span>
                  </div>
                </div>
              </MotionWrapper>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (preset === "os") {
    return (
      <section id="experience" className="section-padding">
        <div className="section-container">
          <SectionHeader
            label="Experience"
            title="Experience windows"
            description="Each role is presented like a desktop window, making the progression feel like part of the workspace."
            preset={preset}
          />

          <div className="space-y-5">
            {experiences.map((experience, index) => (
              <MotionWrapper key={experience._id} delay={index * 0.08}>
                <div className="rounded-[28px] border border-white/10 bg-slate-950/60 p-5 backdrop-blur-xl">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-full bg-[#FF5F57]" />
                      <span className="h-3 w-3 rounded-full bg-[#FEBC2E]" />
                      <span className="h-3 w-3 rounded-full bg-[#28C840]" />
                    </div>
                    <span className="text-xs uppercase tracking-[0.18em] text-white/45">
                      role-{index + 1}.window
                    </span>
                  </div>

                  <div className="grid gap-4 pt-5 md:grid-cols-[1fr_auto] md:items-start">
                    <div>
                      <h3 className="text-xl font-semibold text-white">
                        {experience.position} at {experience.company}
                      </h3>
                      <p className="mt-2 text-xs uppercase tracking-[0.18em] text-white/45">
                        {experience.type}
                        {experience.techUsed.length > 0
                          ? ` • ${experience.techUsed.slice(0, 3).join(" • ")}`
                          : ""}
                      </p>
                      <p className="mt-4 text-sm leading-relaxed text-white/70">
                        {experience.description}
                      </p>
                    </div>
                    <span className="rounded-xl bg-white/8 px-4 py-2 text-sm text-white/70">
                      {getYearRange(experience)}
                    </span>
                  </div>
                </div>
              </MotionWrapper>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="experience" className="section-padding">
      <div className="section-container">
        <SectionHeader
          label="Experience"
          title="Experience that shaped how I build"
          description="Roles, responsibilities, and delivery work that continue to influence the way I approach products, teams, and technical decisions."
          preset={preset}
        />

        <div className="premium-panel mx-auto max-w-5xl rounded-[32px] p-6 md:p-8">
          {experiences.map((experience, index) => (
            <MotionWrapper key={experience._id} delay={index * 0.1}>
              <div
                className={`grid gap-4 py-8 md:grid-cols-12 md:gap-8 ${
                  index < experiences.length - 1 ? "border-b border-border/70" : ""
                }`}
              >
                <div className="md:col-span-7">
                  <h3 className="mb-1 text-lg font-semibold text-foreground md:text-xl">
                    {experience.position} at {experience.company}
                  </h3>
                  <p className="mb-3 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    {experience.type}
                    {experience.techUsed.length > 0
                      ? ` • ${experience.techUsed.slice(0, 3).join(" • ")}`
                      : ""}
                  </p>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {experience.description}
                  </p>
                </div>

                <div className="flex items-start md:col-span-5 md:justify-end">
                  <span className="font-serif text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl">
                    {getYearRange(experience)}
                  </span>
                </div>
              </div>
            </MotionWrapper>
          ))}
        </div>
      </div>
    </section>
  );
}
