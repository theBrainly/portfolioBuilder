"use client";

import Image from "next/image";
import {
  Eye,
  Globe2,
  LayoutTemplate,
  MonitorSmartphone,
  TerminalSquare,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DESIGN_PRESETS,
  HOME_SECTION_OPTIONS,
  THEME_PALETTES,
  type DesignPreset,
  type ThemePalette,
} from "@/constants/siteCustomization";
import { getPortfolioPublicUrl, getSuggestedPortfolioSlug } from "@/lib/portfolioUrl";
import { normalizeHomeSectionOrder } from "@/lib/siteSettings";
import type { SettingsFormData } from "@/lib/validations";
import { getInitials, truncateText } from "@/lib/utils";

type PreviewValues = Partial<SettingsFormData>;

const DEFAULT_SECTION_LABELS: SettingsFormData["sectionLabels"] = {
  about: "About",
  skills: "Skills",
  experience: "Experience",
  projects: "Projects",
  testimonials: "Testimonials",
  contact: "Contact",
};

const DEFAULT_ORDER = normalizeHomeSectionOrder([]);

function getThemeTokens(paletteId: ThemePalette | undefined) {
  const palette =
    THEME_PALETTES.find((item) => item.id === paletteId) || THEME_PALETTES[0];
  const isGraphite = palette.id === "graphite";
  const accent = palette.swatches[2];
  const accentSoft = palette.swatches[1];

  return {
    accent,
    accentSoft,
    accentText: isGraphite ? "#121826" : "#08121F",
    accentSurface: `${palette.swatches[0]}22`,
    accentBorder: `${palette.swatches[2]}55`,
    border: isGraphite ? "rgba(215,192,139,0.14)" : "rgba(255,255,255,0.08)",
    canvas: isGraphite ? "#0B1020" : "#090C12",
    canvasSoft: isGraphite ? "#131B31" : "#101521",
    muted: "rgba(241,245,249,0.68)",
    surface: isGraphite ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.05)",
    surfaceStrong: isGraphite ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.08)",
    text: "#F8FAFC",
    swatches: palette.swatches,
    title: palette.name,
  };
}

function PreviewImage({
  src,
  alt,
  fallback,
  className,
}: {
  src?: string;
  alt: string;
  fallback: React.ReactNode;
  className?: string;
}) {
  if (!src) {
    return (
      <div
        className={`relative overflow-hidden bg-white/5 flex items-center justify-center ${className || ""}`}
      >
        {fallback}
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className || ""}`}>
      <Image src={src} alt={alt} fill unoptimized className="object-cover" />
    </div>
  );
}

function WindowDots() {
  return (
    <div className="flex items-center gap-1.5">
      <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
      <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" />
      <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
    </div>
  );
}

type HomepagePreviewData = {
  aboutExcerpt: string;
  aboutTitle: string;
  brandMark: string;
  brandName: string;
  email: string;
  footerDescription: string;
  heroDescription: string;
  heroSubtitle: string;
  heroTitle: string;
  location: string;
  navItems: string[];
  phone: string;
  preset: DesignPreset;
  presetName: string;
  sectionOrder: string[];
  theme: ReturnType<typeof getThemeTokens>;
  values: PreviewValues;
};

function ClassicPreview(data: HomepagePreviewData) {
  const { aboutExcerpt, aboutTitle, brandMark, brandName, heroDescription, heroSubtitle, heroTitle, navItems, sectionOrder, theme, values } = data;

  return (
    <div
      className="overflow-hidden rounded-[28px] border p-4 shadow-2xl"
      style={{
        background: `linear-gradient(180deg, ${theme.canvas} 0%, ${theme.canvasSoft} 100%)`,
        borderColor: theme.border,
        color: theme.text,
      }}
    >
      <div
        className="mb-4 flex items-center justify-between rounded-2xl border px-4 py-3"
        style={{ backgroundColor: theme.surface, borderColor: theme.border }}
      >
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl text-sm font-semibold"
            style={{ backgroundColor: theme.accent, color: theme.accentText }}
          >
            {brandMark}
          </div>
          <div>
            <p className="text-sm font-semibold">{brandName}</p>
            <p className="text-xs" style={{ color: theme.muted }}>
              {heroSubtitle}
            </p>
          </div>
        </div>

        <div className="hidden gap-2 md:flex">
          {navItems.slice(0, 4).map((label) => (
            <span
              key={label}
              className="rounded-full px-2.5 py-1 text-[11px]"
              style={{ backgroundColor: theme.surfaceStrong, color: theme.muted }}
            >
              {label}
            </span>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-[1.3fr_0.9fr]">
        <div
          className="rounded-[26px] border p-5"
          style={{ backgroundColor: theme.surface, borderColor: theme.border }}
        >
          <div
            className="inline-flex rounded-full px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em]"
            style={{
              backgroundColor: theme.accentSurface,
              color: theme.accent,
              border: `1px solid ${theme.accentBorder}`,
            }}
          >
            {heroSubtitle}
          </div>
          <h4 className="mt-4 text-3xl font-semibold leading-tight">{heroTitle}</h4>
          <p className="mt-3 text-sm leading-relaxed" style={{ color: theme.muted }}>
            {truncateText(heroDescription, 170)}
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <span
              className="rounded-full px-4 py-2 text-xs font-semibold"
              style={{ backgroundColor: theme.accent, color: theme.accentText }}
            >
              {values.heroCTA || "View My Work"}
            </span>
            <span
              className="rounded-full border px-4 py-2 text-xs"
              style={{ borderColor: theme.border, color: theme.muted }}
            >
              {values.navbarCTA || "Hire Me"}
            </span>
          </div>
        </div>

        <PreviewImage
          src={values.heroImage}
          alt={heroTitle}
          className="aspect-[4/3] rounded-[26px] border"
          fallback={
            <div className="text-center">
              <div
                className="mx-auto flex h-16 w-16 items-center justify-center rounded-full text-lg font-semibold"
                style={{ backgroundColor: theme.accentSurface, color: theme.accent }}
              >
                {getInitials(heroTitle)}
              </div>
              <p className="mt-3 text-xs" style={{ color: theme.muted }}>
                Hero image preview
              </p>
            </div>
          }
        />
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-[1.15fr_0.85fr]">
        <div
          className="rounded-[24px] border p-5"
          style={{ backgroundColor: theme.surface, borderColor: theme.border }}
        >
          <p className="text-xs uppercase tracking-[0.18em]" style={{ color: theme.muted }}>
            {aboutTitle}
          </p>
          <p className="mt-3 text-sm leading-relaxed" style={{ color: theme.muted }}>
            {aboutExcerpt}
          </p>

          <div className="mt-5 grid grid-cols-3 gap-3">
            {[
              { label: "Years", value: values.yearsOfExperience ?? 0 },
              { label: "Projects", value: values.totalProjects ?? 0 },
              { label: "Clients", value: values.totalClients ?? 0 },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border px-3 py-3"
                style={{ backgroundColor: theme.surfaceStrong, borderColor: theme.border }}
              >
                <p className="text-lg font-semibold">+{stat.value}</p>
                <p className="mt-1 text-[11px]" style={{ color: theme.muted }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div
          className="rounded-[24px] border p-4"
          style={{ backgroundColor: theme.surface, borderColor: theme.border }}
        >
          <p className="text-xs uppercase tracking-[0.18em]" style={{ color: theme.muted }}>
            Homepage order
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {sectionOrder.map((label) => (
              <span
                key={label}
                className="rounded-full px-2.5 py-1 text-[11px]"
                style={{ backgroundColor: theme.surfaceStrong, color: theme.muted }}
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MinimalPreview(data: HomepagePreviewData) {
  const { aboutExcerpt, aboutTitle, brandMark, brandName, heroDescription, heroSubtitle, heroTitle, navItems, theme, values } = data;

  return (
    <div
      className="overflow-hidden rounded-[28px] border p-4 shadow-xl"
      style={{
        background: "linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(247,250,252,0.92) 100%)",
        borderColor: "rgba(15,23,42,0.08)",
        color: "#0F172A",
      }}
    >
      <div className="rounded-[22px] border border-slate-200/80 bg-white/90 px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold"
              style={{ backgroundColor: theme.accent, color: theme.accentText }}
            >
              {brandMark}
            </div>
            <span className="text-sm font-semibold">{brandName}</span>
          </div>
          <div className="hidden gap-3 md:flex">
            {navItems.slice(0, 4).map((label) => (
              <span key={label} className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="px-4 py-10 text-center">
        <p className="text-[11px] uppercase tracking-[0.26em] text-slate-500">{heroSubtitle}</p>
        <h4 className="mx-auto mt-4 max-w-md text-4xl font-semibold leading-tight text-slate-950">
          {heroTitle}
        </h4>
        <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-slate-600">
          {truncateText(heroDescription, 170)}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-[0.82fr_1.18fr]">
        <PreviewImage
          src={values.heroImage}
          alt={heroTitle}
          className="aspect-[4/5] rounded-[26px] border border-slate-200 bg-slate-100"
          fallback={
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-200 text-lg font-semibold text-slate-700">
                {getInitials(heroTitle)}
              </div>
              <p className="mt-3 text-xs text-slate-500">Portrait</p>
            </div>
          }
        />

        <div className="grid gap-4">
          <div className="rounded-[26px] border border-slate-200 bg-white p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{aboutTitle}</p>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">{aboutExcerpt}</p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Years", value: values.yearsOfExperience ?? 0 },
              { label: "Projects", value: values.totalProjects ?? 0 },
              { label: "Clients", value: values.totalClients ?? 0 },
            ].map((stat) => (
              <div key={stat.label} className="rounded-[22px] border border-slate-200 bg-white p-4 text-center">
                <p className="text-2xl font-semibold text-slate-950">{stat.value}</p>
                <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-slate-500">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          <div className="rounded-[26px] border border-slate-200 bg-white p-5">
            <div className="flex flex-wrap justify-center gap-2">
              {(values.homeSectionOrder || DEFAULT_ORDER).slice(0, 5).map((sectionId) => {
                const section = HOME_SECTION_OPTIONS.find((item) => item.id === sectionId);
                return (
                  <span
                    key={sectionId}
                    className="rounded-full border border-slate-200 px-3 py-1 text-[11px] uppercase tracking-[0.14em] text-slate-500"
                  >
                    {section?.label || sectionId}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function RetroPreview(data: HomepagePreviewData) {
  const { aboutExcerpt, brandName, email, heroDescription, heroTitle, navItems, theme, values } = data;

  return (
    <div
      className="overflow-hidden rounded-[28px] border p-4 shadow-2xl"
      style={{
        background: "linear-gradient(180deg, #020706 0%, #03100c 100%)",
        borderColor: `${theme.accent}55`,
        color: "#D8FFEC",
      }}
    >
      <div
        className="rounded-[22px] border px-4 py-3 font-mono"
        style={{ borderColor: `${theme.accent}55`, backgroundColor: `${theme.accent}12` }}
      >
        <div className="flex items-center justify-between gap-4 text-[11px] uppercase tracking-[0.18em]">
          <div className="flex items-center gap-3">
            <TerminalSquare className="h-4 w-4" style={{ color: theme.accent }} />
            <span>{brandName}.sys</span>
          </div>
          <span style={{ color: `${theme.accent}BB` }}>online</span>
        </div>
      </div>

      <div
        className="mt-4 rounded-[24px] border p-5 font-mono"
        style={{ borderColor: `${theme.accent}55`, backgroundColor: "rgba(4,16,12,0.9)" }}
      >
        <p style={{ color: `${theme.accent}BB` }}>$ portfolio --boot</p>
        <h4 className="mt-3 text-3xl font-semibold tracking-tight text-[#E9FFF4]">{heroTitle}</h4>
        <p className="mt-3 text-sm leading-relaxed text-[#93D6B3]">
          {truncateText(heroDescription, 175)}
        </p>

        <div className="mt-5 grid gap-3 md:grid-cols-2">
          <div className="rounded-2xl border p-4" style={{ borderColor: `${theme.accent}40` }}>
            <p className="text-[11px] uppercase tracking-[0.18em] text-[#6BB98C]">
              active modules
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {navItems.slice(0, 5).map((label) => (
                <span
                  key={label}
                  className="rounded-md border px-2 py-1 text-[11px]"
                  style={{ borderColor: `${theme.accent}35`, color: "#C8FFE2" }}
                >
                  {label.toLowerCase()}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border p-4" style={{ borderColor: `${theme.accent}40` }}>
            <p className="text-[11px] uppercase tracking-[0.18em] text-[#6BB98C]">
              quick stats
            </p>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {[
                values.yearsOfExperience ?? 0,
                values.totalProjects ?? 0,
                values.totalClients ?? 0,
              ].map((stat, index) => (
                <div
                  key={index}
                  className="rounded-md border px-2 py-3 text-center"
                  style={{ borderColor: `${theme.accent}30` }}
                >
                  <p className="text-lg font-semibold text-[#E9FFF4]">{stat}</p>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-[#6BB98C]">
                    {index === 0 ? "yrs" : index === 1 ? "work" : "clients"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-[1.05fr_0.95fr] font-mono">
        <div
          className="rounded-[22px] border p-4"
          style={{ borderColor: `${theme.accent}40`, backgroundColor: "rgba(4,16,12,0.82)" }}
        >
          <p className="text-[11px] uppercase tracking-[0.16em] text-[#6BB98C]">$ cat about.txt</p>
          <p className="mt-3 text-sm leading-relaxed text-[#B6F2CF]">{aboutExcerpt}</p>
        </div>

        <div
          className="rounded-[22px] border p-4"
          style={{ borderColor: `${theme.accent}40`, backgroundColor: "rgba(4,16,12,0.82)" }}
        >
          <p className="text-[11px] uppercase tracking-[0.16em] text-[#6BB98C]">$ ping contact</p>
          <div className="mt-3 space-y-2 text-sm text-[#D8FFEC]">
            <p>{email}</p>
            <p>{values.phone || "phone://pending"}</p>
            <p>{values.location || "location://unknown"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function OsPreview(data: HomepagePreviewData) {
  const { aboutExcerpt, aboutTitle, brandName, footerDescription, heroSubtitle, heroTitle, location, navItems, phone, presetName, theme, values } = data;

  return (
    <div
      className="overflow-hidden rounded-[28px] border p-4 shadow-2xl"
      style={{
        background: `linear-gradient(135deg, ${theme.swatches[0]} 0%, ${theme.swatches[1]} 45%, #111827 100%)`,
        borderColor: "rgba(255,255,255,0.14)",
        color: "#F8FAFC",
      }}
    >
      <div className="mb-4 flex items-center justify-between rounded-2xl border border-white/15 bg-black/20 px-4 py-3 backdrop-blur">
        <div className="flex items-center gap-3">
          <WindowDots />
          <p className="text-sm font-medium">{brandName} workspace</p>
        </div>
        <div className="rounded-full bg-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-white/70">
          {presetName}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[24px] border border-white/15 bg-slate-950/55 p-4 backdrop-blur">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-3">
              <WindowDots />
              <span className="text-xs uppercase tracking-[0.18em] text-white/55">
                profile.exe
              </span>
            </div>
            <span className="text-xs text-white/55">{heroSubtitle}</span>
          </div>

          <div className="grid gap-4 pt-4 md:grid-cols-[1.1fr_0.9fr]">
            <div>
              <h4 className="text-3xl font-semibold leading-tight">{heroTitle}</h4>
              <p className="mt-3 text-sm leading-relaxed text-white/70">
                {truncateText(footerDescription, 150)}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {navItems.slice(0, 4).map((label) => (
                  <span key={label} className="rounded-full bg-white/10 px-3 py-1 text-[11px] text-white/70">
                    {label}
                  </span>
                ))}
              </div>
            </div>

            <PreviewImage
              src={values.heroImage}
              alt={heroTitle}
              className="aspect-[4/4.2] rounded-[22px] border border-white/10"
              fallback={
                <div className="text-center">
                  <MonitorSmartphone className="mx-auto h-10 w-10 text-white/75" />
                  <p className="mt-3 text-xs text-white/60">Desktop portrait</p>
                </div>
              }
            />
          </div>
        </div>

        <div className="grid gap-4">
          <div className="rounded-[24px] border border-white/15 bg-slate-950/55 p-4 backdrop-blur">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-3">
                <WindowDots />
                <span className="text-xs uppercase tracking-[0.18em] text-white/55">
                  about.app
                </span>
              </div>
            </div>
            <p className="mt-4 text-xs uppercase tracking-[0.18em] text-white/45">{aboutTitle}</p>
            <p className="mt-3 text-sm leading-relaxed text-white/70">{aboutExcerpt}</p>
          </div>

          <div className="rounded-[24px] border border-white/15 bg-slate-950/55 p-4 backdrop-blur">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-3">
                <WindowDots />
                <span className="text-xs uppercase tracking-[0.18em] text-white/55">
                  stats.widget
                </span>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3">
              {[
                { label: "Years", value: values.yearsOfExperience ?? 0 },
                { label: "Projects", value: values.totalProjects ?? 0 },
                { label: "Clients", value: values.totalClients ?? 0 },
              ].map((stat) => (
                <div key={stat.label} className="rounded-2xl bg-white/6 px-3 py-3 text-center">
                  <p className="text-lg font-semibold">{stat.value}</p>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-white/50">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-2xl bg-white/6 px-3 py-3 text-xs text-white/60">
              {location} • {phone}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function renderHomepagePreview(data: HomepagePreviewData) {
  switch (data.preset) {
    case "minimal":
      return <MinimalPreview {...data} />;
    case "retro":
      return <RetroPreview {...data} />;
    case "os":
      return <OsPreview {...data} />;
    default:
      return <ClassicPreview {...data} />;
  }
}

export default function SettingsLivePreview({
  values,
  isDirty,
}: {
  values: PreviewValues;
  isDirty: boolean;
}) {
  const sectionLabels = {
    ...DEFAULT_SECTION_LABELS,
    ...(values.sectionLabels || {}),
  };
  const sectionOrder = normalizeHomeSectionOrder(values.homeSectionOrder || DEFAULT_ORDER);
  const theme = getThemeTokens(values.themePalette);
  const preset = values.designPreset || "classic";
  const presetMeta = DESIGN_PRESETS.find((item) => item.id === preset) || DESIGN_PRESETS[0];
  const brandName = values.brandName || "Portfolio";
  const brandMark = values.brandMark || brandName.charAt(0) || "P";
  const heroTitle = values.heroTitle || "Your Name";
  const heroSubtitle = values.heroSubtitle || "Full Stack Developer";
  const heroDescription =
    values.heroDescription ||
    "Your headline, positioning, and value proposition will update here as you type.";
  const aboutTitle = values.aboutTitle || "About Me";
  const aboutDescription =
    values.aboutDescription ||
    "Your about section preview will reflect the real content and supporting stats from the form.";
  const footerDescription =
    values.footerDescription ||
    "Designing and building thoughtful digital experiences that feel polished and perform well.";
  const email = values.email || "you@example.com";
  const location = values.location || "City, Country";
  const phone = values.phone || "+91 00000 00000";
  const siteTitle = values.siteTitle || `${brandName} | Portfolio`;
  const siteDescription =
    values.siteDescription ||
    "A concise summary of your work, experience, and portfolio focus.";
  const previewSettings = {
    ...values,
    portfolioSlug: values.portfolioSlug || getSuggestedPortfolioSlug(values),
  };
  const publicUrl = getPortfolioPublicUrl(previewSettings);
  const aboutExcerpt = truncateText(
    aboutDescription.split("\n").filter(Boolean)[0] || aboutDescription,
    180
  );
  const navItems = sectionOrder
    .map((sectionId) => HOME_SECTION_OPTIONS.find((section) => section.id === sectionId))
    .filter((section): section is (typeof HOME_SECTION_OPTIONS)[number] => !!section)
    .map((section) =>
      section.isNavigable
        ? sectionLabels[section.id as keyof typeof DEFAULT_SECTION_LABELS]
        : section.label
    );

  return (
    <div className="xl:sticky xl:top-24">
      <div className="rounded-3xl border border-border bg-surface p-5 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-2 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-text-muted">
              <Eye className="h-3.5 w-3.5" />
              Live Preview
            </div>
            <h3 className="mt-4 text-lg font-semibold text-text-primary">
              Changes update instantly
            </h3>
            <p className="mt-1 text-sm text-text-muted">
              Review the homepage feel before saving settings.
            </p>
          </div>

          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              isDirty ? "bg-primary/10 text-primary" : "bg-emerald-500/10 text-emerald-600"
            }`}
          >
            {isDirty ? "Unsaved changes" : "Saved state"}
          </span>
        </div>

        <div className="mt-5 rounded-2xl border border-border bg-surface-2 p-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-text-muted">
                Selected preset
              </p>
              <h4 className="mt-2 text-base font-semibold text-text-primary">
                {presetMeta.name}
              </h4>
              <p className="mt-1 text-sm leading-relaxed text-text-muted">
                {presetMeta.description}
              </p>
            </div>
            <div className="flex flex-wrap justify-end gap-2">
              {presetMeta.features.map((feature) => (
                <span
                  key={feature}
                  className="rounded-full border border-border px-3 py-1 text-[11px] text-text-muted"
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-5">
          <Tabs defaultValue="homepage" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="homepage" className="gap-2">
                <LayoutTemplate className="h-4 w-4" />
                Homepage
              </TabsTrigger>
              <TabsTrigger value="seo" className="gap-2">
                <Globe2 className="h-4 w-4" />
                SEO
              </TabsTrigger>
            </TabsList>

            <TabsContent value="homepage" className="mt-4">
              {renderHomepagePreview({
                aboutExcerpt,
                aboutTitle,
                brandMark,
                brandName,
                email,
                footerDescription,
                heroDescription,
                heroSubtitle,
                heroTitle,
                location,
                navItems,
                phone,
                preset,
                presetName: presetMeta.name,
                sectionOrder: navItems,
                theme,
                values,
              })}
            </TabsContent>

            <TabsContent value="seo" className="mt-4">
              <div className="space-y-4">
                <div className="rounded-3xl border border-border bg-surface-2 p-4">
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-text-muted">
                    Public URL
                  </p>
                  <div className="mt-4 rounded-2xl border border-border bg-surface p-4">
                    <p className="text-sm font-medium text-text-primary break-all">{publicUrl}</p>
                    <p className="mt-2 text-xs text-text-muted">
                      This is the portfolio address users will share and open.
                    </p>
                  </div>
                </div>

                <div className="rounded-3xl border border-border bg-surface-2 p-4">
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-text-muted">
                    Search snippet
                  </p>
                  <div className="mt-4 rounded-2xl border border-border bg-surface p-4">
                    <p className="text-xs text-text-muted break-all">{publicUrl}</p>
                    <p className="mt-2 text-lg font-semibold text-primary">
                      {truncateText(siteTitle, 65)}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-text-muted">
                      {truncateText(siteDescription, 155)}
                    </p>
                  </div>
                </div>

                <div className="rounded-3xl border border-border bg-surface-2 p-4">
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-text-muted">
                    Social share card
                  </p>
                  <div className="mt-4 overflow-hidden rounded-2xl border border-border bg-surface">
                    <PreviewImage
                      src={values.ogImage || values.heroImage}
                      alt={siteTitle}
                      className="aspect-[1.91/1] w-full"
                      fallback={
                        <div className="flex h-full flex-col items-center justify-center bg-gradient-to-br from-primary/10 to-transparent">
                          <div className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                            {presetMeta.name}
                          </div>
                          <p className="mt-3 text-sm text-text-muted">OG image preview</p>
                        </div>
                      }
                    />

                    <div className="p-4">
                      <p className="text-sm font-semibold text-text-primary">
                        {truncateText(siteTitle, 70)}
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-text-muted">
                        {truncateText(siteDescription, 170)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
