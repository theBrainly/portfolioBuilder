"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send, ChevronsRight, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import MotionWrapper from "@/components/animations/MotionWrapper";
import { contactSchema, ContactFormData } from "@/lib/validations";
import toast from "react-hot-toast";
import { cn } from "@/lib/cn";
import type { ISiteSettings } from "@/types";

export default function ContactSection({ settings }: { settings: ISiteSettings | null }) {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({ resolver: zodResolver(contactSchema) });

  const onSubmit = async (data: ContactFormData) => {
    setSubmitting(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          portfolioSlug: settings?.portfolioSlug || "",
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      setSubmitted(true);
      reset();
      toast.success("Message sent!");
      setTimeout(() => {
        setSubmitted(false);
        setShowForm(false);
      }, 5000);
    } catch (error: any) {
      toast.error(error.message || "Failed to send");
    } finally {
      setSubmitting(false);
    }
  };

  const preset = settings?.designPreset || "classic";
  const contactCTA = settings?.navbarCTA || "Hire Me Now";
  const alwaysShowForm = preset === "minimal" || preset === "os";
  const shouldShowForm = alwaysShowForm || showForm;

  const inputClass = cn(
    "w-full rounded-xl px-4 py-3 text-sm focus:outline-none",
    preset === "retro"
      ? "border border-primary/20 bg-primary/5 font-mono text-primary placeholder:text-primary/30 focus:border-primary/40"
      : preset === "os"
        ? "border border-white/10 bg-white/5 text-white placeholder:text-white/35 focus:border-white/20"
        : preset === "minimal"
          ? "border border-border bg-background text-foreground placeholder:text-muted-foreground"
          : "border border-primary-foreground/10 bg-primary-foreground/5 text-primary-foreground placeholder:text-primary-foreground/35 focus:border-primary/40"
  );

  const renderForm = () => (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <h3
        className={cn(
          "mb-6 text-2xl font-bold",
          preset === "retro"
            ? "font-mono text-primary"
            : preset === "os"
              ? "font-display text-white"
              : preset === "minimal"
                ? "text-foreground"
                : "font-serif text-primary-foreground"
        )}
      >
        Tell me about your project
      </h3>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label
            className={cn(
              "mb-1.5 block text-xs",
              preset === "retro"
                ? "font-mono text-primary/55"
                : preset === "os"
                  ? "text-white/55"
                  : preset === "minimal"
                    ? "text-muted-foreground"
                    : "text-primary-foreground/50"
            )}
          >
            Name
          </label>
          <input {...register("name")} placeholder="Your name" className={inputClass} />
          {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>}
        </div>

        <div>
          <label
            className={cn(
              "mb-1.5 block text-xs",
              preset === "retro"
                ? "font-mono text-primary/55"
                : preset === "os"
                  ? "text-white/55"
                  : preset === "minimal"
                    ? "text-muted-foreground"
                    : "text-primary-foreground/50"
            )}
          >
            Email
          </label>
          <input
            {...register("email")}
            type="email"
            placeholder="you@email.com"
            className={inputClass}
          />
          {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
        </div>
      </div>

      <div>
        <label
          className={cn(
            "mb-1.5 block text-xs",
            preset === "retro"
              ? "font-mono text-primary/55"
              : preset === "os"
                ? "text-white/55"
                : preset === "minimal"
                  ? "text-muted-foreground"
                  : "text-primary-foreground/50"
          )}
        >
          Subject
        </label>
        <input {...register("subject")} placeholder="What's this about?" className={inputClass} />
        {errors.subject && <p className="mt-1 text-xs text-red-400">{errors.subject.message}</p>}
      </div>

      <div>
        <label
          className={cn(
            "mb-1.5 block text-xs",
            preset === "retro"
              ? "font-mono text-primary/55"
              : preset === "os"
                ? "text-white/55"
                : preset === "minimal"
                  ? "text-muted-foreground"
                  : "text-primary-foreground/50"
          )}
        >
          Message
        </label>
        <textarea
          {...register("message")}
          rows={5}
          placeholder="Tell me about your project..."
          className={cn(inputClass, "resize-none")}
        />
        {errors.message && <p className="mt-1 text-xs text-red-400">{errors.message.message}</p>}
      </div>

      <button
        type="submit"
        disabled={submitting}
        className={cn(
          "flex w-full items-center justify-center gap-2 px-6 py-3.5 disabled:opacity-50",
          preset === "retro"
            ? "rounded-md border border-primary/40 bg-primary/10 font-mono text-xs uppercase tracking-[0.18em] text-primary"
            : preset === "os"
              ? "rounded-xl bg-white text-sm font-semibold text-slate-950"
            : preset === "minimal"
              ? "rounded-full bg-primary text-sm font-medium text-primary-foreground"
                : "premium-button rounded-full text-sm font-semibold"
        )}
      >
        {submitting ? "Sending..." : "Send Message"}
        <Send className="h-4 w-4" />
      </button>
    </form>
  );

  if (preset === "minimal") {
    return (
      <section id="contact" className="section-padding">
        <div className="section-container">
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <MotionWrapper>
              <div className="rounded-[32px] border border-border bg-background/90 p-8">
                <span className="inline-flex rounded-full border border-border px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Contact
                </span>
                <h2 className="mt-6 text-4xl font-semibold leading-tight text-foreground md:text-5xl">
                  Let&apos;s build something meaningful
                </h2>
                <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">
                  Whether you need a new product, a stronger frontend, or help refining an existing experience, I&apos;m happy to talk through the work.
                </p>
                <div className="mt-8 space-y-2 text-sm text-muted-foreground">
                  <p>{settings?.email}</p>
                  {settings?.phone && <p>{settings.phone}</p>}
                  {settings?.location && <p>{settings.location}</p>}
                </div>
              </div>
            </MotionWrapper>
            <MotionWrapper delay={0.1}>
              <div className="rounded-[32px] border border-border bg-background/90 p-8">
                {submitted ? (
                  <div className="py-12 text-center">
                    <CheckCircle2 className="mx-auto mb-4 h-16 w-16 text-green-500" />
                    <h3 className="text-xl font-semibold text-foreground">Message Sent!</h3>
                    <p className="mt-2 text-muted-foreground">
                      Thank you! I&apos;ll get back to you soon.
                    </p>
                  </div>
                ) : (
                  renderForm()
                )}
              </div>
            </MotionWrapper>
          </div>
        </div>
      </section>
    );
  }

  if (preset === "retro") {
    return (
      <section id="contact" className="section-padding">
        <div className="section-container">
          <div className="mx-auto max-w-5xl rounded-[32px] border border-primary/20 bg-black/35 p-8 font-mono md:p-10">
            <span className="inline-flex rounded-md border border-primary/25 bg-primary/10 px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-primary/75">
              contact.sys
            </span>
            <div className="mt-6 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
              <div>
                <h2 className="text-4xl leading-tight text-primary md:text-5xl">
                  Let&apos;s build something meaningful
                </h2>
                <p className="mt-5 max-w-xl text-sm leading-relaxed text-primary/70">
                  Whether you need a new product, a stronger frontend, or help refining an existing experience, I&apos;m happy to talk through the work.
                </p>
                <div className="mt-8 space-y-2 text-sm text-primary/65">
                  <p>mail: {settings?.email}</p>
                  {settings?.phone && <p>phone: {settings.phone}</p>}
                  {settings?.location && <p>location: {settings.location}</p>}
                </div>
              </div>

              <div className="rounded-[24px] border border-primary/20 bg-primary/5 p-6">
                {submitted ? (
                  <div className="py-12 text-center">
                    <CheckCircle2 className="mx-auto mb-4 h-16 w-16 text-primary" />
                    <h3 className="text-lg text-primary">Message Sent!</h3>
                    <p className="mt-2 text-sm text-primary/65">
                      Thank you! I&apos;ll get back to you soon.
                    </p>
                  </div>
                ) : (
                  renderForm()
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (preset === "os") {
    return (
      <section id="contact" className="section-padding">
        <div className="section-container">
          <div className="rounded-[34px] border border-white/10 bg-slate-950/60 p-5 backdrop-blur-xl md:p-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-[#FF5F57]" />
                <span className="h-3 w-3 rounded-full bg-[#FEBC2E]" />
                <span className="h-3 w-3 rounded-full bg-[#28C840]" />
              </div>
              <span className="text-xs uppercase tracking-[0.18em] text-white/45">
                contact.app
              </span>
            </div>

            <div className="grid gap-6 pt-6 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="rounded-[28px] bg-white/6 p-6">
                <p className="text-xs uppercase tracking-[0.18em] text-white/45">Contact</p>
                <h2 className="mt-4 text-4xl font-semibold leading-tight text-white md:text-5xl">
                  Let&apos;s build something meaningful
                </h2>
                <p className="mt-5 max-w-xl text-base leading-relaxed text-white/70">
                  Whether you need a new product, a stronger frontend, or help refining an existing experience, I&apos;m happy to talk through the work.
                </p>
                <div className="mt-8 space-y-2 text-sm text-white/65">
                  <p>{settings?.email}</p>
                  {settings?.phone && <p>{settings.phone}</p>}
                  {settings?.location && <p>{settings.location}</p>}
                </div>
              </div>

              <div className="rounded-[28px] bg-white/6 p-6">
                {submitted ? (
                  <div className="py-12 text-center">
                    <CheckCircle2 className="mx-auto mb-4 h-16 w-16 text-white" />
                    <h3 className="text-xl font-semibold text-white">Message Sent!</h3>
                    <p className="mt-2 text-white/65">
                      Thank you! I&apos;ll get back to you soon.
                    </p>
                  </div>
                ) : (
                  renderForm()
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className="section-padding">
      <div className="section-container">
        <div className="premium-panel-strong rounded-[36px] px-6 py-10 text-primary-foreground md:px-10 md:py-12">
          <AnimatePresence mode="wait">
          {!shouldShowForm ? (
            <motion.div key="cta" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
                <MotionWrapper>
                  <div className="max-w-3xl">
                    <span className="mb-5 inline-flex items-center rounded-full border border-primary-foreground/15 bg-primary-foreground/5 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-primary-foreground/70">
                      Contact
                    </span>
                    <h2 className="font-serif text-5xl font-bold leading-[1.05] text-primary-foreground md:text-6xl lg:text-7xl xl:text-8xl">
                      Let&apos;s build something meaningful
                    </h2>
                    <p className="mt-5 max-w-xl text-sm leading-relaxed text-primary-foreground/70 md:text-base">
                      Whether you need a new product, a stronger frontend, or help refining an existing experience, I&apos;m happy to talk through the work.
                    </p>
                  </div>
                </MotionWrapper>

                <MotionWrapper delay={0.2}>
                  <button
                    onClick={() => setShowForm(true)}
                    className="group flex items-center gap-3 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-6 py-3 text-primary-foreground transition-all hover:bg-primary-foreground/18"
                  >
                    <ChevronsRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                    <span className="text-sm font-medium">{contactCTA}</span>
                  </button>
                </MotionWrapper>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mx-auto max-w-2xl rounded-[30px] border border-primary-foreground/10 bg-primary-foreground/5 p-6 md:p-8"
            >
              {!alwaysShowForm && (
                <button
                  onClick={() => setShowForm(false)}
                  className="mb-6 text-sm text-primary-foreground/50 transition-colors hover:text-primary-foreground"
                >
                  ← Back
                </button>
              )}

              {submitted ? (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="py-12 text-center">
                  <CheckCircle2 className="mx-auto mb-4 h-16 w-16 text-green-400" />
                  <h3 className="mb-2 text-xl font-bold text-primary-foreground">Message Sent!</h3>
                  <p className="text-primary-foreground/60">
                    Thank you! I&apos;ll get back to you soon.
                  </p>
                </motion.div>
              ) : (
                renderForm()
              )}
            </motion.div>
          )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
