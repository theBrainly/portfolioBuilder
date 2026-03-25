import {
  DEFAULT_HOME_SECTION_ORDER,
  DEFAULT_SECTION_LABELS,
  DESIGN_PRESETS,
  HOME_SECTION_OPTIONS,
  THEME_PALETTES,
  type DesignPreset,
  type HomeSectionId,
  type ThemePalette,
} from "@/constants/siteCustomization";
import { getActivePortfolioSlug, normalizeCustomDomain } from "@/lib/portfolioUrl";

const VALID_HOME_SECTIONS = new Set(HOME_SECTION_OPTIONS.map((section) => section.id));
const VALID_PALETTES = new Set(THEME_PALETTES.map((palette) => palette.id));
const VALID_DESIGN_PRESETS = new Set(DESIGN_PRESETS.map((preset) => preset.id));

export const DEFAULT_SITE_CUSTOMIZATION = {
  customDomain: "",
  portfolioSlug: "",
  brandName: "Portfolio",
  brandMark: "P",
  navbarCTA: "Hire Me",
  footerDescription:
    "Designing and building thoughtful digital experiences that feel polished and perform well.",
  footerCopyright: "All rights reserved.",
  themePalette: "graphite" as ThemePalette,
  designPreset: "classic" as DesignPreset,
  homeSectionOrder: DEFAULT_HOME_SECTION_ORDER,
  sectionLabels: DEFAULT_SECTION_LABELS,
};

export function normalizeHomeSectionOrder(value: unknown): HomeSectionId[] {
  const rawOrder = Array.isArray(value) ? value : [];
  const uniqueValid = rawOrder.filter(
    (item, index): item is HomeSectionId =>
      typeof item === "string" &&
      VALID_HOME_SECTIONS.has(item as HomeSectionId) &&
      rawOrder.indexOf(item) === index
  );

  return [
    ...uniqueValid,
    ...DEFAULT_HOME_SECTION_ORDER.filter((sectionId) => !uniqueValid.includes(sectionId)),
  ];
}

export function normalizeSiteSettings<T extends Record<string, any> | null | undefined>(
  settings: T
) {
  if (!settings) return null;

  const themePalette = VALID_PALETTES.has(settings.themePalette)
    ? (settings.themePalette as ThemePalette)
    : DEFAULT_SITE_CUSTOMIZATION.themePalette;
  const designPreset = VALID_DESIGN_PRESETS.has(settings.designPreset)
    ? (settings.designPreset as DesignPreset)
    : DEFAULT_SITE_CUSTOMIZATION.designPreset;
  const customDomain = normalizeCustomDomain(settings.customDomain);
  const portfolioSlug = getActivePortfolioSlug(settings);

  return {
    ...DEFAULT_SITE_CUSTOMIZATION,
    ...settings,
    customDomain,
    portfolioSlug,
    themePalette,
    designPreset,
    homeSectionOrder: normalizeHomeSectionOrder(settings.homeSectionOrder),
    sectionLabels: {
      ...DEFAULT_SECTION_LABELS,
      ...(settings.sectionLabels || {}),
    },
  };
}
