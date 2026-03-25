export const HOME_SECTION_OPTIONS = [
  { id: "logoMarquee", label: "Logo Strip", navLabel: "Logo Strip", isNavigable: false },
  { id: "about", label: "About Section", navLabel: "About", isNavigable: true },
  { id: "skills", label: "Skills Section", navLabel: "Skills", isNavigable: true },
  { id: "experience", label: "Experience Section", navLabel: "Experience", isNavigable: true },
  { id: "projects", label: "Projects Section", navLabel: "Projects", isNavigable: true },
  { id: "testimonials", label: "Testimonials Section", navLabel: "Testimonials", isNavigable: true },
  { id: "contact", label: "Contact Section", navLabel: "Contact", isNavigable: true },
] as const;

export type HomeSectionId = (typeof HOME_SECTION_OPTIONS)[number]["id"];

export const HOME_SECTION_IDS = HOME_SECTION_OPTIONS.map((section) => section.id) as [
  HomeSectionId,
  ...HomeSectionId[],
];

export const NAV_SECTION_OPTIONS = HOME_SECTION_OPTIONS.filter(
  (section) => section.isNavigable
);

export type NavigableSectionId = (typeof NAV_SECTION_OPTIONS)[number]["id"];

export const DEFAULT_HOME_SECTION_ORDER: HomeSectionId[] = [
  "logoMarquee",
  "about",
  "skills",
  "experience",
  "projects",
  "testimonials",
  "contact",
];

export const DEFAULT_SECTION_LABELS: Record<NavigableSectionId, string> = {
  about: "About",
  skills: "Skills",
  experience: "Experience",
  projects: "Projects",
  testimonials: "Testimonials",
  contact: "Contact",
};

export const THEME_PALETTES = [
  {
    id: "graphite",
    name: "Royal Graphite",
    description: "Deep navy neutrals with champagne accents for a premium editorial feel.",
    swatches: ["#182136", "#7D6A3C", "#D7C08B"],
  },
  {
    id: "ocean",
    name: "Ocean",
    description: "Cool blue tones for a calm, polished portfolio.",
    swatches: ["#0F3D5E", "#0EA5E9", "#67E8F9"],
  },
  {
    id: "forest",
    name: "Forest",
    description: "Natural greens with a grounded, premium look.",
    swatches: ["#1F4D3A", "#2F855A", "#86EFAC"],
  },
  {
    id: "sunset",
    name: "Sunset",
    description: "Warm amber and coral tones with energy.",
    swatches: ["#7C2D12", "#EA580C", "#FDBA74"],
  },
  {
    id: "rose",
    name: "Rose",
    description: "Soft red-pink accents for a bold personal brand.",
    swatches: ["#7F1D1D", "#E11D48", "#FDA4AF"],
  },
] as const;

export type ThemePalette = (typeof THEME_PALETTES)[number]["id"];

export const THEME_PALETTE_IDS = THEME_PALETTES.map((palette) => palette.id) as [
  ThemePalette,
  ...ThemePalette[],
];

export const DESIGN_PRESETS = [
  {
    id: "classic",
    name: "Classic Editorial",
    description: "Serif-led storytelling with split layouts and a polished studio feel.",
    features: ["Editorial hero", "Left-aligned sections", "Framed cards"],
  },
  {
    id: "minimal",
    name: "Modern Minimal",
    description: "Airy spacing, centered content, and quiet layouts that keep work first.",
    features: ["Centered hero", "Clean cards", "Calm spacing"],
  },
  {
    id: "retro",
    name: "Retro Terminal",
    description: "Monospace, command-line inspired UI with nostalgic developer energy.",
    features: ["CLI hero", "Terminal panels", "Monospace system"],
  },
  {
    id: "os",
    name: "Desktop OS",
    description: "Windowed panels, dock-style navigation, and a desktop workspace mood.",
    features: ["Window chrome", "Dock nav", "Desktop widgets"],
  },
] as const;

export type DesignPreset = (typeof DESIGN_PRESETS)[number]["id"];

export const DESIGN_PRESET_IDS = DESIGN_PRESETS.map((preset) => preset.id) as [
  DesignPreset,
  ...DesignPreset[],
];
