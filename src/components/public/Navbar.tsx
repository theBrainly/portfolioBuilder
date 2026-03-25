"use client";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { useScrollSpy } from "@/hooks/useScrollSpy";
import { cn } from "@/lib/cn";
import { getPortfolioHomePath, getPortfolioSectionHref } from "@/lib/portfolioUrl";
import type { ISiteSettings } from "@/types";
import {
  DEFAULT_SECTION_LABELS,
  HOME_SECTION_OPTIONS,
} from "@/constants/siteCustomization";

function WindowDots() {
  return (
    <div className="flex items-center gap-1.5">
      <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
      <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" />
      <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
    </div>
  );
}

function getNavLinks(settings: ISiteSettings | null) {
  const order = settings?.homeSectionOrder?.length
    ? settings.homeSectionOrder
    : HOME_SECTION_OPTIONS.map((section) => section.id);

  return order
    .map((sectionId) => HOME_SECTION_OPTIONS.find((section) => section.id === sectionId))
    .filter((section): section is (typeof HOME_SECTION_OPTIONS)[number] => !!section && section.isNavigable)
    .map((section) => ({
      href: section.id,
      label:
        settings?.sectionLabels?.[section.id as keyof typeof DEFAULT_SECTION_LABELS] ||
        DEFAULT_SECTION_LABELS[section.id as keyof typeof DEFAULT_SECTION_LABELS],
    }));
}

export default function Navbar({ settings }: { settings: ISiteSettings | null }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const links = getNavLinks(settings);
  const active = useScrollSpy(links.map((link) => link.href), 120);
  const preset = settings?.designPreset || "classic";
  const homePath = getPortfolioHomePath(settings);
  const isHomePage = pathname === homePath;

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => { document.body.style.overflow = mobileOpen ? "hidden" : ""; }, [mobileOpen]);

  const scrollTo = (id: string) => {
    setMobileOpen(false);
    if (isHomePage) {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    router.push(getPortfolioSectionHref(id, settings));
  };

  const goHome = () => {
    setMobileOpen(false);

    if (isHomePage) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    router.push(homePath);
  };

  const brandName = settings?.brandName || settings?.siteTitle || "Portfolio";
  const brandMark = settings?.brandMark || brandName.charAt(0);
  const navbarCTA = settings?.navbarCTA || "Hire Me";
  const navShellClass = cn(
    "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
    preset === "minimal"
      ? "px-4 pt-4"
      : preset === "os"
        ? "px-4 pt-4"
        : preset === "retro"
          ? scrolled
            ? "border-b border-primary/20 bg-black/80 backdrop-blur"
            : "border-b border-primary/10 bg-black/40 backdrop-blur-sm"
          : "px-4 pt-4"
  );
  const navSurfaceClass = cn(
    "mx-auto flex items-center justify-between",
    preset === "minimal"
      ? "max-w-5xl rounded-full border border-border/70 bg-background/90 px-5 py-3 shadow-lg backdrop-blur-xl"
      : preset === "os"
        ? "max-w-6xl rounded-[24px] border border-white/10 bg-slate-950/65 px-4 py-3 shadow-2xl backdrop-blur-xl"
        : preset === "retro"
          ? "section-container h-16 md:h-[4.5rem]"
          : cn(
              "max-w-6xl rounded-[26px] px-4 py-3",
              "premium-panel",
              scrolled ? "shadow-[0_22px_60px_-38px_hsl(var(--primary-color)/0.55)]" : "shadow-[0_22px_60px_-42px_hsl(var(--primary-color)/0.42)]"
            )
  );
  const brandMarkClass = cn(
    "flex items-center justify-center",
    preset === "minimal"
      ? "h-9 w-9 rounded-full bg-primary text-primary-foreground"
      : preset === "os"
        ? "h-9 w-9 rounded-xl bg-white/10 text-white ring-1 ring-white/10"
        : preset === "retro"
          ? "h-9 min-w-9 rounded-md border border-primary/30 bg-primary/10 px-2 font-mono text-primary"
          : "h-10 w-10 rounded-2xl premium-button"
  );
  const brandTextClass = cn(
    "text-foreground",
    preset === "minimal"
      ? "font-display text-lg font-semibold"
      : preset === "os"
        ? "font-display text-lg font-semibold text-white"
        : preset === "retro"
          ? "font-mono text-base uppercase tracking-[0.18em] text-primary"
          : "font-display text-lg font-semibold tracking-[0.14em] uppercase"
  );
  const linkBaseClass = cn(
    "relative transition-colors",
    preset === "minimal"
      ? "rounded-full px-4 py-2 text-sm"
      : preset === "os"
        ? "rounded-xl px-4 py-2 text-sm"
        : preset === "retro"
      ? "rounded-md px-3 py-2 font-mono text-xs uppercase tracking-[0.18em]"
          : "rounded-full px-4 py-2 text-sm font-medium"
  );
  const activeLinkClass =
    preset === "retro"
      ? "bg-primary/15 text-primary"
      : preset === "os"
        ? "bg-white/12 text-white"
        : "premium-button text-sm";
  const inactiveLinkClass =
    preset === "retro"
      ? "text-primary/70 hover:bg-primary/10 hover:text-primary"
      : preset === "os"
        ? "text-white/65 hover:bg-white/8 hover:text-white"
        : "text-muted-foreground hover:bg-accent/60 hover:text-foreground";
  const ctaClass = cn(
    "hidden items-center gap-2 transition-all md:flex",
    preset === "minimal"
      ? "rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground"
      : preset === "os"
        ? "rounded-xl bg-white text-slate-950 px-5 py-2.5 text-sm font-semibold"
        : preset === "retro"
          ? "rounded-md border border-primary/40 bg-primary/10 px-4 py-2 font-mono text-xs uppercase tracking-[0.16em] text-primary"
          : "premium-button rounded-full px-5 py-2.5 text-sm font-semibold"
  );
  const iconButtonClass = cn(
    "transition-all",
    preset === "os"
      ? "rounded-xl bg-white/8 p-2.5 text-white/70 hover:bg-white/12 hover:text-white"
      : preset === "retro"
        ? "rounded-md border border-primary/20 p-2.5 text-primary/70 hover:bg-primary/10 hover:text-primary"
        : "premium-button-secondary rounded-full p-2.5 text-muted-foreground hover:text-foreground"
  );

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={navShellClass}
      >
        <div className={navSurfaceClass}>
          <button
            onClick={goHome}
            className="group flex items-center gap-3"
          >
            <div className={brandMarkClass}>
              <span className={cn("text-sm font-bold", preset === "retro" ? "text-xs" : "text-lg")}>
                {brandMark}
              </span>
            </div>
            <span className={brandTextClass}>{brandName}</span>
          </button>

          <div className="hidden lg:flex items-center gap-1">
            {preset === "os" && <WindowDots />}
            <div className={cn("flex items-center gap-1", preset === "minimal" && "rounded-full bg-muted/60 px-2 py-1")}>
              {links.map((link) => (
                <button
                  key={link.href}
                  onClick={() => scrollTo(link.href)}
                  className={cn(
                    linkBaseClass,
                    active === link.href ? activeLinkClass : inactiveLinkClass
                  )}
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>

          <div className="relative flex items-center gap-2">
            <button onClick={toggleTheme} className={iconButtonClass} aria-label="Toggle theme">
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button onClick={() => scrollTo("contact")} className={ctaClass}>
              {navbarCTA}
            </button>
            <button
              onClick={() => setMobileOpen(true)}
              className={cn(iconButtonClass, "lg:hidden")}
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className={cn(
                "fixed top-0 right-0 bottom-0 z-50 w-[280px] border-l lg:hidden",
                preset === "retro"
                  ? "border-primary/20 bg-black text-primary"
                  : preset === "os"
                    ? "border-white/10 bg-slate-950 text-white"
                    : "border-border bg-background"
              )}
            >
              <div
                className={cn(
                  "flex items-center justify-between border-b p-4",
                  preset === "retro"
                    ? "border-primary/20"
                    : preset === "os"
                      ? "border-white/10"
                      : "border-border"
                )}
              >
                <span
                  className={cn(
                    "text-lg",
                    preset === "retro"
                      ? "font-mono uppercase tracking-[0.18em]"
                      : preset === "os"
                        ? "font-display font-semibold"
                        : "font-serif font-bold text-foreground"
                  )}
                >
                  Menu
                </span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "rounded-lg p-2 transition-colors",
                    preset === "retro"
                      ? "text-primary/70 hover:bg-primary/10 hover:text-primary"
                      : preset === "os"
                        ? "text-white/70 hover:bg-white/10 hover:text-white"
                        : "text-muted-foreground hover:bg-muted"
                  )}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <nav className="space-y-1 p-4">
                {links.map((link, i) => (
                  <motion.button
                    key={link.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => scrollTo(link.href)}
                    className={cn(
                      "w-full text-left transition-colors",
                      preset === "retro"
                        ? "rounded-md px-4 py-3 font-mono text-xs uppercase tracking-[0.18em]"
                        : "rounded-xl px-4 py-3 text-sm font-medium",
                      active === link.href ? activeLinkClass : inactiveLinkClass
                    )}
                  >
                    {link.label}
                  </motion.button>
                ))}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
