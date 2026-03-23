"use client";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import SectionHeader from "./SectionHeader";
import { getInitials } from "@/lib/utils";
import type { ITestimonial } from "@/types";

export default function Testimonials({ testimonials }: { testimonials: ITestimonial[] }) {
  const [cur, setCur] = useState(0);
  const [dir, setDir] = useState(0);
  if (!testimonials.length) return null;

  const next = useCallback(() => { setDir(1); setCur((p) => (p + 1) % testimonials.length); }, [testimonials.length]);
  const prev = useCallback(() => { setDir(-1); setCur((p) => (p - 1 + testimonials.length) % testimonials.length); }, [testimonials.length]);

  useEffect(() => { if (testimonials.length <= 1) return; const t = setInterval(next, 6000); return () => clearInterval(t); }, [next, testimonials.length]);

  const t = testimonials[cur];
  const variants = {
    enter: (d: number) => ({ x: d > 0 ? 200 : -200, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -200 : 200, opacity: 0 }),
  };

  return (
    <section id="testimonials" className="section-padding">
      <div className="section-container">
        <SectionHeader label="// testimonials" title="What Clients Say" description="Feedback from people I've worked with" />
        <div className="relative max-w-3xl mx-auto">
          {testimonials.length > 1 && (
            <>
              <button onClick={prev} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-14 z-10 p-2.5 bg-surface border border-border rounded-full hover:border-primary/30 hover:text-primary transition-all shadow-lg hidden sm:block text-text-muted"><ChevronLeft className="w-5 h-5" /></button>
              <button onClick={next} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-14 z-10 p-2.5 bg-surface border border-border rounded-full hover:border-primary/30 hover:text-primary transition-all shadow-lg hidden sm:block text-text-muted"><ChevronRight className="w-5 h-5" /></button>
            </>
          )}
          <div className="overflow-hidden">
            <AnimatePresence mode="wait" custom={dir}>
              <motion.div key={cur} custom={dir} variants={variants} initial="enter" animate="center" exit="exit"
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="bg-surface border border-border rounded-3xl p-8 md:p-12 text-center relative">
                <Quote className="w-12 h-12 text-primary/10 mx-auto mb-6" />
                <div className="flex justify-center gap-1 mb-6">
                  {Array.from({ length: 5 }).map((_, i) => <Star key={i} className={`w-5 h-5 ${i < t.rating ? "text-amber-400 fill-amber-400" : "text-border"}`} />)}
                </div>
                <blockquote className="text-lg md:text-xl text-text-secondary leading-relaxed mb-8 italic">&ldquo;{t.content}&rdquo;</blockquote>
                <div className="flex items-center justify-center gap-4">
                  {t.clientImage ? <Image src={t.clientImage} alt={t.clientName} width={56} height={56} className="w-14 h-14 rounded-full object-cover border-2 border-border" />
                    : <div className="w-14 h-14 bg-primary/10 text-primary rounded-full flex items-center justify-center text-lg font-bold border-2 border-primary/20">{getInitials(t.clientName)}</div>}
                  <div className="text-left"><p className="font-semibold text-text-primary">{t.clientName}</p><p className="text-sm text-text-muted">{t.clientPosition}</p></div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
          {testimonials.length > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {testimonials.map((_, i) => (
                <button key={i} onClick={() => { setDir(i > cur ? 1 : -1); setCur(i); }}
                  className={`transition-all duration-300 rounded-full ${i === cur ? "w-8 h-2.5 bg-primary" : "w-2.5 h-2.5 bg-border hover:bg-text-muted"}`} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
