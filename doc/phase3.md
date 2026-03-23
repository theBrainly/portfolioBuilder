

# Phase 3: Complete Public Portfolio Website

## Theme Provider (Dark/Light Mode)

### `src/components/ThemeProvider.tsx`
```tsx
"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "dark",
  toggleTheme: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("portfolio-theme") as Theme;
    if (saved) {
      setTheme(saved);
      document.documentElement.setAttribute("data-theme", saved);
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("portfolio-theme", next);
    document.documentElement.setAttribute("data-theme", next);
  };

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
```

---

## Animation Wrapper Components

### `src/components/animations/MotionWrapper.tsx`
```tsx
"use client";

import { motion, Variants } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

interface MotionWrapperProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
  once?: boolean;
}

export default function MotionWrapper({
  children,
  className = "",
  delay = 0,
  direction = "up",
  once = true,
}: MotionWrapperProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin: "-80px" });

  const directions = {
    up: { y: 40, x: 0 },
    down: { y: -40, x: 0 },
    left: { y: 0, x: -40 },
    right: { y: 0, x: 40 },
  };

  return (
    <motion.div
      ref={ref}
      initial={{
        opacity: 0,
        x: directions[direction].x,
        y: directions[direction].y,
      }}
      animate={
        isInView
          ? { opacity: 1, x: 0, y: 0 }
          : {
              opacity: 0,
              x: directions[direction].x,
              y: directions[direction].y,
            }
      }
      transition={{
        duration: 0.6,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
```

### `src/components/animations/StaggerContainer.tsx`
```tsx
"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

interface StaggerContainerProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
}

export function StaggerContainer({
  children,
  className = "",
  staggerDelay = 0.1,
}: StaggerContainerProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
```

### `src/components/animations/CountUp.tsx`
```tsx
"use client";

import { useEffect, useState, useRef } from "react";
import { useInView } from "framer-motion";

interface CountUpProps {
  end: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
}

export default function CountUp({
  end,
  duration = 2000,
  suffix = "",
  prefix = "",
}: CountUpProps) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isInView || hasAnimated.current) return;
    hasAnimated.current = true;

    let startTime: number;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);

      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isInView, end, duration]);

  return (
    <span ref={ref}>
      {prefix}
      {count}
      {suffix}
    </span>
  );
}
```

### `src/components/animations/TextReveal.tsx`
```tsx
"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface TextRevealProps {
  children: string;
  className?: string;
  delay?: number;
}

export default function TextReveal({
  children,
  className = "",
  delay = 0,
}: TextRevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const words = children.split(" ");

  return (
    <span ref={ref} className={className}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden">
          <motion.span
            className="inline-block"
            initial={{ y: "100%" }}
            animate={isInView ? { y: 0 } : { y: "100%" }}
            transition={{
              duration: 0.5,
              delay: delay + i * 0.04,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {word}
            {i < words.length - 1 ? "\u00A0" : ""}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
```

---

## Background Effects

### `src/components/effects/GridBackground.tsx`
```tsx
"use client";

export default function GridBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(var(--text-muted) 1px, transparent 1px),
            linear-gradient(90deg, var(--text-muted) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Gradient Blobs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[120px]" />
      <div className="absolute top-1/2 right-0 w-[300px] h-[300px] bg-accent/5 rounded-full blur-[100px]" />
    </div>
  );
}
```

### `src/components/effects/FloatingParticles.tsx`
```tsx
"use client";

import { motion } from "framer-motion";

export default function FloatingParticles() {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 1,
    duration: Math.random() * 10 + 10,
    delay: Math.random() * 5,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-primary/20"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
```

---

## Section Header

### `src/components/public/SectionHeader.tsx`
```tsx
"use client";

import MotionWrapper from "@/components/animations/MotionWrapper";

interface SectionHeaderProps {
  label: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}

export default function SectionHeader({
  label,
  title,
  description,
  align = "center",
}: SectionHeaderProps) {
  return (
    <MotionWrapper className={`mb-12 md:mb-16 ${align === "center" ? "text-center" : ""}`}>
      <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-mono font-medium rounded-full mb-4">
        {label}
      </span>
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary text-balance">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-text-secondary max-w-2xl mx-auto text-lg leading-relaxed">
          {description}
        </p>
      )}
    </MotionWrapper>
  );
}
```

---

## Navbar

### `src/components/public/Navbar.tsx`
```tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sun, Moon, Download, Code2 } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { useScrollSpy } from "@/hooks/useScrollSpy";
import { cn } from "@/lib/utils";
import type { ISiteSettings } from "@/types";

const NAV_LINKS = [
  { label: "About", href: "about" },
  { label: "Projects", href: "projects" },
  { label: "Experience", href: "experience" },
  { label: "Skills", href: "skills" },
  { label: "Testimonials", href: "testimonials" },
  { label: "Contact", href: "contact" },
];

interface NavbarProps {
  settings: ISiteSettings | null;
}

export default function Navbar({ settings }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const activeSection = useScrollSpy(
    NAV_LINKS.map((l) => l.href),
    120
  );

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [mobileOpen]);

  const scrollTo = (id: string) => {
    setMobileOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled
            ? "bg-background/80 backdrop-blur-xl border-b border-border shadow-lg shadow-background/20"
            : "bg-transparent"
        )}
      >
        <div className="section-container">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="flex items-center gap-2.5 group"
            >
              <div className="w-9 h-9 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center group-hover:shadow-lg group-hover:shadow-primary/25 transition-shadow">
                <Code2 className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg hidden sm:block">
                {settings?.heroTitle?.split(" ").pop() || "Portfolio"}
              </span>
            </button>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.href}
                  onClick={() => scrollTo(link.href)}
                  className={cn(
                    "relative px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                    activeSection === link.href
                      ? "text-primary"
                      : "text-text-secondary hover:text-text-primary"
                  )}
                >
                  {link.label}
                  {activeSection === link.href && (
                    <motion.div
                      layoutId="navIndicator"
                      className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary rounded-full"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2.5 rounded-xl hover:bg-surface-2 text-text-secondary hover:text-text-primary transition-all"
                aria-label="Toggle theme"
              >
                <AnimatePresence mode="wait" initial={false}>
                  {theme === "dark" ? (
                    <motion.div
                      key="sun"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Sun className="w-5 h-5" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="moon"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Moon className="w-5 h-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>

              {/* Resume Button */}
              {settings?.resumeUrl && (
                <a
                  href={settings.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden md:flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-light transition-colors shadow-lg shadow-primary/25"
                >
                  <Download className="w-4 h-4" />
                  Resume
                </a>
              )}

              {/* Mobile Toggle */}
              <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden p-2.5 rounded-xl hover:bg-surface-2 transition-colors"
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[280px] bg-surface border-l border-border z-50 lg:hidden"
            >
              <div className="flex items-center justify-between p-4 border-b border-border">
                <span className="font-bold text-lg">Menu</span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 hover:bg-surface-2 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="p-4 space-y-1">
                {NAV_LINKS.map((link, i) => (
                  <motion.button
                    key={link.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => scrollTo(link.href)}
                    className={cn(
                      "w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                      activeSection === link.href
                        ? "bg-primary/10 text-primary"
                        : "text-text-secondary hover:text-text-primary hover:bg-surface-2"
                    )}
                  >
                    {link.label}
                  </motion.button>
                ))}

                {settings?.resumeUrl && (
                  <a
                    href={settings.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-3 mt-4 bg-primary text-white text-sm font-medium rounded-xl"
                  >
                    <Download className="w-4 h-4" />
                    Download Resume
                  </a>
                )}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
```

---

## Hero Section

### `src/components/public/Hero.tsx`
```tsx
"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import {
  ArrowDown,
  Github,
  Linkedin,
  Twitter,
  Instagram,
  Download,
} from "lucide-react";
import CountUp from "@/components/animations/CountUp";
import FloatingParticles from "@/components/effects/FloatingParticles";
import type { ISiteSettings } from "@/types";

interface HeroProps {
  settings: ISiteSettings | null;
}

export default function Hero({ settings }: HeroProps) {
  if (!settings) return null;

  const socials = [
    { icon: Github, url: settings.github, label: "GitHub" },
    { icon: Linkedin, url: settings.linkedin, label: "LinkedIn" },
    { icon: Twitter, url: settings.twitter, label: "Twitter" },
    { icon: Instagram, url: settings.instagram, label: "Instagram" },
  ].filter((s) => s.url);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      <FloatingParticles />

      <div className="section-container relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center py-20 md:py-0">
          {/* Text Content */}
          <div className="order-2 lg:order-1 text-center lg:text-left">
            {/* Greeting */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-surface border border-border rounded-full mb-6"
            >
              <span className="animate-pulse text-lg">👋</span>
              <span className="text-sm text-text-secondary font-medium">
                Welcome to my portfolio
              </span>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] mb-6"
            >
              {settings.heroTitle.split(" ").map((word, i, arr) => (
                <span key={i}>
                  {i >= arr.length - 2 ? (
                    <span className="gradient-text">{word}</span>
                  ) : (
                    word
                  )}
                  {i < arr.length - 1 ? " " : ""}
                </span>
              ))}
            </motion.h1>

            {/* Subtitle */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mb-6"
            >
              <span className="text-xl md:text-2xl font-mono text-primary font-medium">
                {"< "}
                {settings.heroSubtitle}
                {" />"}
              </span>
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-text-secondary text-lg leading-relaxed max-w-xl mx-auto lg:mx-0 mb-8"
            >
              {settings.heroDescription}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-wrap gap-4 justify-center lg:justify-start mb-10"
            >
              <button
                onClick={() =>
                  document
                    .getElementById("projects")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="group px-8 py-3.5 bg-primary text-white font-medium rounded-xl hover:bg-primary-light transition-all shadow-lg shadow-primary/25 hover:shadow-primary/40 flex items-center gap-2"
              >
                {settings.heroCTA || "View My Work"}
                <ArrowDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
              </button>

              {settings.resumeUrl && (
                <a
                  href={settings.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-3.5 border-2 border-border text-text-primary font-medium rounded-xl hover:border-primary hover:text-primary transition-all flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Resume
                </a>
              )}
            </motion.div>

            {/* Social Links */}
            {socials.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="flex items-center gap-1 justify-center lg:justify-start"
              >
                <span className="w-8 h-px bg-border mr-3" />
                {socials.map((social) => (
                  <a
                    key={social.label}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 text-text-muted hover:text-primary hover:bg-primary/10 rounded-xl transition-all"
                    aria-label={social.label}
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </motion.div>
            )}
          </div>

          {/* Image / Avatar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="order-1 lg:order-2 flex justify-center"
          >
            <div className="relative">
              {/* Glow Ring */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-3xl scale-110" />

              {/* Image Container */}
              <div className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-full overflow-hidden border-4 border-surface shadow-2xl">
                {settings.heroImage ? (
                  <Image
                    src={settings.heroImage}
                    alt={settings.heroTitle}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                    <span className="text-8xl">👨‍💻</span>
                  </div>
                )}
              </div>

              {/* Floating Badges */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-4 -right-4 px-4 py-2 bg-surface border border-border rounded-2xl shadow-lg"
              >
                <span className="text-2xl font-bold gradient-text">
                  <CountUp end={settings.yearsOfExperience} suffix="+" />
                </span>
                <p className="text-xs text-text-muted">Years Exp.</p>
              </motion.div>

              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }}
                className="absolute -bottom-4 -left-4 px-4 py-2 bg-surface border border-border rounded-2xl shadow-lg"
              >
                <span className="text-2xl font-bold gradient-text">
                  <CountUp end={settings.totalProjects} suffix="+" />
                </span>
                <p className="text-xs text-text-muted">Projects</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 border-2 border-text-muted rounded-full flex justify-center pt-2"
        >
          <div className="w-1 h-2 bg-text-muted rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}
```

---

## About Section

### `src/components/public/About.tsx`
```tsx
"use client";

import Image from "next/image";
import { User, FolderGit2, Users, Award } from "lucide-react";
import MotionWrapper from "@/components/animations/MotionWrapper";
import CountUp from "@/components/animations/CountUp";
import SectionHeader from "./SectionHeader";
import type { ISiteSettings } from "@/types";

interface AboutProps {
  settings: ISiteSettings | null;
}

export default function About({ settings }: AboutProps) {
  if (!settings) return null;

  const stats = [
    {
      icon: Award,
      value: settings.yearsOfExperience,
      label: "Years Experience",
      suffix: "+",
    },
    {
      icon: FolderGit2,
      value: settings.totalProjects,
      label: "Projects Completed",
      suffix: "+",
    },
    {
      icon: Users,
      value: settings.totalClients,
      label: "Happy Clients",
      suffix: "+",
    },
  ];

  return (
    <section id="about" className="section-padding">
      <div className="section-container">
        <SectionHeader
          label="// about me"
          title={settings.aboutTitle || "About Me"}
        />

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image */}
          <MotionWrapper direction="left">
            <div className="relative max-w-md mx-auto lg:mx-0">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl blur-2xl scale-105" />
              <div className="relative rounded-3xl overflow-hidden border-2 border-border aspect-[4/5]">
                {settings.aboutImage ? (
                  <Image
                    src={settings.aboutImage}
                    alt="About me"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                    <User className="w-24 h-24 text-text-muted" />
                  </div>
                )}
              </div>

              {/* Experience Badge */}
              <div className="absolute -bottom-6 -right-6 bg-surface border border-border rounded-2xl p-4 shadow-xl">
                <div className="text-3xl font-bold gradient-text">
                  <CountUp
                    end={settings.yearsOfExperience}
                    suffix="+"
                  />
                </div>
                <p className="text-sm text-text-muted">Years of<br />Experience</p>
              </div>
            </div>
          </MotionWrapper>

          {/* Content */}
          <MotionWrapper direction="right">
            <div className="space-y-6">
              {/* Terminal Style Header */}
              <div className="bg-surface border border-border rounded-xl p-4 font-mono text-sm">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-3 h-3 bg-red-500 rounded-full" />
                  <span className="w-3 h-3 bg-yellow-500 rounded-full" />
                  <span className="w-3 h-3 bg-green-500 rounded-full" />
                  <span className="ml-2 text-text-muted text-xs">
                    about.ts
                  </span>
                </div>
                <div>
                  <span className="text-primary">const</span>{" "}
                  <span className="text-secondary">developer</span>{" "}
                  <span className="text-text-muted">=</span>{" "}
                  <span className="text-accent">{"{"}</span>
                  <br />
                  <span className="ml-4 text-text-secondary">
                    passion: <span className="text-green-400">&quot;Building things&quot;</span>,
                  </span>
                  <br />
                  <span className="ml-4 text-text-secondary">
                    focus: <span className="text-green-400">&quot;Full Stack Development&quot;</span>,
                  </span>
                  <br />
                  <span className="ml-4 text-text-secondary">
                    loves: <span className="text-green-400">&quot;Clean Code&quot;</span>
                  </span>
                  <br />
                  <span className="text-accent">{"}"}</span>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-4 text-text-secondary leading-relaxed">
                {settings.aboutDescription.split("\n").map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 pt-4">
                {stats.map((stat, i) => (
                  <div
                    key={i}
                    className="text-center p-4 bg-surface border border-border rounded-2xl hover:border-primary/30 transition-colors"
                  >
                    <stat.icon className="w-5 h-5 text-primary mx-auto mb-2" />
                    <div className="text-2xl font-bold">
                      <CountUp end={stat.value} suffix={stat.suffix} />
                    </div>
                    <p className="text-xs text-text-muted mt-1">
                      {stat.label}
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
```

---

## Projects Section

### `src/components/public/ProjectCard.tsx`
```tsx
"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Github, ArrowUpRight } from "lucide-react";
import Badge from "@/components/ui/Badge";
import type { IProject } from "@/types";

interface ProjectCardProps {
  project: IProject;
  index: number;
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.16, 1, 0.3, 1],
      }}
      viewport={{ once: true }}
      className="group"
    >
      <div className="bg-surface border border-border rounded-2xl overflow-hidden hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-500">
        {/* Thumbnail */}
        <Link href={`/projects/${project.slug}`}>
          <div className="relative h-48 sm:h-56 overflow-hidden">
            {project.thumbnail ? (
              <Image
                src={project.thumbnail}
                alt={project.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                <span className="text-4xl">🚀</span>
              </div>
            )}

            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Quick Links */}
            <div className="absolute bottom-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="p-2 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors shadow-lg"
                  aria-label="View live"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="p-2 bg-surface-2 text-text-primary rounded-lg hover:bg-surface transition-colors shadow-lg border border-border"
                  aria-label="View code"
                >
                  <Github className="w-4 h-4" />
                </a>
              )}
            </div>

            {/* Featured Badge */}
            {project.isFeatured && (
              <div className="absolute top-3 left-3">
                <Badge variant="primary" size="sm">
                  ⭐ Featured
                </Badge>
              </div>
            )}
          </div>
        </Link>

        {/* Content */}
        <div className="p-5">
          <div className="flex items-start justify-between gap-2 mb-2">
            <Link href={`/projects/${project.slug}`}>
              <h3 className="font-semibold text-lg group-hover:text-primary transition-colors line-clamp-1">
                {project.title}
              </h3>
            </Link>
            <Link
              href={`/projects/${project.slug}`}
              className="p-1 text-text-muted hover:text-primary transition-colors flex-shrink-0"
            >
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          <p className="text-text-secondary text-sm leading-relaxed line-clamp-2 mb-4">
            {project.shortDescription}
          </p>

          {/* Tech Stack */}
          <div className="flex flex-wrap gap-1.5">
            {project.techStack.slice(0, 4).map((tech) => (
              <span
                key={tech}
                className="px-2.5 py-1 bg-surface-2 text-text-secondary text-xs font-mono rounded-md"
              >
                {tech}
              </span>
            ))}
            {project.techStack.length > 4 && (
              <span className="px-2.5 py-1 bg-surface-2 text-text-muted text-xs font-mono rounded-md">
                +{project.techStack.length - 4}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
```

### `src/components/public/ProjectsSection.tsx`
```tsx
"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProjectCard from "./ProjectCard";
import SectionHeader from "./SectionHeader";
import type { IProject } from "@/types";

const CATEGORIES = ["All", "Full Stack", "Frontend", "Backend", "Mobile"];

interface ProjectsSectionProps {
  projects: IProject[];
}

export default function ProjectsSection({ projects }: ProjectsSectionProps) {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredProjects = useMemo(() => {
    if (activeCategory === "All") return projects;
    return projects.filter((p) => p.category === activeCategory);
  }, [projects, activeCategory]);

  // Only show categories that have projects
  const availableCategories = CATEGORIES.filter(
    (cat) => cat === "All" || projects.some((p) => p.category === cat)
  );

  return (
    <section id="projects" className="section-padding">
      <div className="section-container">
        <SectionHeader
          label="// projects"
          title="What I've Built"
          description="Here are some of my recent projects that showcase my skills and experience"
        />

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {availableCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="relative px-5 py-2.5 text-sm font-medium rounded-xl transition-colors"
            >
              {activeCategory === cat && (
                <motion.div
                  layoutId="projectFilter"
                  className="absolute inset-0 bg-primary rounded-xl"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <span
                className={`relative z-10 ${
                  activeCategory === cat
                    ? "text-white"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                {cat}
              </span>
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredProjects.map((project, i) => (
              <ProjectCard key={project._id} project={project} index={i} />
            ))}
          </motion.div>
        </AnimatePresence>

        {filteredProjects.length === 0 && (
          <div className="text-center py-16">
            <p className="text-text-muted text-lg">
              No projects in this category yet.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
```

---

## Experience Timeline

### `src/components/public/ExperienceTimeline.tsx`
```tsx
"use client";

import { motion } from "framer-motion";
import { Briefcase, Calendar, ExternalLink } from "lucide-react";
import Badge from "@/components/ui/Badge";
import MotionWrapper from "@/components/animations/MotionWrapper";
import SectionHeader from "./SectionHeader";
import { formatDate } from "@/lib/utils";
import type { IExperience } from "@/types";

interface ExperienceTimelineProps {
  experiences: IExperience[];
}

export default function ExperienceTimeline({
  experiences,
}: ExperienceTimelineProps) {
  if (experiences.length === 0) return null;

  return (
    <section id="experience" className="section-padding">
      <div className="section-container">
        <SectionHeader
          label="// experience"
          title="Where I've Worked"
          description="My professional journey and the companies I've contributed to"
        />

        <div className="relative max-w-3xl mx-auto">
          {/* Vertical Line */}
          <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-border md:-translate-x-px" />

          {experiences.map((exp, index) => (
            <MotionWrapper
              key={exp._id}
              delay={index * 0.15}
              className={`relative mb-12 last:mb-0 ${
                index % 2 === 0
                  ? "md:pr-[50%] md:text-right"
                  : "md:pl-[50%] md:text-left"
              } pl-8 md:pl-0`}
            >
              {/* Timeline Dot */}
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 + 0.2, type: "spring" }}
                className={`absolute top-2 w-4 h-4 rounded-full border-4 border-background z-10 ${
                  exp.isCurrent
                    ? "bg-primary shadow-lg shadow-primary/30"
                    : "bg-border"
                } left-0 md:left-1/2 -translate-x-1/2`}
              />

              {/* Card */}
              <div
                className={`bg-surface border border-border rounded-2xl p-6 hover:border-primary/20 hover:shadow-lg transition-all ${
                  index % 2 === 0 ? "md:mr-8" : "md:ml-8"
                }`}
              >
                {/* Date */}
                <div
                  className={`flex items-center gap-2 text-sm text-text-muted mb-3 ${
                    index % 2 === 0
                      ? "md:justify-end"
                      : "justify-start"
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>
                    {formatDate(exp.startDate)} –{" "}
                    {exp.isCurrent
                      ? "Present"
                      : exp.endDate
                      ? formatDate(exp.endDate)
                      : "N/A"}
                  </span>
                </div>

                {/* Position & Company */}
                <h3 className="text-xl font-bold mb-1">{exp.position}</h3>
                <div
                  className={`flex items-center gap-2 mb-3 ${
                    index % 2 === 0
                      ? "md:justify-end"
                      : "justify-start"
                  }`}
                >
                  <span className="text-primary font-medium">
                    {exp.company}
                  </span>
                  {exp.companyUrl && (
                    <a
                      href={exp.companyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-text-muted hover:text-primary transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>

                {/* Type Badge */}
                <div
                  className={`flex gap-2 mb-3 ${
                    index % 2 === 0
                      ? "md:justify-end"
                      : "justify-start"
                  }`}
                >
                  <Badge variant="primary" size="sm">
                    {exp.type}
                  </Badge>
                  {exp.isCurrent && (
                    <Badge variant="success" size="sm">
                      Current
                    </Badge>
                  )}
                </div>

                {/* Description */}
                <p
                  className={`text-text-secondary text-sm leading-relaxed mb-4 ${
                    index % 2 === 0 ? "md:text-right" : ""
                  }`}
                >
                  {exp.description}
                </p>

                {/* Responsibilities */}
                {exp.responsibilities && exp.responsibilities.length > 0 && (
                  <ul
                    className={`space-y-1.5 mb-4 ${
                      index % 2 === 0
                        ? "md:text-right"
                        : ""
                    }`}
                  >
                    {exp.responsibilities.map((resp, i) => (
                      <li
                        key={i}
                        className="text-sm text-text-secondary flex items-start gap-2"
                        style={
                          index % 2 === 0
                            ? { flexDirection: "row-reverse" }
                            : {}
                        }
                      >
                        <span className="text-primary mt-1.5 text-[8px]">●</span>
                        {resp}
                      </li>
                    ))}
                  </ul>
                )}

                {/* Tech Used */}
                {exp.techUsed && exp.techUsed.length > 0 && (
                  <div
                    className={`flex flex-wrap gap-1.5 ${
                      index % 2 === 0
                        ? "md:justify-end"
                        : "justify-start"
                    }`}
                  >
                    {exp.techUsed.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-0.5 bg-surface-2 text-text-muted text-xs font-mono rounded"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </MotionWrapper>
          ))}
        </div>
      </div>
    </section>
  );
}
```

---

## Skills Section

### `src/components/public/SkillsSection.tsx`
```tsx
"use client";

import { motion } from "framer-motion";
import { StaggerContainer, StaggerItem } from "@/components/animations/StaggerContainer";
import SectionHeader from "./SectionHeader";
import { TECH_ICON_MAP } from "@/constants";
import type { ISkill } from "@/types";

interface SkillsSectionProps {
  skills: ISkill[];
}

export default function SkillsSection({ skills }: SkillsSectionProps) {
  if (skills.length === 0) return null;

  // Group by category
  const grouped = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, ISkill[]>);

  const categoryOrder = ["Frontend", "Backend", "Database", "DevOps", "Tools", "Other"];
  const sortedCategories = Object.keys(grouped).sort(
    (a, b) => categoryOrder.indexOf(a) - categoryOrder.indexOf(b)
  );

  return (
    <section id="skills" className="section-padding bg-surface/30">
      <div className="section-container">
        <SectionHeader
          label="// skills"
          title="Technologies I Use"
          description="The tools and technologies I work with on a daily basis"
        />

        <div className="space-y-12">
          {sortedCategories.map((category) => (
            <div key={category}>
              <motion.h3
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="text-lg font-semibold mb-6 flex items-center gap-3"
              >
                <span className="w-8 h-px bg-primary" />
                <span className="font-mono text-primary text-sm">
                  {category}
                </span>
                <span className="flex-1 h-px bg-border" />
              </motion.h3>

              <StaggerContainer className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {grouped[category].map((skill) => (
                  <StaggerItem key={skill._id}>
                    <motion.div
                      whileHover={{ y: -5, scale: 1.02 }}
                      className="group bg-surface border border-border rounded-2xl p-5 text-center hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all cursor-default"
                    >
                      {/* Icon */}
                      <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">
                        {TECH_ICON_MAP[skill.name] || skill.icon || "🔧"}
                      </div>

                      {/* Name */}
                      <p className="text-sm font-medium mb-2 text-text-primary">
                        {skill.name}
                      </p>

                      {/* Progress Bar */}
                      <div className="h-1 bg-surface-2 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.proficiency}%` }}
                          viewport={{ once: true }}
                          transition={{
                            duration: 1,
                            delay: 0.3,
                            ease: "easeOut",
                          }}
                          className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                        />
                      </div>
                      <p className="text-xs text-text-muted mt-1 font-mono">
                        {skill.proficiency}%
                      </p>
                    </motion.div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

---

## Testimonials

### `src/components/public/Testimonials.tsx`
```tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import SectionHeader from "./SectionHeader";
import { getInitials } from "@/lib/utils";
import type { ITestimonial } from "@/types";

interface TestimonialsProps {
  testimonials: ITestimonial[];
}

export default function Testimonials({ testimonials }: TestimonialsProps) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  if (testimonials.length === 0) return null;

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % testimonials.length);
  }, [testimonials.length]);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrent(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  }, [testimonials.length]);

  // Auto-play
  useEffect(() => {
    if (testimonials.length <= 1) return;
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next, testimonials.length]);

  const t = testimonials[current];

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 200 : -200,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -200 : 200,
      opacity: 0,
    }),
  };

  return (
    <section id="testimonials" className="section-padding">
      <div className="section-container">
        <SectionHeader
          label="// testimonials"
          title="What Clients Say"
          description="Feedback from people I've had the pleasure of working with"
        />

        <div className="relative max-w-3xl mx-auto">
          {/* Navigation Arrows */}
          {testimonials.length > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-14 z-10 p-2.5 bg-surface border border-border rounded-full hover:border-primary/30 hover:text-primary transition-all shadow-lg hidden sm:block"
                aria-label="Previous"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={next}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-14 z-10 p-2.5 bg-surface border border-border rounded-full hover:border-primary/30 hover:text-primary transition-all shadow-lg hidden sm:block"
                aria-label="Next"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Testimonial Card */}
          <div className="overflow-hidden">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={current}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="bg-surface border border-border rounded-3xl p-8 md:p-12 text-center relative"
              >
                {/* Quote Icon */}
                <Quote className="w-12 h-12 text-primary/10 mx-auto mb-6" />

                {/* Stars */}
                <div className="flex justify-center gap-1 mb-6">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < t.rating
                          ? "text-amber-400 fill-amber-400"
                          : "text-border"
                      }`}
                    />
                  ))}
                </div>

                {/* Content */}
                <blockquote className="text-lg md:text-xl text-text-secondary leading-relaxed mb-8 italic">
                  &ldquo;{t.content}&rdquo;
                </blockquote>

                {/* Author */}
                <div className="flex items-center justify-center gap-4">
                  {t.clientImage ? (
                    <Image
                      src={t.clientImage}
                      alt={t.clientName}
                      width={56}
                      height={56}
                      className="w-14 h-14 rounded-full object-cover border-2 border-border"
                    />
                  ) : (
                    <div className="w-14 h-14 bg-primary/10 text-primary rounded-full flex items-center justify-center text-lg font-bold border-2 border-primary/20">
                      {getInitials(t.clientName)}
                    </div>
                  )}
                  <div className="text-left">
                    <p className="font-semibold text-text-primary">
                      {t.clientName}
                    </p>
                    <p className="text-sm text-text-muted">
                      {t.clientPosition}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Dots */}
          {testimonials.length > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setDirection(index > current ? 1 : -1);
                    setCurrent(index);
                  }}
                  className={`transition-all duration-300 rounded-full ${
                    index === current
                      ? "w-8 h-2.5 bg-primary"
                      : "w-2.5 h-2.5 bg-border hover:bg-text-muted"
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          )}

          {/* Mobile Swipe Hint */}
          {testimonials.length > 1 && (
            <div className="flex justify-center gap-4 mt-4 sm:hidden">
              <button
                onClick={prev}
                className="p-2 bg-surface-2 rounded-lg"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={next}
                className="p-2 bg-surface-2 rounded-lg"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
```

---

## Contact Form

### `src/components/public/ContactSection.tsx`
```tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import {
  Send,
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin,
  Twitter,
  Instagram,
  CheckCircle2,
} from "lucide-react";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";
import MotionWrapper from "@/components/animations/MotionWrapper";
import SectionHeader from "./SectionHeader";
import { contactSchema, ContactFormData } from "@/lib/validations";
import toast from "react-hot-toast";
import type { ISiteSettings } from "@/types";

interface ContactSectionProps {
  settings: ISiteSettings | null;
}

export default function ContactSection({ settings }: ContactSectionProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error);

      setIsSubmitted(true);
      reset();
      toast.success("Message sent successfully!");

      setTimeout(() => setIsSubmitted(false), 5000);
    } catch (error: any) {
      toast.error(error.message || "Failed to send message");
    } finally {
      setIsSubmitting(false);
    }
  };

  const socials = [
    { icon: Github, url: settings?.github, label: "GitHub" },
    { icon: Linkedin, url: settings?.linkedin, label: "LinkedIn" },
    { icon: Twitter, url: settings?.twitter, label: "Twitter" },
    { icon: Instagram, url: settings?.instagram, label: "Instagram" },
  ].filter((s) => s.url);

  const contactInfo = [
    { icon: Mail, value: settings?.email, label: "Email", href: `mailto:${settings?.email}` },
    { icon: Phone, value: settings?.phone, label: "Phone", href: `tel:${settings?.phone}` },
    { icon: MapPin, value: settings?.location, label: "Location" },
  ].filter((c) => c.value);

  return (
    <section id="contact" className="section-padding">
      <div className="section-container">
        <SectionHeader
          label="// contact"
          title="Get In Touch"
          description="Have a project in mind or want to collaborate? I'd love to hear from you!"
        />

        <div className="grid lg:grid-cols-5 gap-12 max-w-5xl mx-auto">
          {/* Contact Info */}
          <MotionWrapper direction="left" className="lg:col-span-2">
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold mb-4">
                  Let&apos;s work{" "}
                  <span className="gradient-text">together!</span>
                </h3>
                <p className="text-text-secondary leading-relaxed">
                  I&apos;m always open to new opportunities and interesting
                  projects. Whether you have a question or just want to say
                  hi, feel free to reach out.
                </p>
              </div>

              {/* Contact Details */}
              <div className="space-y-4">
                {contactInfo.map((item) => (
                  <div key={item.label} className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-text-muted uppercase tracking-wider">
                        {item.label}
                      </p>
                      {item.href ? (
                        <a
                          href={item.href}
                          className="text-text-primary hover:text-primary transition-colors font-medium"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <p className="text-text-primary font-medium">
                          {item.value}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Social Links */}
              {socials.length > 0 && (
                <div>
                  <p className="text-sm text-text-muted mb-3">
                    Find me on
                  </p>
                  <div className="flex gap-2">
                    {socials.map((social) => (
                      <a
                        key={social.label}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 bg-surface border border-border rounded-xl text-text-secondary hover:text-primary hover:border-primary/30 hover:shadow-lg transition-all"
                        aria-label={social.label}
                      >
                        <social.icon className="w-5 h-5" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </MotionWrapper>

          {/* Contact Form */}
          <MotionWrapper direction="right" className="lg:col-span-3">
            <div className="bg-surface border border-border rounded-3xl p-6 md:p-8">
              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <CheckCircle2 className="w-16 h-16 text-secondary mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">Message Sent!</h3>
                  <p className="text-text-secondary">
                    Thank you for reaching out. I&apos;ll get back to you soon!
                  </p>
                </motion.div>
              ) : (
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-5"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Input
                      label="Name"
                      placeholder="Your name"
                      error={errors.name?.message}
                      {...register("name")}
                    />
                    <Input
                      label="Email"
                      type="email"
                      placeholder="you@email.com"
                      error={errors.email?.message}
                      {...register("email")}
                    />
                  </div>

                  <Input
                    label="Subject"
                    placeholder="What's this about?"
                    error={errors.subject?.message}
                    {...register("subject")}
                  />

                  <Textarea
                    label="Message"
                    placeholder="Tell me about your project or idea..."
                    rows={5}
                    error={errors.message?.message}
                    {...register("message")}
                  />

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full"
                    isLoading={isSubmitting}
                    rightIcon={<Send className="w-4 h-4" />}
                  >
                    Send Message
                  </Button>
                </form>
              )}
            </div>
          </MotionWrapper>
        </div>
      </div>
    </section>
  );
}
```

---

## Footer

### `src/components/public/Footer.tsx`
```tsx
"use client";

import { Code2, Heart, Github, Linkedin, Twitter, Instagram, ArrowUp } from "lucide-react";
import type { ISiteSettings } from "@/types";

interface FooterProps {
  settings: ISiteSettings | null;
}

export default function Footer({ settings }: FooterProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const socials = [
    { icon: Github, url: settings?.github, label: "GitHub" },
    { icon: Linkedin, url: settings?.linkedin, label: "LinkedIn" },
    { icon: Twitter, url: settings?.twitter, label: "Twitter" },
    { icon: Instagram, url: settings?.instagram, label: "Instagram" },
  ].filter((s) => s.url);

  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-surface/50">
      <div className="section-container">
        <div className="py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Logo & Credit */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <Code2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-sm">
                  {settings?.heroTitle?.split(" ").pop() || "Portfolio"}
                </p>
                <p className="text-xs text-text-muted flex items-center gap-1">
                  Built with <Heart className="w-3 h-3 text-accent fill-accent" /> using Next.js
                </p>
              </div>
            </div>

            {/* Social Links */}
            {socials.length > 0 && (
              <div className="flex items-center gap-1">
                {socials.map((social) => (
                  <a
                    key={social.label}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 text-text-muted hover:text-primary hover:bg-primary/10 rounded-xl transition-all"
                    aria-label={social.label}
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            )}

            {/* Copyright & Back to Top */}
            <div className="flex items-center gap-4">
              <p className="text-sm text-text-muted">
                © {year} All rights reserved.
              </p>
              <button
                onClick={scrollToTop}
                className="p-2 bg-surface-2 border border-border rounded-xl hover:border-primary/30 hover:text-primary transition-all"
                aria-label="Back to top"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
```

---

## Public Layout

### `src/app/(public)/layout.tsx`
```tsx
import ThemeProvider from "@/components/ThemeProvider";
import GridBackground from "@/components/effects/GridBackground";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <GridBackground />
      {children}
    </ThemeProvider>
  );
}
```

---

## Home Page (Main Portfolio)

### `src/app/(public)/page.tsx`
```tsx
import Navbar from "@/components/public/Navbar";
import Hero from "@/components/public/Hero";
import About from "@/components/public/About";
import ProjectsSection from "@/components/public/ProjectsSection";
import ExperienceTimeline from "@/components/public/ExperienceTimeline";
import SkillsSection from "@/components/public/SkillsSection";
import Testimonials from "@/components/public/Testimonials";
import ContactSection from "@/components/public/ContactSection";
import Footer from "@/components/public/Footer";
import connectDB from "@/lib/db";
import Project from "@/models/Project";
import Experience from "@/models/Experience";
import Skill from "@/models/Skill";
import Testimonial from "@/models/Testimonial";
import Settings from "@/models/Settings";
import type { Metadata } from "next";

async function getData() {
  await connectDB();

  const [projects, experiences, skills, testimonials, settings] =
    await Promise.all([
      Project.find({ isVisible: true })
        .sort({ order: 1, createdAt: -1 })
        .lean(),
      Experience.find({ isVisible: true })
        .sort({ order: 1, startDate: -1 })
        .lean(),
      Skill.find({ isVisible: true })
        .sort({ order: 1, category: 1 })
        .lean(),
      Testimonial.find({ isVisible: true })
        .sort({ order: 1, createdAt: -1 })
        .lean(),
      Settings.findOne().lean(),
    ]);

  return {
    projects: JSON.parse(JSON.stringify(projects)),
    experiences: JSON.parse(JSON.stringify(experiences)),
    skills: JSON.parse(JSON.stringify(skills)),
    testimonials: JSON.parse(JSON.stringify(testimonials)),
    settings: settings ? JSON.parse(JSON.stringify(settings)) : null,
  };
}

export async function generateMetadata(): Promise<Metadata> {
  await connectDB();
  const settings = await Settings.findOne().lean();

  return {
    title: settings?.siteTitle || "Portfolio | Developer",
    description: settings?.siteDescription || "Full Stack Developer Portfolio",
    openGraph: {
      title: settings?.siteTitle || "Portfolio",
      description: settings?.siteDescription || "",
      images: settings?.ogImage ? [settings.ogImage] : [],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: settings?.siteTitle || "Portfolio",
      description: settings?.siteDescription || "",
      images: settings?.ogImage ? [settings.ogImage] : [],
    },
  };
}

export const revalidate = 60; // ISR: Revalidate every 60 seconds

export default async function HomePage() {
  const { projects, experiences, skills, testimonials, settings } =
    await getData();

  return (
    <>
      <Navbar settings={settings} />

      <main>
        <Hero settings={settings} />
        <About settings={settings} />
        <ProjectsSection projects={projects} />
        <ExperienceTimeline experiences={experiences} />
        <SkillsSection skills={skills} />
        <Testimonials testimonials={testimonials} />
        <ContactSection settings={settings} />
      </main>

      <Footer settings={settings} />
    </>
  );
}
```

---

## Project Detail Page

### `src/app/(public)/projects/[slug]/page.tsx`
```tsx
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ExternalLink,
  Github,
  Calendar,
  User,
  ChevronRight,
} from "lucide-react";
import connectDB from "@/lib/db";
import Project from "@/models/Project";
import Settings from "@/models/Settings";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import Badge from "@/components/ui/Badge";
import ProjectDetailClient from "./ProjectDetailClient";
import { formatFullDate } from "@/lib/utils";
import type { Metadata } from "next";

interface Props {
  params: { slug: string };
}

async function getProject(slug: string) {
  await connectDB();
  const project = await Project.findOne({ slug, isVisible: true }).lean();
  return project ? JSON.parse(JSON.stringify(project)) : null;
}

async function getRelated(category: string, excludeSlug: string) {
  await connectDB();
  const projects = await Project.find({
    isVisible: true,
    category,
    slug: { $ne: excludeSlug },
  })
    .limit(3)
    .sort({ createdAt: -1 })
    .lean();
  return JSON.parse(JSON.stringify(projects));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = await getProject(params.slug);
  if (!project) return { title: "Project Not Found" };

  return {
    title: `${project.title} | Portfolio`,
    description: project.shortDescription,
    openGraph: {
      title: project.title,
      description: project.shortDescription,
      images: project.thumbnail ? [project.thumbnail] : [],
    },
  };
}

export const revalidate = 60;

export default async function ProjectDetailPage({ params }: Props) {
  const project = await getProject(params.slug);
  if (!project) notFound();

  const relatedProjects = await getRelated(project.category, project.slug);
  await connectDB();
  const settings = await Settings.findOne().lean();
  const settingsData = settings ? JSON.parse(JSON.stringify(settings)) : null;

  return (
    <>
      <Navbar settings={settingsData} />

      <main className="pt-24 pb-20">
        <div className="section-container">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-text-muted mb-8">
            <Link
              href="/#projects"
              className="hover:text-primary transition-colors flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" />
              Projects
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-text-primary">{project.title}</span>
          </div>

          {/* Hero Image */}
          {project.thumbnail && (
            <div className="relative w-full h-64 sm:h-80 md:h-[450px] rounded-3xl overflow-hidden border border-border mb-10">
              <Image
                src={project.thumbnail}
                alt={project.title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
            </div>
          )}

          <div className="grid lg:grid-cols-3 gap-10">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-4">
                  {project.title}
                </h1>
                <p className="text-text-secondary text-lg leading-relaxed">
                  {project.shortDescription}
                </p>
              </div>

              {/* Full Description */}
              {project.longDescription && (
                <div className="prose prose-invert max-w-none">
                  <h2 className="text-xl font-semibold mb-4">
                    About This Project
                  </h2>
                  <div className="text-text-secondary leading-relaxed space-y-4">
                    {project.longDescription
                      .split("\n")
                      .map((p: string, i: number) => (
                        <p key={i}>{p}</p>
                      ))}
                  </div>
                </div>
              )}

              {/* Gallery */}
              {project.images && project.images.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Gallery</h2>
                  <ProjectDetailClient images={project.images} />
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Actions */}
              <div className="flex gap-3">
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white font-medium rounded-xl hover:bg-primary-light transition-colors shadow-lg shadow-primary/25"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Live Demo
                  </a>
                )}
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 border-2 border-border text-text-primary font-medium rounded-xl hover:border-primary hover:text-primary transition-all"
                  >
                    <Github className="w-4 h-4" />
                    Source Code
                  </a>
                )}
              </div>

              {/* Project Info */}
              <div className="bg-surface border border-border rounded-2xl p-6 space-y-5">
                <h3 className="font-semibold text-lg">Project Details</h3>

                {project.clientName && (
                  <div className="flex items-center gap-3">
                    <User className="w-4 h-4 text-text-muted" />
                    <div>
                      <p className="text-xs text-text-muted">Client</p>
                      <p className="text-sm font-medium">
                        {project.clientName}
                      </p>
                    </div>
                  </div>
                )}

                {project.completionDate && (
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-text-muted" />
                    <div>
                      <p className="text-xs text-text-muted">Completed</p>
                      <p className="text-sm font-medium">
                        {formatFullDate(project.completionDate)}
                      </p>
                    </div>
                  </div>
                )}

                <div>
                  <p className="text-xs text-text-muted mb-1">Category</p>
                  <Badge variant="primary">{project.category}</Badge>
                </div>
              </div>

              {/* Tech Stack */}
              <div className="bg-surface border border-border rounded-2xl p-6">
                <h3 className="font-semibold text-lg mb-4">Tech Stack</h3>
                <div className="flex flex-wrap gap-2">
                  {project.techStack.map((tech: string) => (
                    <span
                      key={tech}
                      className="px-3 py-1.5 bg-surface-2 text-text-secondary text-sm font-mono rounded-lg border border-border"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Related Projects */}
          {relatedProjects.length > 0 && (
            <div className="mt-20">
              <h2 className="text-2xl font-bold mb-8">More Projects</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedProjects.map((rp: any) => (
                  <Link
                    key={rp._id}
                    href={`/projects/${rp.slug}`}
                    className="group bg-surface border border-border rounded-2xl overflow-hidden hover:border-primary/30 transition-all"
                  >
                    <div className="relative h-40 overflow-hidden">
                      {rp.thumbnail ? (
                        <Image
                          src={rp.thumbnail}
                          alt={rp.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-surface-2 flex items-center justify-center">
                          <span className="text-3xl">🚀</span>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold group-hover:text-primary transition-colors">
                        {rp.title}
                      </h3>
                      <p className="text-sm text-text-muted mt-1 line-clamp-1">
                        {rp.shortDescription}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer settings={settingsData} />
    </>
  );
}
```

### `src/app/(public)/projects/[slug]/ProjectDetailClient.tsx`
```tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface ProjectDetailClientProps {
  images: string[];
}

export default function ProjectDetailClient({
  images,
}: ProjectDetailClientProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const openLightbox = (index: number) => {
    setActiveIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = "";
  };

  const goNext = () => setActiveIndex((prev) => (prev + 1) % images.length);
  const goPrev = () =>
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length);

  return (
    <>
      {/* Gallery Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {images.map((img, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.02 }}
            onClick={() => openLightbox(index)}
            className="relative aspect-video rounded-xl overflow-hidden border border-border hover:border-primary/30 transition-all cursor-zoom-in"
          >
            <Image
              src={img}
              alt={`Screenshot ${index + 1}`}
              fill
              className="object-cover"
            />
          </motion.button>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
            onClick={closeLightbox}
          >
            {/* Close */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 p-2 text-white/70 hover:text-white bg-white/10 rounded-full z-10"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Nav */}
            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    goPrev();
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 text-white/70 hover:text-white bg-white/10 rounded-full z-10"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    goNext();
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 text-white/70 hover:text-white bg-white/10 rounded-full z-10"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            {/* Image */}
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="relative w-[90vw] h-[80vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={images[activeIndex]}
                alt={`Screenshot ${activeIndex + 1}`}
                fill
                className="object-contain"
              />
            </motion.div>

            {/* Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-sm">
              {activeIndex + 1} / {images.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
```

---

## Not Found Page

### `src/app/not-found.tsx`
```tsx
import Link from "next/link";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-8xl font-bold gradient-text mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
        <p className="text-text-secondary mb-8 max-w-md mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-medium rounded-xl hover:bg-primary-light transition-colors shadow-lg shadow-primary/25"
          >
            <Home className="w-4 h-4" />
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
```

---

## Loading Page

### `src/app/(public)/loading.tsx`
```tsx
export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-border border-t-primary rounded-full animate-spin mx-auto mb-4" />
        <p className="text-text-muted text-sm">Loading...</p>
      </div>
    </div>
  );
}
```

---

## SEO Files

### `src/app/sitemap.ts`
```ts
import { MetadataRoute } from "next";
import connectDB from "@/lib/db";
import Project from "@/models/Project";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://yourdomain.com";

  await connectDB();
  const projects = await Project.find({ isVisible: true })
    .select("slug updatedAt")
    .lean();

  const projectUrls = projects.map((project) => ({
    url: `${baseUrl}/projects/${project.slug}`,
    lastModified: project.updatedAt || new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...projectUrls,
  ];
}
```

### `src/app/robots.ts`
```ts
import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://yourdomain.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/admin/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
```

---

## Updated Root Layout with JSON-LD

### `src/app/layout.tsx` (updated)
```tsx
import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
});

export const metadata: Metadata = {
  title: {
    default: "Portfolio | Full Stack Developer",
    template: "%s | Portfolio",
  },
  description:
    "Full Stack Developer portfolio showcasing projects, experience, and skills.",
  keywords: [
    "developer",
    "portfolio",
    "full stack",
    "react",
    "nextjs",
    "web developer",
  ],
  authors: [{ name: "Developer" }],
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Developer",
              url: process.env.NEXT_PUBLIC_SITE_URL,
              jobTitle: "Full Stack Developer",
              sameAs: [],
            }),
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "var(--surface)",
              color: "var(--text-primary)",
              border: "1px solid var(--border-color)",
            },
            success: {
              iconTheme: {
                primary: "#00D4AA",
                secondary: "var(--surface)",
              },
            },
            error: {
              iconTheme: {
                primary: "#FF6B6B",
                secondary: "var(--surface)",
              },
            },
          }}
        />
      </body>
    </html>
  );
}
```

---

## Add missing watch to Skills page (Phase 2 fix)

In `src/app/admin/skills/page.tsx`, the `watch` function was already destructured from `useForm`. However, inside the modal form, the range input references `watch("proficiency")`. This already works since `watch` was imported in the destructuring. No fix needed.

---

## CSS Additions for globals.css (append to existing)

### Append to `src/app/globals.css`
```css
/* Add to the bottom of globals.css */

/* Prose styling for project descriptions */
.prose {
  color: var(--text-secondary);
}

.prose h2,
.prose h3 {
  color: var(--text-primary);
}

.prose a {
  color: var(--primary);
  text-decoration: underline;
}

.prose strong {
  color: var(--text-primary);
}

.prose code {
  color: var(--primary);
  background: var(--surface-2);
  padding: 2px 6px;
  border-radius: 4px;
  font-family: var(--font-jetbrains);
  font-size: 0.875em;
}

/* Line clamp utilities */
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-4 {
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Smooth section transitions */
section {
  position: relative;
}

/* Admin specific */
.admin-content {
  min-height: 100vh;
}

/* Range input custom styling */
input[type="range"] {
  -webkit-appearance: none;
  appearance: none;
  height: 6px;
  background: var(--surface-2);
  border-radius: 3px;
  outline: none;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--primary);
  cursor: pointer;
  border: 3px solid var(--background);
  box-shadow: 0 0 0 2px var(--primary);
}

input[type="range"]::-moz-range-thumb {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--primary);
  cursor: pointer;
  border: 3px solid var(--background);
  box-shadow: 0 0 0 2px var(--primary);
}

/* Hide scrollbar for carousels */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
```

---

## File Count Summary

```
PHASE 3 FILES CREATED:
═══════════════════════════════════════════════════

ANIMATION COMPONENTS (4 files):
  ├── MotionWrapper.tsx
  ├── StaggerContainer.tsx (+ StaggerItem)
  ├── CountUp.tsx
  └── TextReveal.tsx

EFFECTS (2 files):
  ├── GridBackground.tsx
  └── FloatingParticles.tsx

THEME (1 file):
  └── ThemeProvider.tsx

PUBLIC COMPONENTS (9 files):
  ├── Navbar.tsx
  ├── Hero.tsx
  ├── About.tsx
  ├── SectionHeader.tsx
  ├── ProjectCard.tsx
  ├── ProjectsSection.tsx
  ├── ExperienceTimeline.tsx
  ├── SkillsSection.tsx
  ├── Testimonials.tsx
  ├── ContactSection.tsx
  └── Footer.tsx

PAGES (5 files):
  ├── (public)/layout.tsx
  ├── (public)/page.tsx               (Home)
  ├── (public)/loading.tsx
  ├── (public)/projects/[slug]/page.tsx
  ├── (public)/projects/[slug]/ProjectDetailClient.tsx
  └── not-found.tsx

SEO (2 files):
  ├── sitemap.ts
  └── robots.ts

UPDATED (2 files):
  ├── layout.tsx                      (JSON-LD + meta)
  └── globals.css                     (extra styles)

═══════════════════════════════════════════════════
TOTAL: 25 files
═══════════════════════════════════════════════════


COMPLETE PROJECT STATUS:
═══════════════════════════════════════════════════

Phase 1 ✅  Foundation         (48 files)
Phase 2 ✅  Admin Panel CRUD   (27 files)
Phase 3 ✅  Public Website     (25 files)
────────────────────────────────────────────
GRAND TOTAL:                   ~100 files
═══════════════════════════════════════════════════

FEATURES DELIVERED:
═══════════════════════════════════════════════════
PUBLIC SITE:
  ✅ Sticky Navbar with scroll spy + active section
  ✅ Animated Hero with floating badges + particles
  ✅ About section with terminal-style code block
  ✅ Projects grid with category filtering
  ✅ Project detail page with lightbox gallery
  ✅ Experience timeline (alternating layout)
  ✅ Skills grouped by category with progress bars
  ✅ Testimonials carousel with auto-play
  ✅ Contact form with validation + email
  ✅ Footer with social links
  ✅ Dark / Light theme toggle
  ✅ Framer Motion animations throughout
  ✅ Count-up stats animation
  ✅ Staggered reveal on scroll
  ✅ ISR revalidation (60 seconds)
  ✅ Full SEO (meta, OG, JSON-LD, sitemap, robots)
  ✅ Fully responsive (mobile-first)
  ✅ 404 Not Found page
  ✅ Loading states

ADMIN PANEL:
  ✅ Secure login with NextAuth
  ✅ Dashboard with stats
  ✅ Projects CRUD + image upload
  ✅ Experience CRUD
  ✅ Skills CRUD with proficiency
  ✅ Testimonials CRUD with ratings
  ✅ Messages inbox (read/star/delete)
  ✅ Full site settings management
  ✅ Protected API routes
═══════════════════════════════════════════════════

TO RUN:
  1. npm run dev
  2. Visit /api/seed (creates admin)
  3. Visit /admin/login (login)
  4. Add content via admin panel
  5. Visit / (see your portfolio!)
═══════════════════════════════════════════════════
```

Your complete portfolio is now **fully built across all 3 phases** — from database to admin panel to the animated public site. Add your real data through the admin panel and deploy to Vercel!