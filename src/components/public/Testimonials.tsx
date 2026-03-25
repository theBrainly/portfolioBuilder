"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Quote } from "lucide-react";
import { getInitials } from "@/lib/utils";
import type { DesignPreset } from "@/constants/siteCustomization";
import type { IProject, ITestimonial } from "@/types";

export default function Testimonials({
  testimonials,
  projects,
  preset = "classic",
}: {
  testimonials: ITestimonial[];
  projects: IProject[];
  preset?: DesignPreset;
}) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);
  const next = useCallback(() => {
    setDirection(1);
    setCurrent((value) => (value + 1) % testimonials.length);
  }, [testimonials.length]);

  useEffect(() => {
    if (testimonials.length <= 1) return;
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next, testimonials.length]);

  if (!testimonials.length) return null;

  const testimonial = testimonials[current];
  const relatedProject = projects.find((project) => project._id === testimonial.projectId);
  const variants = {
    enter: (value: number) => ({ y: value > 0 ? 30 : -30, opacity: 0 }),
    center: { y: 0, opacity: 1 },
    exit: (value: number) => ({ y: value > 0 ? -30 : 30, opacity: 0 }),
  };

  const quoteText = (
    <blockquote
      className={
        preset === "retro"
          ? "font-mono text-lg leading-relaxed text-primary/85 md:text-xl"
          : preset === "os"
            ? "text-xl leading-relaxed text-white/90 md:text-2xl"
            : preset === "minimal"
              ? "text-xl leading-relaxed text-foreground md:text-2xl"
              : "font-serif text-xl leading-relaxed text-primary-foreground/90 md:text-2xl lg:text-3xl"
      }
    >
      &ldquo;{testimonial.content}&rdquo;
    </blockquote>
  );

  const author = (
    <div className="flex items-center gap-4">
      {testimonial.clientImage ? (
        <Image
          src={testimonial.clientImage}
          alt={testimonial.clientName}
          width={48}
          height={48}
          className="h-12 w-12 rounded-full object-cover"
        />
      ) : (
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold ${
            preset === "retro"
              ? "border border-primary/20 bg-primary/10 text-primary"
              : preset === "os"
                ? "bg-white/10 text-white"
                : preset === "minimal"
                  ? "bg-muted text-foreground"
                  : "border-2 border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground"
          }`}
        >
          {getInitials(testimonial.clientName)}
        </div>
      )}
      <div className="text-left">
        <p
          className={
            preset === "retro"
              ? "font-mono text-sm text-primary"
              : preset === "os"
                ? "text-sm font-semibold text-white"
                : "text-sm font-semibold"
          }
        >
          {testimonial.clientName}
        </p>
        <p
          className={
            preset === "retro"
              ? "font-mono text-xs text-primary/55"
              : preset === "os"
                ? "text-xs text-white/50"
                : preset === "minimal"
                  ? "text-xs text-muted-foreground"
                  : "text-xs text-primary-foreground/50"
          }
        >
          {testimonial.clientPosition}
        </p>
      </div>
    </div>
  );

  if (preset === "minimal") {
    return (
      <section id="testimonials" className="section-padding">
        <div className="section-container">
          <div className="mx-auto max-w-4xl text-center">
            <span className="inline-flex rounded-full border border-border px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Testimonials
            </span>
            <h2 className="mt-6 text-3xl font-semibold text-foreground md:text-4xl lg:text-5xl">
              Feedback on the work
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground">
              A quieter, more direct view of how clients and collaborators describe the experience of working together.
            </p>

            <div className="mt-10 rounded-[32px] border border-border bg-background/90 p-8 md:p-10">
              <Quote className="mx-auto h-12 w-12 text-muted-foreground/30" />
              <div className="mt-8 min-h-[220px] overflow-hidden">
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={current}
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {relatedProject && (
                      <p className="mb-5 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                        Related project: {relatedProject.title}
                      </p>
                    )}
                    {quoteText}
                    <div className="mt-10 flex justify-center">{author}</div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (preset === "retro") {
    return (
      <section id="testimonials" className="section-padding">
        <div className="section-container">
          <div className="mx-auto max-w-5xl rounded-[32px] border border-primary/20 bg-black/35 p-8 font-mono md:p-10">
            <span className="inline-flex rounded-md border border-primary/25 bg-primary/10 px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-primary/75">
              testimonials.log
            </span>
            <h2 className="mt-6 text-3xl text-primary md:text-4xl">Feedback on the build process</h2>
            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-primary/70">
              Client notes captured like system logs: communication, problem solving, and project delivery.
            </p>

            <div className="mt-10 min-h-[220px] overflow-hidden rounded-[24px] border border-primary/20 bg-primary/5 p-6">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={current}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                >
                  {relatedProject && (
                    <p className="mb-5 text-[11px] uppercase tracking-[0.18em] text-primary/60">
                      project_ref: {relatedProject.title}
                    </p>
                  )}
                  {quoteText}
                  <div className="mt-8">{author}</div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (preset === "os") {
    return (
      <section id="testimonials" className="section-padding">
        <div className="section-container">
          <div className="mx-auto max-w-5xl rounded-[34px] border border-white/10 bg-slate-950/60 p-5 backdrop-blur-xl md:p-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-[#FF5F57]" />
                <span className="h-3 w-3 rounded-full bg-[#FEBC2E]" />
                <span className="h-3 w-3 rounded-full bg-[#28C840]" />
              </div>
              <span className="text-xs uppercase tracking-[0.18em] text-white/45">
                testimonials.app
              </span>
            </div>

            <div className="grid gap-6 pt-6 md:grid-cols-[0.9fr_1.1fr]">
              <div className="rounded-[28px] bg-white/6 p-6">
                <p className="text-xs uppercase tracking-[0.18em] text-white/45">Feedback</p>
                <h2 className="mt-4 text-3xl font-semibold text-white md:text-4xl">
                  What collaborators noticed
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-white/70">
                  Delivery style, communication, and product thinking shown inside a desktop-style feedback panel.
                </p>
              </div>

              <div className="min-h-[260px] overflow-hidden rounded-[28px] bg-white/6 p-6">
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={current}
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {relatedProject && (
                      <p className="mb-5 text-xs uppercase tracking-[0.18em] text-white/45">
                        Related project: {relatedProject.title}
                      </p>
                    )}
                    {quoteText}
                    <div className="mt-10">{author}</div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="testimonials" className="section-padding">
      <div className="section-container">
        <div className="premium-panel-strong mx-auto max-w-5xl rounded-[34px] px-6 py-10 text-center text-primary-foreground md:px-10 md:py-12">
          <span className="mb-6 inline-flex items-center rounded-full border border-primary-foreground/15 bg-primary-foreground/5 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-primary-foreground/70">
            Testimonials
          </span>
          <h2 className="font-serif text-3xl font-bold leading-tight text-primary-foreground md:text-4xl lg:text-5xl">
            Feedback on the work and the way I work
          </h2>
          <p className="mx-auto mt-5 mb-10 max-w-2xl text-sm leading-relaxed text-primary-foreground/70 md:text-base">
            A few words from clients and collaborators about communication, problem solving, and the final product experience.
          </p>

          <Quote className="mx-auto mb-10 h-12 w-12 text-primary-foreground/20" />

          <div className="flex min-h-[240px] items-center overflow-hidden rounded-[28px] border border-primary-foreground/10 bg-primary-foreground/5 px-4 py-8 md:px-8">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={current}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="w-full"
              >
                {relatedProject && (
                  <p className="mb-5 text-xs uppercase tracking-[0.18em] text-primary-foreground/60">
                    Related project: {relatedProject.title}
                  </p>
                )}
                {quoteText}
                <div className="mt-10 flex justify-center">{author}</div>
              </motion.div>
            </AnimatePresence>
          </div>

          {testimonials.length > 1 && (
            <div className="mt-10 flex justify-center gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setDirection(index > current ? 1 : -1);
                    setCurrent(index);
                  }}
                  className={`rounded-full transition-all duration-300 ${
                    index === current
                      ? "h-2 w-8 bg-primary-foreground"
                      : "h-2 w-2 bg-primary-foreground/30 hover:bg-primary-foreground/50"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
