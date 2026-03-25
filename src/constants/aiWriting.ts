export const AI_PROVIDERS = [
  {
    id: "groq",
    label: "Groq",
    description: "Fast OpenAI-compatible chat completions.",
  },
  {
    id: "openrouter",
    label: "OpenRouter",
    description: "Unified router with free-model support.",
  },
] as const;

export type AIProvider = (typeof AI_PROVIDERS)[number]["id"];

export const AI_PROVIDER_MODELS: Record<
  AIProvider,
  { id: string; label: string; description: string }[]
> = {
  groq: [
    {
      id: "openai/gpt-oss-20b",
      label: "GPT-OSS 20B",
      description: "Reliable general-purpose writing and editing.",
    },
    {
      id: "openai/gpt-oss-120b",
      label: "GPT-OSS 120B",
      description: "Stronger reasoning for nuanced rewrites.",
    },
    {
      id: "moonshotai/kimi-k2-instruct-0905",
      label: "Kimi K2 0905",
      description: "Good for structured, detailed portfolio copy.",
    },
  ],
  openrouter: [
    {
      id: "openrouter/free",
      label: "OpenRouter Free Router",
      description: "Lets OpenRouter pick a currently available free model.",
    },
    {
      id: "openrouter/auto",
      label: "OpenRouter Auto",
      description: "Routes to a suitable model based on availability.",
    },
  ],
};

export const AI_TARGET_FIELDS = [
  {
    id: "brandName",
    label: "Brand Name",
    kind: "short",
    placeholder: "A short personal or studio brand name.",
  },
  {
    id: "heroTitle",
    label: "Hero Title",
    kind: "short",
    placeholder: "Main homepage headline.",
  },
  {
    id: "heroSubtitle",
    label: "Hero Subtitle",
    kind: "short",
    placeholder: "Role, niche, or positioning line.",
  },
  {
    id: "heroDescription",
    label: "Hero Description",
    kind: "medium",
    placeholder: "Short value proposition under the hero heading.",
  },
  {
    id: "heroCTA",
    label: "Hero CTA",
    kind: "short",
    placeholder: "Button label for the hero section.",
  },
  {
    id: "aboutTitle",
    label: "About Title",
    kind: "short",
    placeholder: "Heading above the about section.",
  },
  {
    id: "aboutDescription",
    label: "About Description",
    kind: "long",
    placeholder: "Main personal story and working style section.",
  },
  {
    id: "navbarCTA",
    label: "Navbar CTA",
    kind: "short",
    placeholder: "Short call-to-action shown in the navbar.",
  },
  {
    id: "footerDescription",
    label: "Footer Description",
    kind: "medium",
    placeholder: "Short summary shown in the footer.",
  },
  {
    id: "siteTitle",
    label: "SEO Site Title",
    kind: "short",
    placeholder: "Search result headline for the homepage.",
  },
  {
    id: "siteDescription",
    label: "SEO Site Description",
    kind: "medium",
    placeholder: "Search result description for the homepage.",
  },
  {
    id: "footerCopyright",
    label: "Footer Copyright",
    kind: "short",
    placeholder: "Short copyright note.",
  },
] as const;

export type AIContentFieldId = (typeof AI_TARGET_FIELDS)[number]["id"];

export type AIFieldKind = (typeof AI_TARGET_FIELDS)[number]["kind"];

export const AI_TARGET_FIELD_IDS = AI_TARGET_FIELDS.map((field) => field.id) as [
  AIContentFieldId,
  ...AIContentFieldId[],
];

export const AI_TARGET_FIELD_MAP = Object.fromEntries(
  AI_TARGET_FIELDS.map((field) => [field.id, field])
) as Record<
  AIContentFieldId,
  {
    id: AIContentFieldId;
    label: string;
    kind: AIFieldKind;
    placeholder: string;
  }
>;
