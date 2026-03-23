"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowDown, Github, Linkedin, Twitter, Download } from "lucide-react";
import CountUp from "@/components/animations/CountUp";
import type { ISiteSettings } from "@/types";

export default function Hero({ settings }: { settings: ISiteSettings | null }) {
  if (!settings) return null;
  const socials = [
    { icon: Github, url: settings.github, label: "GitHub" },
    { icon: Linkedin, url: settings.linkedin, label: "LinkedIn" },
    { icon: Twitter, url: settings.twitter, label: "Twitter" },
  ].filter((s) => s.url);

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="section-container relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center py-20 md:py-0">
          <div className="order-2 lg:order-1 text-center lg:text-left">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-surface border border-border rounded-full mb-6">
              <span className="text-lg">👋</span><span className="text-sm text-text-secondary font-medium">Welcome to my portfolio</span>
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] mb-6 text-text-primary">
              {settings.heroTitle.split(" ").map((word, i, arr) => (
                <span key={i}>{i >= arr.length - 2 ? <span className="gradient-text">{word}</span> : word}{i < arr.length - 1 ? " " : ""}</span>
              ))}
            </motion.h1>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mb-6">
              <span className="text-xl md:text-2xl font-mono text-primary font-medium">{"< "}{settings.heroSubtitle}{" />"}</span>
            </motion.div>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
              className="text-text-secondary text-lg leading-relaxed max-w-xl mx-auto lg:mx-0 mb-8">{settings.heroDescription}</motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
              className="flex flex-wrap gap-4 justify-center lg:justify-start mb-10">
              <button onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}
                className="group px-8 py-3.5 bg-primary text-white font-medium rounded-xl hover:bg-primary-light transition-all shadow-lg shadow-primary/25 flex items-center gap-2">
                {settings.heroCTA || "View My Work"}<ArrowDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
              </button>
              {settings.resumeUrl && (
                <a href={settings.resumeUrl} target="_blank" rel="noopener noreferrer"
                  className="px-8 py-3.5 border-2 border-border text-text-primary font-medium rounded-xl hover:border-primary hover:text-primary transition-all flex items-center gap-2">
                  <Download className="w-4 h-4" />Resume
                </a>
              )}
            </motion.div>

            {socials.length > 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="flex items-center gap-1 justify-center lg:justify-start">
                <span className="w-8 h-px bg-border mr-3" />
                {socials.map((s) => (
                  <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer"
                    className="p-2.5 text-text-muted hover:text-primary hover:bg-primary/10 rounded-xl transition-all" aria-label={s.label}>
                    <s.icon className="w-5 h-5" />
                  </a>
                ))}
              </motion.div>
            )}
          </div>

          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.3 }}
            className="order-1 lg:order-2 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-3xl scale-110" />
              <div className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-full overflow-hidden border-4 border-surface shadow-2xl">
                {settings.heroImage ? <Image src={settings.heroImage} alt={settings.heroTitle} fill className="object-cover" priority />
                  : <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center"><span className="text-8xl">👨‍💻</span></div>}
              </div>
              <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-4 -right-4 px-4 py-2 bg-surface border border-border rounded-2xl shadow-lg">
                <span className="text-2xl font-bold gradient-text"><CountUp end={settings.yearsOfExperience} suffix="+" /></span>
                <p className="text-xs text-text-muted">Years Exp.</p>
              </motion.div>
              <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -bottom-4 -left-4 px-4 py-2 bg-surface border border-border rounded-2xl shadow-lg">
                <span className="text-2xl font-bold gradient-text"><CountUp end={settings.totalProjects} suffix="+" /></span>
                <p className="text-xs text-text-muted">Projects</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
