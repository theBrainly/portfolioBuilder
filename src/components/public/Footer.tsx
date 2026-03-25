"use client";

import { usePathname, useRouter } from "next/navigation";
import { Github, Linkedin, Twitter, ArrowUp } from "lucide-react";
import { getPortfolioHomePath, getPortfolioSectionHref } from "@/lib/portfolioUrl";
import type { ISiteSettings } from "@/types";
import {
  DEFAULT_SECTION_LABELS,
  HOME_SECTION_OPTIONS,
} from "@/constants/siteCustomization";

function getFooterLinks(settings: ISiteSettings | null) {
  const order = settings?.homeSectionOrder?.length
    ? settings.homeSectionOrder
    : HOME_SECTION_OPTIONS.map((section) => section.id);

  return order
    .map((sectionId) => HOME_SECTION_OPTIONS.find((section) => section.id === sectionId))
    .filter(
      (section): section is (typeof HOME_SECTION_OPTIONS)[number] =>
        !!section && section.isNavigable
    )
    .map((section) => ({
      href: section.id,
      label:
        settings?.sectionLabels?.[section.id as keyof typeof DEFAULT_SECTION_LABELS] ||
        DEFAULT_SECTION_LABELS[section.id as keyof typeof DEFAULT_SECTION_LABELS],
    }));
}

export default function Footer({ settings }: { settings: ISiteSettings | null }) {
  const pathname = usePathname();
  const router = useRouter();
  const socials = [
    { icon: Github, url: settings?.github, label: "GitHub" },
    { icon: Linkedin, url: settings?.linkedin, label: "LinkedIn" },
    { icon: Twitter, url: settings?.twitter, label: "Twitter" },
  ].filter((social) => social.url);

  const preset = settings?.designPreset || "classic";
  const brandName = settings?.brandName || settings?.siteTitle || "Portfolio";
  const brandMark = settings?.brandMark || brandName.charAt(0);
  const footerLinks = getFooterLinks(settings);
  const footerDescription =
    settings?.footerDescription ||
    settings?.siteDescription ||
    "Designing and building thoughtful digital experiences that feel polished and perform well.";
  const footerCopyright = settings?.footerCopyright || "All rights reserved.";
  const homePath = getPortfolioHomePath(settings);
  const isHomePage = pathname === homePath;
  const goHome = () => {
    if (isHomePage) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    router.push(homePath);
  };

  if (preset === "minimal") {
    return (
      <footer className="border-t border-border bg-background/95">
        <div className="section-container py-12">
          <div className="flex flex-col items-center gap-6 text-center">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <span className="text-sm font-semibold">{brandMark}</span>
              </div>
              <span className="font-display text-xl font-semibold text-foreground">{brandName}</span>
            </div>
            <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
              {footerDescription}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {footerLinks.slice(0, 5).map((link) => (
                <a
                  key={link.href}
                  href={getPortfolioSectionHref(link.href, settings)}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.label}
                </a>
              ))}
            </div>
            <div className="flex items-center gap-3">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-border p-2 text-muted-foreground transition-colors hover:text-foreground"
                  aria-label={social.label}
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              {footerCopyright} ©{brandName} {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </footer>
    );
  }

  if (preset === "retro") {
    return (
      <footer className="border-t border-primary/20 bg-black/50">
        <div className="section-container py-12 font-mono">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="rounded-md border border-primary/25 bg-primary/10 px-3 py-2 text-xs uppercase tracking-[0.18em] text-primary">
                  {brandMark}
                </div>
                <span className="text-sm uppercase tracking-[0.18em] text-primary">{brandName}</span>
              </div>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-primary/70">
                {footerDescription}
              </p>
            </div>

            <div className="grid gap-3 text-sm text-primary/65">
              {settings?.location && <p>location: {settings.location}</p>}
              {settings?.email && <p>email: {settings.email}</p>}
              {settings?.phone && <p>phone: {settings.phone}</p>}
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-4 border-t border-primary/15 pt-6 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap gap-4">
              {footerLinks.slice(0, 5).map((link) => (
                <a
                  key={link.href}
                  href={getPortfolioSectionHref(link.href, settings)}
                  className="text-xs uppercase tracking-[0.18em] text-primary/60 transition-colors hover:text-primary"
                >
                  {link.label}
                </a>
              ))}
            </div>

            <div className="flex items-center gap-3">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-md border border-primary/20 p-2 text-primary/60 transition-colors hover:text-primary"
                  aria-label={social.label}
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
              <button
                onClick={goHome}
                className="rounded-md border border-primary/20 p-2 text-primary/60 transition-colors hover:text-primary"
              >
                <ArrowUp className="h-4 w-4" />
              </button>
            </div>
          </div>

          <p className="mt-6 text-xs uppercase tracking-[0.16em] text-primary/45">
            {footerCopyright} ©{brandName} {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    );
  }

  if (preset === "os") {
    return (
      <footer className="border-t border-white/10 bg-slate-950/70">
        <div className="section-container py-12">
          <div className="rounded-[30px] border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-[#FF5F57]" />
                <span className="h-3 w-3 rounded-full bg-[#FEBC2E]" />
                <span className="h-3 w-3 rounded-full bg-[#28C840]" />
              </div>
              <span className="text-xs uppercase tracking-[0.18em] text-white/45">
                footer.desktop
              </span>
            </div>

            <div className="grid gap-6 pt-6 md:grid-cols-[1fr_auto]">
              <div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white">
                    <span className="text-sm font-semibold">{brandMark}</span>
                  </div>
                  <span className="font-display text-xl font-semibold text-white">{brandName}</span>
                </div>
                <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/70">
                  {footerDescription}
                </p>
              </div>

              <div className="grid gap-2 text-sm text-white/65">
                {settings?.location && <p>{settings.location}</p>}
                {settings?.email && <p>{settings.email}</p>}
                {settings?.phone && <p>{settings.phone}</p>}
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-4 border-t border-white/10 pt-6 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-wrap gap-3">
                {footerLinks.slice(0, 5).map((link) => (
                  <a
                    key={link.href}
                    href={getPortfolioSectionHref(link.href, settings)}
                    className="rounded-xl bg-white/6 px-3 py-2 text-xs text-white/65 transition-colors hover:text-white"
                  >
                    {link.label}
                  </a>
                ))}
              </div>

              <div className="flex items-center gap-3">
                {socials.map((social) => (
                  <a
                    key={social.label}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-xl bg-white/6 p-2 text-white/65 transition-colors hover:text-white"
                    aria-label={social.label}
                  >
                    <social.icon className="h-4 w-4" />
                  </a>
                ))}
                <button
                  onClick={goHome}
                  className="rounded-xl bg-white/6 p-2 text-white/65 transition-colors hover:text-white"
                >
                  <ArrowUp className="h-4 w-4" />
                </button>
              </div>
            </div>

            <p className="mt-6 text-xs text-white/45">
              {footerCopyright} ©{brandName} {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="pb-10 pt-4">
      <div className="section-container">
        <div className="premium-panel-strong rounded-[34px] px-6 py-8 text-primary-foreground md:px-8 md:py-10">
          <div className="mb-10 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="lg:col-span-1">
              <div className="mb-4 flex items-center gap-3">
                <div className="premium-button flex h-10 w-10 items-center justify-center rounded-2xl">
                  <span className="font-serif text-lg font-bold">{brandMark}</span>
                </div>
                <span className="font-display text-lg font-semibold uppercase tracking-[0.14em] text-primary-foreground">
                  {brandName}
                </span>
              </div>
              <p className="mb-4 text-sm leading-relaxed text-primary-foreground/72">
                {footerDescription}
              </p>
              {socials.length > 0 && (
                <div className="flex items-center gap-2">
                  {socials.map((social) => (
                    <a
                      key={social.label}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full border border-primary-foreground/10 bg-primary-foreground/5 p-2 text-primary-foreground/60 transition-colors hover:text-primary-foreground"
                      aria-label={social.label}
                    >
                      <social.icon className="h-4 w-4" />
                    </a>
                  ))}
                </div>
              )}
            </div>

            <div>
              <h4 className="mb-4 text-xs uppercase tracking-wider text-primary-foreground/45">Address</h4>
              <p className="text-sm leading-relaxed text-primary-foreground/75">
                {settings?.location || "Location not specified"}
              </p>
            </div>

            <div>
              <h4 className="mb-4 text-xs uppercase tracking-wider text-primary-foreground/45">Email Address</h4>
              {settings?.email && (
                <a href={`mailto:${settings.email}`} className="text-sm text-primary-foreground/75 transition-colors hover:text-primary-foreground">
                  {settings.email}
                </a>
              )}
            </div>

            <div>
              <h4 className="mb-4 text-xs uppercase tracking-wider text-primary-foreground/45">Phone Number</h4>
              {settings?.phone && (
                <a href={`tel:${settings.phone}`} className="text-sm text-primary-foreground/75 transition-colors hover:text-primary-foreground">
                  {settings.phone}
                </a>
              )}
            </div>
          </div>

          <div className="flex flex-col items-center justify-between gap-4 border-t border-primary-foreground/10 pt-6 md:flex-row">
            <p className="text-xs text-primary-foreground/45">
              {footerCopyright} ©{brandName} {new Date().getFullYear()}
            </p>

            <div className="flex items-center gap-6">
              {footerLinks.slice(0, 4).map((link) => (
                <a
                  key={link.href}
                  href={getPortfolioSectionHref(link.href, settings)}
                  className="text-xs text-primary-foreground/55 transition-colors hover:text-primary-foreground"
                >
                  {link.label}
                </a>
              ))}
            </div>

            <button
              onClick={goHome}
              className="rounded-full border border-primary-foreground/10 bg-primary-foreground/5 p-2 text-primary-foreground/55 transition-colors hover:bg-primary-foreground/12 hover:text-primary-foreground"
            >
              <ArrowUp className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
