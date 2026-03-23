"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sun, Moon, Download, Code2 } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { useScrollSpy } from "@/hooks/useScrollSpy";
import { cn } from "@/lib/cn";
import type { ISiteSettings } from "@/types";

const LINKS = [
  { label: "About", href: "about" },
  { label: "Projects", href: "projects" },
  { label: "Experience", href: "experience" },
  { label: "Skills", href: "skills" },
  { label: "Testimonials", href: "testimonials" },
  { label: "Contact", href: "contact" },
];

export default function Navbar({ settings }: { settings: ISiteSettings | null }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const active = useScrollSpy(LINKS.map((l) => l.href), 120);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => { document.body.style.overflow = mobileOpen ? "hidden" : ""; }, [mobileOpen]);

  const scrollTo = (id: string) => { setMobileOpen(false); document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); };

  return (
    <>
      <motion.nav initial={{ y: -100 }} animate={{ y: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={cn("fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled ? "bg-background/80 backdrop-blur-xl border-b border-border shadow-lg shadow-background/20" : "bg-transparent")}>
        <div className="section-container">
          <div className="flex items-center justify-between h-16 md:h-20">
            <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center group-hover:shadow-lg group-hover:shadow-primary/25 transition-shadow">
                <Code2 className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg hidden sm:block text-text-primary">{settings?.heroTitle?.split(" ").pop() || "Portfolio"}</span>
            </button>

            <div className="hidden lg:flex items-center gap-1">
              {LINKS.map((link) => (
                <button key={link.href} onClick={() => scrollTo(link.href)}
                  className={cn("relative px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                    active === link.href ? "text-primary" : "text-text-secondary hover:text-text-primary")}>
                  {link.label}
                  {active === link.href && (
                    <motion.div layoutId="navIndicator" className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary rounded-full"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }} />
                  )}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button onClick={toggleTheme} className="p-2.5 rounded-xl hover:bg-surface-2 text-text-secondary hover:text-text-primary transition-all" aria-label="Toggle theme">
                {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              {settings?.resumeUrl && (
                <a href={settings.resumeUrl} target="_blank" rel="noopener noreferrer"
                  className="hidden md:flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-light transition-colors shadow-lg shadow-primary/25">
                  <Download className="w-4 h-4" />Resume
                </a>
              )}
              <button onClick={() => setMobileOpen(true)} className="lg:hidden p-2.5 rounded-xl hover:bg-surface-2 transition-colors text-text-primary" aria-label="Open menu">
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden" onClick={() => setMobileOpen(false)} />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[280px] bg-surface border-l border-border z-50 lg:hidden">
              <div className="flex items-center justify-between p-4 border-b border-border">
                <span className="font-bold text-lg text-text-primary">Menu</span>
                <button onClick={() => setMobileOpen(false)} className="p-2 hover:bg-surface-2 rounded-lg transition-colors text-text-muted"><X className="w-5 h-5" /></button>
              </div>
              <nav className="p-4 space-y-1">
                {LINKS.map((link, i) => (
                  <motion.button key={link.href} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                    onClick={() => scrollTo(link.href)}
                    className={cn("w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                      active === link.href ? "bg-primary/10 text-primary" : "text-text-secondary hover:text-text-primary hover:bg-surface-2")}>
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
