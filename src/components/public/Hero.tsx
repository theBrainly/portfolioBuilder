"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowDown, MonitorSmartphone, TerminalSquare } from "lucide-react";
import { cn } from "@/lib/cn";
import type { ISiteSettings } from "@/types";

function HeroPortrait({
  image,
  title,
  className,
}: {
  image?: string;
  title: string;
  className?: string;
}) {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      {image ? (
        <Image src={image} alt={title} fill className="object-cover" priority />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-muted to-muted/50">
          <span className="text-7xl">👨‍💻</span>
        </div>
      )}
    </div>
  );
}

function HeroButtons({ primary, secondary }: { primary: string; secondary: string }) {
  return (
    <div className="mt-6 flex flex-wrap gap-4">
      <button
        onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}
        className="premium-button group flex items-center gap-2 rounded-full px-8 py-3.5 font-medium transition-transform hover:-translate-y-0.5"
      >
        {primary}
        <ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-1" />
      </button>
      <button
        onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
        className="premium-button-secondary rounded-full px-8 py-3.5 font-medium transition-transform hover:-translate-y-0.5"
      >
        {secondary}
      </button>
    </div>
  );
}

export default function Hero({ settings }: { settings: ISiteSettings | null }) {
  if (!settings) return null;

  const preset = settings.designPreset || "classic";
  const heroDescription =
    settings.heroDescription ||
    "I build modern digital products with thoughtful UX, reliable engineering, and a focus on real-world results.";
  const contactLabel = settings.navbarCTA || "Get In Touch";
  const heroStats = [
    { value: settings.yearsOfExperience, label: "Years" },
    { value: settings.totalProjects, label: "Projects" },
    { value: settings.totalClients, label: "Clients" },
  ];

  if (preset === "minimal") {
    return (
      <section id="hero" className="relative flex min-h-screen items-center overflow-hidden pt-28">
        <div className="section-container relative z-10 w-full py-14 md:py-20">
          <div className="mx-auto max-w-5xl text-center">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center rounded-full border border-border bg-background/70 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground"
            >
              {settings.heroSubtitle}
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 36 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
              className="mx-auto mt-6 max-w-4xl font-display text-5xl font-semibold leading-[1.02] text-foreground sm:text-6xl md:text-7xl lg:text-[5.5rem]"
            >
              {settings.heroTitle}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18, duration: 0.6 }}
              className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground"
            >
              {heroDescription}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28, duration: 0.6 }}
              className="flex justify-center"
            >
              <HeroButtons
                primary={settings.heroCTA || "View My Work"}
                secondary={contactLabel}
              />
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.32, duration: 0.7 }}
            className="mx-auto mt-12 grid max-w-6xl gap-6 lg:grid-cols-[0.9fr_1.1fr]"
          >
            <HeroPortrait
              image={settings.heroImage}
              title={settings.heroTitle}
              className="aspect-[4/5] rounded-[32px] border border-border bg-muted"
            />
            <div className="grid gap-6">
              <div className="rounded-[32px] border border-border bg-background/90 p-8">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Current focus
                </p>
                <p className="mt-4 text-2xl font-semibold text-foreground md:text-3xl">
                  Calm interfaces, clear systems, and work that feels easy to trust.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  { value: settings.yearsOfExperience, label: "Years" },
                  { value: settings.totalProjects, label: "Projects" },
                  { value: settings.totalClients, label: "Clients" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-[28px] border border-border bg-background/90 p-6 text-center"
                  >
                    <p className="text-3xl font-semibold text-foreground">{stat.value}</p>
                    <p className="mt-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  if (preset === "retro") {
    return (
      <section id="hero" className="relative flex min-h-screen items-center overflow-hidden pt-24">
        <div className="section-container relative z-10 w-full py-12 md:py-16">
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-[28px] border border-primary/30 bg-black/45 p-6 font-mono shadow-[0_0_40px_rgba(0,255,145,0.08)] backdrop-blur"
            >
              <p className="text-xs uppercase tracking-[0.24em] text-primary/70">
                $ portfolio --launch
              </p>
              <div className="mt-5 flex items-center gap-3 text-primary/60">
                <TerminalSquare className="h-4 w-4" />
                <span className="text-xs uppercase tracking-[0.18em]">{settings.heroSubtitle}</span>
              </div>
              <h1 className="mt-6 text-4xl font-semibold leading-tight text-primary sm:text-5xl md:text-6xl">
                {settings.heroTitle}
              </h1>
              <p className="mt-5 max-w-2xl text-sm leading-relaxed text-primary/75 md:text-base">
                {heroDescription}
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {[
                  { value: settings.yearsOfExperience, label: "years.log" },
                  { value: settings.totalProjects, label: "projects.log" },
                  { value: settings.totalClients, label: "clients.log" },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                    <p className="text-2xl font-semibold text-primary">{stat.value}</p>
                    <p className="mt-2 text-[11px] uppercase tracking-[0.18em] text-primary/65">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}
                  className="rounded-md border border-primary/40 bg-primary/10 px-5 py-3 text-xs uppercase tracking-[0.18em] text-primary transition-colors hover:bg-primary/20"
                >
                  {settings.heroCTA || "View My Work"}
                </button>
                <button
                  onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
                  className="rounded-md border border-primary/20 px-5 py-3 text-xs uppercase tracking-[0.18em] text-primary/70 transition-colors hover:border-primary/40 hover:text-primary"
                >
                  {contactLabel}
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15, duration: 0.7 }}
              className="grid gap-6"
            >
              <HeroPortrait
                image={settings.heroImage}
                title={settings.heroTitle}
                className="aspect-[4/4.6] rounded-[24px] border border-primary/25 bg-black/40"
              />
              <div className="rounded-[24px] border border-primary/25 bg-black/40 p-5 font-mono">
                <p className="text-xs uppercase tracking-[0.18em] text-primary/60">$ status</p>
                <div className="mt-4 space-y-2 text-sm text-primary/80">
                  <p>mode: available for ambitious product work</p>
                  <p>location: {settings.location || "remote-ready"}</p>
                  <p>contact: {settings.email || "email pending"}</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    );
  }

  if (preset === "os") {
    return (
      <section id="hero" className="relative flex min-h-screen items-center overflow-hidden pt-28">
        <div className="section-container relative z-10 w-full py-12 md:py-16">
          <div className="grid gap-6 lg:grid-cols-[1.12fr_0.88fr]">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-[32px] border border-white/10 bg-slate-950/60 p-5 shadow-2xl backdrop-blur-xl"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-[#FF5F57]" />
                  <span className="h-3 w-3 rounded-full bg-[#FEBC2E]" />
                  <span className="h-3 w-3 rounded-full bg-[#28C840]" />
                </div>
                <span className="text-xs uppercase tracking-[0.18em] text-white/45">
                  profile.desktop
                </span>
              </div>

              <div className="grid gap-6 pt-6 lg:grid-cols-[1.1fr_0.9fr]">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-white/55">
                    {settings.heroSubtitle}
                  </p>
                  <h1 className="mt-4 font-display text-5xl font-semibold leading-[0.98] text-white md:text-6xl lg:text-[4.75rem]">
                    {settings.heroTitle}
                  </h1>
                  <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/70">
                    {heroDescription}
                  </p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <button
                      onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}
                      className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition-transform hover:-translate-y-0.5"
                    >
                      {settings.heroCTA || "View My Work"}
                    </button>
                    <button
                      onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
                      className="rounded-xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10"
                    >
                      {contactLabel}
                    </button>
                  </div>
                </div>

                <HeroPortrait
                  image={settings.heroImage}
                  title={settings.heroTitle}
                  className="aspect-[4/4.5] rounded-[24px] border border-white/10 bg-white/5"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.18, duration: 0.7 }}
              className="grid gap-6"
            >
              <div className="rounded-[28px] border border-white/10 bg-slate-950/60 p-5 backdrop-blur-xl">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-[#FF5F57]" />
                    <span className="h-3 w-3 rounded-full bg-[#FEBC2E]" />
                    <span className="h-3 w-3 rounded-full bg-[#28C840]" />
                  </div>
                  <span className="text-xs uppercase tracking-[0.18em] text-white/45">
                    overview.widgets
                  </span>
                </div>
                <div className="mt-5 grid gap-4 sm:grid-cols-3">
                  {[
                    { value: settings.yearsOfExperience, label: "Years" },
                    { value: settings.totalProjects, label: "Projects" },
                    { value: settings.totalClients, label: "Clients" },
                  ].map((stat) => (
                    <div key={stat.label} className="rounded-2xl bg-white/6 p-4 text-center">
                      <p className="text-2xl font-semibold text-white">{stat.value}</p>
                      <p className="mt-2 text-xs uppercase tracking-[0.16em] text-white/50">
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[28px] border border-white/10 bg-slate-950/60 p-5 backdrop-blur-xl">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-[#FF5F57]" />
                    <span className="h-3 w-3 rounded-full bg-[#FEBC2E]" />
                    <span className="h-3 w-3 rounded-full bg-[#28C840]" />
                  </div>
                  <span className="text-xs uppercase tracking-[0.18em] text-white/45">
                    workspace.card
                  </span>
                </div>
                <div className="mt-5 flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-white">
                    <MonitorSmartphone className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm uppercase tracking-[0.18em] text-white/45">
                      Working style
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-white/70">
                      Clear product priorities, clean interface systems, and fast feedback loops.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="hero" className="relative flex min-h-screen items-center overflow-hidden pt-24">
      <div className="section-container relative z-10 w-full py-10 md:py-16">
        <div className="grid items-start gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:gap-10">
          <div className="max-w-3xl">
            {settings.heroSubtitle && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="premium-badge mb-6 inline-flex items-center rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.24em]"
              >
                {settings.heroSubtitle}
              </motion.p>
            )}
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="font-serif text-6xl font-bold leading-[0.95] tracking-tight text-foreground sm:text-7xl md:text-8xl lg:text-[7rem] xl:text-[8.5rem]"
            >
              {settings.heroTitle.split(" ").map((word, i) => (
                <span key={i} className="block">
                  {word}
                </span>
              ))}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg"
            >
              {heroDescription}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <HeroButtons
                primary={settings.heroCTA || "View My Work"}
                secondary={contactLabel}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.58, duration: 0.6 }}
              className="mt-10 grid gap-4 sm:grid-cols-3"
            >
              {heroStats.map((stat) => (
                <div key={stat.label} className="premium-panel rounded-[24px] p-5">
                  <p className="font-serif text-4xl font-semibold leading-none text-foreground">
                    {stat.value}
                  </p>
                  <p className="mt-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    {stat.label}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>

          <div className="grid gap-5">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="premium-panel rounded-[32px] p-3"
            >
              <HeroPortrait
                image={settings.heroImage}
                title={settings.heroTitle}
                className="aspect-[4/4.8] rounded-[28px] bg-muted"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.28, duration: 0.7 }}
              className="premium-panel-muted rounded-[28px] p-6"
            >
              <p className="text-xs uppercase tracking-[0.22em] text-primary">Studio Note</p>
              <p className="mt-4 font-serif text-2xl font-semibold leading-tight text-foreground md:text-[2rem]">
                Thoughtful product direction, refined interfaces, and engineering that stays dependable after launch.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                {settings.location && (
                  <span className="premium-chip rounded-full px-4 py-2 text-sm">
                    {settings.location}
                  </span>
                )}
                {settings.email && (
                  <span className="premium-chip rounded-full px-4 py-2 text-sm">
                    {settings.email}
                  </span>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
