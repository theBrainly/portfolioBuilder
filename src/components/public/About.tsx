"use client";

import Image from "next/image";
import MotionWrapper from "@/components/animations/MotionWrapper";
import CountUp from "@/components/animations/CountUp";
import SectionHeader from "./SectionHeader";
import { cn } from "@/lib/cn";
import type { ISiteSettings } from "@/types";

export default function About({ settings }: { settings: ISiteSettings | null }) {
  if (!settings) return null;

  const preset = settings.designPreset || "classic";
  const aboutParagraphs = (
    settings.aboutDescription ||
    "I build web experiences that balance clarity, performance, and real business value. My work usually sits at the intersection of product thinking, interface design, and dependable engineering."
  )
    .split("\n")
    .filter(Boolean);

  const stats = [
    {
      value: settings.totalProjects,
      label: "Projects delivered",
      description:
        "Work shipped across product, frontend, and full-stack problem spaces.",
    },
    settings.totalClients > 0
      ? {
          value: settings.totalClients,
          label: "Clients and teams",
          description:
            "Collaborations built on clear communication, trust, and steady delivery.",
        }
      : {
          value: settings.yearsOfExperience,
          label: "Years of experience",
          description:
            "Hands-on time spent planning, building, refining, and supporting digital products.",
        },
  ];

  if (preset === "minimal") {
    return (
      <section id="about" className="section-padding">
        <div className="section-container">
          <SectionHeader
            label="About"
            title={settings.aboutTitle || "About Me"}
            description="A quiet overview of the perspective, process, and working style behind the portfolio."
            preset={preset}
            align="center"
          />

          <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <MotionWrapper direction="left">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[32px] border border-border bg-muted">
                {settings.aboutImage ? (
                  <Image
                    src={settings.aboutImage}
                    alt="About me"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-muted">
                    <span className="text-6xl">💼</span>
                  </div>
                )}
              </div>
            </MotionWrapper>

            <div className="grid gap-6">
              <MotionWrapper direction="up">
                <div className="rounded-[32px] border border-border bg-background/90 p-8">
                  <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
                    {aboutParagraphs.map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              </MotionWrapper>

              <div className="grid gap-4 md:grid-cols-2">
                {stats.map((stat, index) => (
                  <MotionWrapper key={stat.label} delay={index * 0.1}>
                    <div className="rounded-[28px] border border-border bg-background/90 p-6">
                      <div className="text-4xl font-semibold text-foreground">
                        +<CountUp end={stat.value} />
                      </div>
                      <p className="mt-3 text-sm font-medium text-foreground">{stat.label}</p>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        {stat.description}
                      </p>
                    </div>
                  </MotionWrapper>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (preset === "retro") {
    return (
      <section id="about" className="section-padding">
        <div className="section-container">
          <SectionHeader
            label="About"
            title={settings.aboutTitle || "About Me"}
            description="Background, process, and delivery habits shown through a terminal-style system view."
            preset={preset}
          />

          <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <MotionWrapper direction="left">
              <div className="rounded-[28px] border border-primary/25 bg-black/40 p-6 font-mono">
                <p className="text-xs uppercase tracking-[0.18em] text-primary/65">$ cat about.txt</p>
                <div className="mt-5 space-y-4 text-sm leading-relaxed text-primary/80">
                  {aboutParagraphs.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </div>
            </MotionWrapper>

            <div className="grid gap-6">
              <MotionWrapper direction="up">
                <div className="relative aspect-[4/4.4] overflow-hidden rounded-[28px] border border-primary/25 bg-black/40">
                  {settings.aboutImage ? (
                    <Image src={settings.aboutImage} alt="About me" fill className="object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-black/40">
                      <span className="text-6xl">💼</span>
                    </div>
                  )}
                </div>
              </MotionWrapper>

              <div className="grid gap-4 sm:grid-cols-2">
                {stats.map((stat, index) => (
                  <MotionWrapper key={stat.label} delay={index * 0.1}>
                    <div className="rounded-[24px] border border-primary/20 bg-primary/5 p-5 font-mono">
                      <div className="text-3xl text-primary">
                        +<CountUp end={stat.value} />
                      </div>
                      <p className="mt-3 text-xs uppercase tracking-[0.18em] text-primary/65">
                        {stat.label}
                      </p>
                      <p className="mt-2 text-xs leading-relaxed text-primary/75">
                        {stat.description}
                      </p>
                    </div>
                  </MotionWrapper>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (preset === "os") {
    return (
      <section id="about" className="section-padding">
        <div className="section-container">
          <SectionHeader
            label="About"
            title={settings.aboutTitle || "About Me"}
            description="A workspace-style snapshot of the thinking, habits, and delivery approach behind the portfolio."
            preset={preset}
          />

          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <MotionWrapper direction="left">
              <div className="rounded-[30px] border border-white/10 bg-slate-950/60 p-5 backdrop-blur-xl">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-[#FF5F57]" />
                    <span className="h-3 w-3 rounded-full bg-[#FEBC2E]" />
                    <span className="h-3 w-3 rounded-full bg-[#28C840]" />
                  </div>
                  <span className="text-xs uppercase tracking-[0.18em] text-white/45">
                    story.app
                  </span>
                </div>
                <div className="mt-5 space-y-4 text-sm leading-relaxed text-white/72">
                  {aboutParagraphs.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </div>
            </MotionWrapper>

            <div className="grid gap-6">
              <MotionWrapper direction="up">
                <div className="rounded-[30px] border border-white/10 bg-slate-950/60 p-5 backdrop-blur-xl">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-full bg-[#FF5F57]" />
                      <span className="h-3 w-3 rounded-full bg-[#FEBC2E]" />
                      <span className="h-3 w-3 rounded-full bg-[#28C840]" />
                    </div>
                    <span className="text-xs uppercase tracking-[0.18em] text-white/45">
                      portrait.window
                    </span>
                  </div>
                  <div className="relative mt-5 aspect-[4/3] overflow-hidden rounded-[24px] border border-white/10 bg-white/5">
                    {settings.aboutImage ? (
                      <Image src={settings.aboutImage} alt="About me" fill className="object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-white/5">
                        <span className="text-6xl">💼</span>
                      </div>
                    )}
                  </div>
                </div>
              </MotionWrapper>

              <div className="grid gap-4 sm:grid-cols-2">
                {stats.map((stat, index) => (
                  <MotionWrapper key={stat.label} delay={index * 0.1}>
                    <div className="rounded-[24px] border border-white/10 bg-slate-950/60 p-5 backdrop-blur-xl">
                      <div className="text-3xl font-semibold text-white">
                        +<CountUp end={stat.value} />
                      </div>
                      <p className="mt-3 text-xs uppercase tracking-[0.18em] text-white/45">
                        {stat.label}
                      </p>
                      <p className="mt-2 text-xs leading-relaxed text-white/65">
                        {stat.description}
                      </p>
                    </div>
                  </MotionWrapper>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="about" className="section-padding">
      <div className="section-container">
        <SectionHeader
          label="About Me"
          title={settings.aboutTitle || "About Me"}
          description="The background, working style, and perspective that connect the work shown throughout this portfolio."
          preset={preset}
        />

        <div className="grid items-start gap-6 lg:grid-cols-12 lg:gap-8">
          <MotionWrapper direction="left" className="lg:col-span-5">
            <div className="premium-panel group rounded-[30px] p-3">
              <div className="relative aspect-[4/4.4] overflow-hidden rounded-[24px]">
                {settings.aboutImage ? (
                  <Image
                    src={settings.aboutImage}
                    alt="About me"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-muted">
                    <span className="text-6xl">💼</span>
                  </div>
                )}
              </div>
            </div>
          </MotionWrapper>

          <MotionWrapper direction="up" className="lg:col-span-4">
            <div className="premium-panel-muted rounded-[30px] p-6 md:p-8">
              <p className="text-xs uppercase tracking-[0.2em] text-primary">Approach</p>
              <div className="mt-5 space-y-4 text-sm leading-relaxed text-muted-foreground md:text-base">
                {aboutParagraphs.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>
          </MotionWrapper>

          <MotionWrapper direction="right" className="lg:col-span-3">
            <div className="premium-panel rounded-[30px] p-6">
              <p className="text-xs uppercase tracking-[0.2em] text-primary">Highlights</p>
              <div className="mt-6 space-y-6">
                {stats.map((stat, index) => (
                  <div key={stat.label} className={cn(index > 0 && "border-t border-border/70 pt-6")}>
                    <div className="font-serif text-5xl font-bold leading-none text-foreground md:text-6xl">
                      +<CountUp end={stat.value} />
                    </div>
                    <p className="mt-3 text-sm font-medium text-foreground">{stat.label}</p>
                    <p className="mt-2 max-w-[220px] text-xs leading-relaxed text-muted-foreground">
                      {stat.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </MotionWrapper>
        </div>
      </div>
    </section>
  );
}
