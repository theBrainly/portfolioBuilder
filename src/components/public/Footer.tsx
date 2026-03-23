"use client";
import { Code2, Heart, Github, Linkedin, Twitter, ArrowUp } from "lucide-react";
import type { ISiteSettings } from "@/types";

export default function Footer({ settings }: { settings: ISiteSettings | null }) {
  const socials = [
    { icon: Github, url: settings?.github, label: "GitHub" },
    { icon: Linkedin, url: settings?.linkedin, label: "LinkedIn" },
    { icon: Twitter, url: settings?.twitter, label: "Twitter" },
  ].filter((s) => s.url);

  return (
    <footer className="border-t border-border bg-surface/50">
      <div className="section-container py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center"><Code2 className="w-5 h-5 text-white" /></div>
            <div><p className="font-semibold text-sm text-text-primary">{settings?.heroTitle?.split(" ").pop() || "Portfolio"}</p>
              <p className="text-xs text-text-muted flex items-center gap-1">Built with <Heart className="w-3 h-3 text-accent fill-accent" /> using Next.js</p></div>
          </div>
          {socials.length > 0 && (
            <div className="flex items-center gap-1">
              {socials.map((s) => <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer"
                className="p-2.5 text-text-muted hover:text-primary hover:bg-primary/10 rounded-xl transition-all"><s.icon className="w-5 h-5" /></a>)}
            </div>
          )}
          <div className="flex items-center gap-4">
            <p className="text-sm text-text-muted">© {new Date().getFullYear()} All rights reserved.</p>
            <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="p-2 bg-surface-2 border border-border rounded-xl hover:border-primary/30 hover:text-primary transition-all text-text-muted"><ArrowUp className="w-4 h-4" /></button>
          </div>
        </div>
      </div>
    </footer>
  );
}
