import { execFile } from "child_process";
import { mkdtemp, rm, writeFile } from "fs/promises";
import { tmpdir } from "os";
import { join } from "path";
import { promisify } from "util";
import { z } from "zod";
import { TECH_SUGGESTIONS } from "@/constants";
import type { SettingsFormData } from "@/lib/validations";
import { truncateText } from "@/lib/utils";

const execFileAsync = promisify(execFile);

const SKILL_CATEGORY_VALUES = [
  "Frontend",
  "Backend",
  "Database",
  "DevOps",
  "Tools",
  "Other",
] as const;

const EXPERIENCE_TYPE_VALUES = [
  "Full Time",
  "Freelance",
  "Contract",
  "Internship",
] as const;

const PROJECT_CATEGORY_VALUES = [
  "Full Stack",
  "Frontend",
  "Backend",
  "Mobile",
  "Other",
] as const;

const SETTINGS_KEYS = [
  "brandName",
  "heroTitle",
  "heroSubtitle",
  "heroDescription",
  "aboutTitle",
  "aboutDescription",
  "yearsOfExperience",
  "totalProjects",
  "email",
  "phone",
  "location",
  "github",
  "linkedin",
  "siteTitle",
  "siteDescription",
  "footerDescription",
] as const;

export const RESUME_PARSE_MODES = ["auto", "manual", "ai"] as const;

type ResumeSettingsKey = (typeof SETTINGS_KEYS)[number];
type SkillCategory = (typeof SKILL_CATEGORY_VALUES)[number];
type ExperienceType = (typeof EXPERIENCE_TYPE_VALUES)[number];
type ProjectCategory = (typeof PROJECT_CATEGORY_VALUES)[number];
export type ResumeParseMode = (typeof RESUME_PARSE_MODES)[number];

type SectionKey =
  | "summary"
  | "experience"
  | "skills"
  | "projects"
  | "education"
  | "achievements";

type ResumeSectionMap = Partial<Record<SectionKey, string>>;

const sectionAliases: Record<SectionKey, string[]> = {
  summary: [
    "summary",
    "professional summary",
    "profile summary",
    "executive summary",
    "career summary",
    "profile",
    "professional profile",
    "about",
    "about me",
    "objective",
    "career objective",
    "summary of qualifications",
  ],
  experience: [
    "experience",
    "work experience",
    "professional experience",
    "employment history",
    "career history",
    "work history",
    "employment",
  ],
  skills: [
    "skills",
    "technical skills",
    "technical proficiencies",
    "core skills",
    "core competencies",
    "technologies",
    "tech stack",
    "technical expertise",
  ],
  projects: [
    "projects",
    "project",
    "selected projects",
    "key projects",
    "personal projects",
    "project experience",
    "project work",
    "academic projects",
    "portfolio",
  ],
  education: [
    "education",
    "academic details",
    "qualification",
    "qualifications",
    "academic background",
    "academic qualification",
    "academic qualifications",
    "education and training",
    "academics",
  ],
  achievements: [
    "achievements",
    "awards",
    "accomplishments",
    "certifications",
    "certification",
    "certificates",
    "honors",
    "licenses",
    "licenses and certifications",
    "awards and certifications",
  ],
};

const monthMap: Record<string, number> = {
  jan: 1,
  january: 1,
  feb: 2,
  february: 2,
  mar: 3,
  march: 3,
  apr: 4,
  april: 4,
  may: 5,
  jun: 6,
  june: 6,
  jul: 7,
  july: 7,
  aug: 8,
  august: 8,
  sep: 9,
  sept: 9,
  september: 9,
  oct: 10,
  october: 10,
  nov: 11,
  november: 11,
  dec: 12,
  december: 12,
};

const roleHints = [
  "engineer",
  "developer",
  "intern",
  "manager",
  "consultant",
  "analyst",
  "architect",
  "designer",
  "specialist",
  "lead",
  "director",
  "coordinator",
  "administrator",
  "founder",
  "freelancer",
  "trainee",
  "student",
];

const companyHints = [
  "inc",
  "ltd",
  "llc",
  "corp",
  "solutions",
  "technologies",
  "technology",
  "systems",
  "labs",
  "university",
  "college",
  "school",
  "pvt",
  "private limited",
  "consulting",
  "agency",
];

const educationTitleHints = [
  "bachelor",
  "master",
  "b.tech",
  "btech",
  "m.tech",
  "mtech",
  "b.e",
  "be ",
  "m.e",
  "mba",
  "bca",
  "mca",
  "b.sc",
  "bsc",
  "m.sc",
  "msc",
  "phd",
  "doctorate",
  "diploma",
  "secondary",
  "higher secondary",
  "high school",
  "associate",
];

const educationInstitutionHints = [
  "university",
  "college",
  "school",
  "institute",
  "academy",
  "polytechnic",
];

const frontendSkills = [
  "react",
  "next.js",
  "nextjs",
  "vue",
  "vue.js",
  "angular",
  "javascript",
  "typescript",
  "html",
  "css",
  "tailwind",
  "tailwind css",
  "redux",
  "sass",
  "bootstrap",
];

const backendSkills = [
  "node.js",
  "nodejs",
  "express",
  "nest",
  "nestjs",
  "python",
  "django",
  "flask",
  "java",
  "spring",
  "spring boot",
  "php",
  "laravel",
  "graphql",
  "rest api",
  "golang",
  "go",
];

const databaseSkills = [
  "mongodb",
  "postgresql",
  "mysql",
  "redis",
  "firebase",
  "supabase",
  "sql",
  "sqlite",
  "dynamodb",
  "prisma",
];

const devOpsSkills = [
  "aws",
  "azure",
  "gcp",
  "docker",
  "kubernetes",
  "vercel",
  "netlify",
  "jenkins",
  "terraform",
  "linux",
  "nginx",
  "ci/cd",
  "github actions",
];

const toolsSkills = [
  "git",
  "figma",
  "jira",
  "postman",
  "notion",
  "slack",
  "photoshop",
  "canva",
];

const extraTechTerms = [
  "HTML",
  "CSS",
  "React Native",
  "Flutter",
  "C",
  "C++",
  "C#",
  "Java",
  "Spring Boot",
  "NestJS",
  "Supabase",
  "SQL",
  "SQLite",
  "Kubernetes",
  "GitHub Actions",
  "GCP",
  "Linux",
  "Nginx",
];

const knownTechTerms = Array.from(
  new Set([...TECH_SUGGESTIONS, ...extraTechTerms])
).sort((left, right) => right.length - left.length);

const knownTechLookup = new Map(
  knownTechTerms.map((term) => [normalizeLookup(term), term])
);

const genericSkillWords = new Set(
  [
    "skills",
    "technical skills",
    "tools",
    "technologies",
    "languages",
    "frameworks",
    "libraries",
    "databases",
    "platforms",
    "other",
    "familiar",
    "knowledge",
  ].map((value) => value.toLowerCase())
);

const resumeDateTokenPattern =
  "(?:jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:t|tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)[\\s,.-]*\\d{4}|\\d{1,2}[/-]\\d{4}|\\d{4}";
const dateRangeRegex = new RegExp(
  `(${resumeDateTokenPattern})\\s*(?:-|–|—|to)\\s*(present|current|now|${resumeDateTokenPattern})`,
  "i"
);

export const resumeSkillSchema = z.object({
  name: z.string().min(1),
  icon: z.string().default(""),
  category: z.enum(SKILL_CATEGORY_VALUES),
  proficiency: z.number().min(0).max(100).default(80),
  order: z.number().int().min(0).default(0),
  isVisible: z.boolean().default(true),
});

export const resumeExperienceSchema = z.object({
  company: z.string().min(1),
  position: z.string().min(1),
  type: z.enum(EXPERIENCE_TYPE_VALUES),
  startDate: z.string().min(1),
  endDate: z.string().optional().default(""),
  isCurrent: z.boolean().default(false),
  description: z.string().min(1),
  responsibilities: z.array(z.string()).default([]),
  techUsed: z.array(z.string()).default([]),
  companyLogo: z.string().default(""),
  companyUrl: z.string().default(""),
  order: z.number().int().min(0).default(0),
  isVisible: z.boolean().default(true),
});

export const resumeProjectSchema = z.object({
  title: z.string().min(1),
  shortDescription: z.string().min(1),
  longDescription: z.string().default(""),
  thumbnail: z.string().default(""),
  images: z.array(z.string()).default([]),
  techStack: z.array(z.string()).default([]),
  category: z.enum(PROJECT_CATEGORY_VALUES),
  liveUrl: z.string().default(""),
  githubUrl: z.string().default(""),
  clientName: z.string().default(""),
  completionDate: z.string().optional().default(""),
  isFeatured: z.boolean().default(false),
  isVisible: z.boolean().default(true),
  order: z.number().int().min(0).default(0),
});

export const resumeProfileSchema = z.object({
  name: z.string().default(""),
  headline: z.string().default(""),
  summary: z.string().default(""),
  email: z.string().default(""),
  phone: z.string().default(""),
  location: z.string().default(""),
  website: z.string().default(""),
  github: z.string().default(""),
  linkedin: z.string().default(""),
});

export const resumeListItemSchema = z.object({
  title: z.string().min(1),
  subtitle: z.string().default(""),
  dateRange: z.string().default(""),
  description: z.string().default(""),
});

export const resumeSuggestedSettingsSchema = z.object(
  Object.fromEntries(
    SETTINGS_KEYS.map((key) => [
      key,
      key === "yearsOfExperience" || key === "totalProjects"
        ? z.number().optional()
        : z.string().optional(),
    ])
  ) as unknown as Record<ResumeSettingsKey, z.ZodTypeAny>
);

export const resumeParsedDataSchema = z.object({
  mode: z.enum(["heuristic", "ai"]),
  notes: z.array(z.string()).default([]),
  rawTextPreview: z.string(),
  profile: resumeProfileSchema,
  skills: z.array(resumeSkillSchema).default([]),
  experiences: z.array(resumeExperienceSchema).default([]),
  projects: z.array(resumeProjectSchema).default([]),
  education: z.array(resumeListItemSchema).default([]),
  achievements: z.array(resumeListItemSchema).default([]),
  suggestedSettings: resumeSuggestedSettingsSchema,
});

export type ResumeParsedData = z.infer<typeof resumeParsedDataSchema>;
export type ResumeSkillDraft = z.infer<typeof resumeSkillSchema>;
export type ResumeExperienceDraft = z.infer<typeof resumeExperienceSchema>;
export type ResumeProjectDraft = z.infer<typeof resumeProjectSchema>;
export type ParseResumeOptions = {
  mode?: ResumeParseMode;
  aiInstructions?: string;
};

const aiResumeDraftSchema = z.object({
  profile: z
    .unknown()
    .optional()
    .transform((value) => resumeProfileSchema.parse(value || {})),
  skills: z
    .array(
      z.object({
        name: z.string().default(""),
        category: z.string().default(""),
        proficiency: z.number().optional(),
      })
    )
    .default([]),
  experiences: z
    .array(
      z.object({
        company: z.string().default(""),
        position: z.string().default(""),
        type: z.string().default(""),
        startDate: z.string().default(""),
        endDate: z.string().default(""),
        isCurrent: z.boolean().optional(),
        description: z.string().default(""),
        responsibilities: z.array(z.string()).default([]),
        techUsed: z.array(z.string()).default([]),
      })
    )
    .default([]),
  projects: z
    .array(
      z.object({
        title: z.string().default(""),
        shortDescription: z.string().default(""),
        longDescription: z.string().default(""),
        techStack: z.array(z.string()).default([]),
        category: z.string().default(""),
        liveUrl: z.string().default(""),
        githubUrl: z.string().default(""),
        completionDate: z.string().default(""),
      })
    )
    .default([]),
  education: z
    .array(
      z.object({
        title: z.string().default(""),
        subtitle: z.string().default(""),
        dateRange: z.string().default(""),
        description: z.string().default(""),
      })
    )
    .default([]),
  achievements: z
    .array(
      z.object({
        title: z.string().default(""),
        subtitle: z.string().default(""),
        dateRange: z.string().default(""),
        description: z.string().default(""),
      })
    )
    .default([]),
});

function normalizeLookup(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9+#.]+/g, "");
}

function stripBullet(line: string) {
  return line.replace(/^[•*·\-]+\s*/, "").trim();
}

function sanitizeText(text: string) {
  return text
    .replace(/\u0000/g, "")
    .replace(/\r/g, "\n")
    .replace(/\u2022/g, "•")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

function normalizeHeading(text: string) {
  return text
    .toLowerCase()
    .replace(/^[\d\s.)-]+/, "")
    .replace(/[:|]/g, " ")
    .replace(/\bsection\b/g, " ")
    .replace(/[^a-z\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getSectionKey(line: string): SectionKey | null {
  const heading = normalizeHeading(line);
  if (!heading || heading.length > 40) return null;

  for (const [sectionKey, aliases] of Object.entries(sectionAliases) as [
    SectionKey,
    string[],
  ][]) {
    if (aliases.includes(heading)) return sectionKey;
  }

  return null;
}

function splitIntoSections(text: string) {
  const lines = sanitizeText(text).split("\n").map((line) => line.trimEnd());
  const sections: Partial<Record<SectionKey, string[]>> = {};
  const intro: string[] = [];
  let current: SectionKey | "intro" = "intro";

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      if (current === "intro") intro.push("");
      else (sections[current] ||= []).push("");
      continue;
    }

    const sectionKey = getSectionKey(trimmed);
    if (sectionKey) {
      current = sectionKey;
      continue;
    }

    if (current === "intro") intro.push(trimmed);
    else (sections[current] ||= []).push(trimmed);
  }

  return {
    intro: intro.join("\n").trim(),
    sections: Object.fromEntries(
      Object.entries(sections).map(([key, value]) => [key, value.join("\n").trim()])
    ) as ResumeSectionMap,
  };
}

function normalizeUrl(url: string) {
  const trimmed = url.replace(/[),.;]+$/, "").trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

function extractEmail(text: string) {
  return text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0] || "";
}

function extractPhone(text: string) {
  const candidates =
    text.match(/(?:\+?\d[\d\s().-]{8,}\d)/g)?.map((value) => value.trim()) || [];

  return (
    candidates.find((candidate) => {
      const digits = candidate.replace(/\D/g, "");
      return digits.length >= 10 && digits.length <= 15;
    }) || ""
  );
}

function extractFirstUrl(text: string, matcher?: RegExp) {
  const urls =
    text.match(
      /(?:https?:\/\/)?(?:www\.)?[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)+(?:\/[^\s)]*)?/g
    ) || [];

  const match = matcher
    ? urls.find((url) => matcher.test(url))
    : urls.find((url) => !/@/.test(url));

  return match ? normalizeUrl(match) : "";
}

function looksLikeName(line: string) {
  if (!line || line.length > 60) return false;
  if (getSectionKey(line)) return false;
  if (/\d/.test(line) || /@|https?:\/\//i.test(line)) return false;
  const words = line.split(/\s+/).filter(Boolean);
  if (words.length < 2 || words.length > 5) return false;
  return words.every((word) => /^[A-Za-z.'-]+$/.test(word));
}

function looksLikeHeadline(line: string) {
  if (!line || line.length > 90) return false;
  if (getSectionKey(line)) return false;
  if (/@|https?:\/\//i.test(line)) return false;
  return !extractEmail(line) && !extractPhone(line);
}

function extractLocation(lines: string[]) {
  return (
    lines.find((line) => {
      if (!line || line.length > 80) return false;
      if (extractEmail(line) || extractPhone(line) || /https?:\/\//i.test(line)) return false;
      if (!/,/.test(line)) return false;
      return line.split(/\s+/).length <= 8;
    }) || ""
  );
}

function splitListValues(fragment: string) {
  return fragment
    .split(/\s*[|,;•·]\s*|\s{2,}/)
    .map((value) => stripBullet(value))
    .filter(Boolean);
}

function canonicalSkillName(value: string) {
  const cleaned = stripBullet(value)
    .replace(/\([^)]*\)/g, "")
    .replace(/\s+/g, " ")
    .trim();
  if (!cleaned) return "";
  const fromLookup = knownTechLookup.get(normalizeLookup(cleaned));
  return fromLookup || cleaned;
}

function categorizeSkill(name: string, hint?: string): SkillCategory {
  const lowerName = name.toLowerCase();
  const lowerHint = (hint || "").toLowerCase();

  if (lowerHint.includes("front")) return "Frontend";
  if (lowerHint.includes("back")) return "Backend";
  if (lowerHint.includes("database") || lowerHint.includes("data")) return "Database";
  if (lowerHint.includes("devops") || lowerHint.includes("cloud")) return "DevOps";
  if (lowerHint.includes("tool")) return "Tools";

  if (frontendSkills.some((item) => lowerName.includes(item))) return "Frontend";
  if (backendSkills.some((item) => lowerName.includes(item))) return "Backend";
  if (databaseSkills.some((item) => lowerName.includes(item))) return "Database";
  if (devOpsSkills.some((item) => lowerName.includes(item))) return "DevOps";
  if (toolsSkills.some((item) => lowerName.includes(item))) return "Tools";

  return "Other";
}

function extractTechFromText(text: string) {
  const found = new Map<string, string>();
  const lower = text.toLowerCase();

  for (const tech of knownTechTerms) {
    const escaped = tech.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(^|[^a-z0-9+#.])${escaped}([^a-z0-9+#.]|$)`, "i");
    if (regex.test(lower)) {
      found.set(normalizeLookup(tech), tech);
    }
  }

  return Array.from(found.values());
}

function parseSkills(sectionText: string, fallbackText: string) {
  const rawSkills = new Map<string, ResumeSkillDraft>();
  const source = sectionText || "";
  const lines = source
    ? source.split("\n").map((line) => line.trim()).filter(Boolean)
    : [];

  for (const line of lines) {
    const cleanedLine = stripBullet(line);
    if (!cleanedLine) continue;

    if (cleanedLine.includes(":")) {
      const [hint, ...rest] = cleanedLine.split(":");
      const items = splitListValues(rest.join(":"));
      for (const item of items) {
        const name = canonicalSkillName(item);
        if (!name || genericSkillWords.has(name.toLowerCase())) continue;
        rawSkills.set(normalizeLookup(name), {
          name,
          icon: "",
          category: categorizeSkill(name, hint),
          proficiency: 80,
          order: 0,
          isVisible: true,
        });
      }
      continue;
    }

    const items = splitListValues(cleanedLine);
    if (items.length > 1) {
      for (const item of items) {
        const name = canonicalSkillName(item);
        if (!name || genericSkillWords.has(name.toLowerCase())) continue;
        rawSkills.set(normalizeLookup(name), {
          name,
          icon: "",
          category: categorizeSkill(name),
          proficiency: 80,
          order: 0,
          isVisible: true,
        });
      }
      continue;
    }

    const inferred = extractTechFromText(cleanedLine);
    for (const item of inferred) {
      rawSkills.set(normalizeLookup(item), {
        name: item,
        icon: "",
        category: categorizeSkill(item),
        proficiency: 80,
        order: 0,
        isVisible: true,
      });
    }
  }

  if (!rawSkills.size) {
    for (const skill of extractTechFromText(fallbackText)) {
      rawSkills.set(normalizeLookup(skill), {
        name: skill,
        icon: "",
        category: categorizeSkill(skill),
        proficiency: 80,
        order: 0,
        isVisible: true,
      });
    }
  }

  return Array.from(rawSkills.values()).map((skill, index) => ({
    ...skill,
    order: index,
  }));
}

function looksLikeRole(text: string) {
  const lower = text.toLowerCase();
  return roleHints.some((hint) => lower.includes(hint));
}

function looksLikeCompany(text: string) {
  const lower = text.toLowerCase();
  return companyHints.some((hint) => lower.includes(hint));
}

function looksLikeEducationTitle(text: string) {
  const lower = text.toLowerCase();
  return educationTitleHints.some((hint) => lower.includes(hint));
}

function looksLikeEducationInstitution(text: string) {
  const lower = text.toLowerCase();
  return educationInstitutionHints.some((hint) => lower.includes(hint));
}

function getDateRangeMatches(text: string) {
  return Array.from(text.matchAll(new RegExp(dateRangeRegex.source, "gi")));
}

function hasDateRange(text: string) {
  return getDateRangeMatches(text).length > 0;
}

function stripDateRangeFragments(text: string) {
  return text
    .replace(new RegExp(dateRangeRegex.source, "gi"), " ")
    .replace(/\b(?:present|current|now)\b/gi, " ")
    .replace(/\s{2,}/g, " ")
    .replace(/^[\s|•·,\-–—]+/, "")
    .replace(/[\s|•·,\-–—]+$/, "")
    .trim();
}

function getTrailingHeaderCarryoverStart(lines: string[], maxLines = 2) {
  let index = lines.length;
  let moved = 0;

  while (index > 0 && moved < maxLines) {
    const candidate = lines[index - 1]?.trim();
    if (!candidate || /^[•*·\-]/.test(candidate) || hasDateRange(candidate)) break;

    index -= 1;
    moved += 1;
  }

  return moved ? index : lines.length;
}

function parseRoleAndCompany(lines: string[]) {
  const cleaned = lines
    .map((line) => stripDateRangeFragments(stripBullet(line)))
    .filter(Boolean)
    .slice(0, 3);
  if (!cleaned.length) return { position: "", company: "" };

  const first = cleaned[0];

  if (/\sat\s/i.test(first)) {
    const [position, company] = first.split(/\sat\s/i);
    return { position: position.trim(), company: company.trim() };
  }

  if (/[|@]/.test(first)) {
    const segments = first.split(/[|@]/).map((value) => value.trim()).filter(Boolean);
    if (segments.length >= 2) {
      const roleSegment = segments.find(looksLikeRole) || segments[0];
      const companySegment =
        segments.find((segment) => segment !== roleSegment && !looksLikeRole(segment)) ||
        segments.find((segment) => segment !== roleSegment) ||
        "";

      if (roleSegment && companySegment) {
        return { position: roleSegment, company: companySegment };
      }
    }
  }

  if (/\s[-–—]\s/.test(first)) {
    const [left, right] = first.split(/\s[-–—]\s/).map((value) => value.trim());
    if (looksLikeRole(left) && !looksLikeRole(right)) return { position: left, company: right };
    if (!looksLikeRole(left) && looksLikeRole(right)) return { position: right, company: left };
  }

  if (cleaned.length >= 2) {
    const [lineOne, lineTwo] = cleaned;
    if (looksLikeRole(lineOne) && !looksLikeRole(lineTwo)) {
      return { position: lineOne, company: lineTwo };
    }
    if (!looksLikeRole(lineOne) && looksLikeRole(lineTwo)) {
      return { position: lineTwo, company: lineOne };
    }
    if (looksLikeCompany(lineOne) && !looksLikeCompany(lineTwo)) {
      return { position: lineTwo, company: lineOne };
    }
    return { position: lineOne, company: lineTwo };
  }

  return { position: first, company: "" };
}

function normalizeDateToken(token: string, isEndDate = false) {
  const cleaned = token
    .toLowerCase()
    .replace(/[,]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!cleaned || /present|current|now/.test(cleaned)) return "";

  const monthYear = cleaned.match(
    /^(jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:t|tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)\s+(\d{4})$/
  );
  if (monthYear) {
    const month = monthMap[monthYear[1]];
    const year = monthYear[2];
    return `${year}-${String(month).padStart(2, "0")}-${isEndDate ? "28" : "01"}`;
  }

  const numericMonth = cleaned.match(/^(\d{1,2})[/-](\d{4})$/);
  if (numericMonth) {
    const month = Math.min(12, Math.max(1, Number(numericMonth[1])));
    const year = numericMonth[2];
    return `${year}-${String(month).padStart(2, "0")}-${isEndDate ? "28" : "01"}`;
  }

  const yearOnly = cleaned.match(/^(\d{4})$/);
  if (yearOnly) {
    return `${yearOnly[1]}-${isEndDate ? "12" : "01"}-${isEndDate ? "28" : "01"}`;
  }

  return "";
}

function detectExperienceType(text: string): ExperienceType {
  const lower = text.toLowerCase();
  if (lower.includes("intern")) return "Internship";
  if (lower.includes("contract")) return "Contract";
  if (lower.includes("freelance") || lower.includes("consultant")) return "Freelance";
  return "Full Time";
}

function splitBlocks(text: string) {
  return sanitizeText(text)
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);
}

function expandStructuredBlocks(sectionText: string) {
  return splitBlocks(sectionText).flatMap((block) => {
    const lines = block.split("\n").map((line) => line.trim()).filter(Boolean);
    if (!lines.length || getDateRangeMatches(block).length <= 1) return [block];

    const groupedBlocks: string[] = [];
    let current: string[] = [];
    let currentHasDate = false;

    for (const line of lines) {
      if (hasDateRange(line) && currentHasDate) {
        const carryoverStart = getTrailingHeaderCarryoverStart(current);
        const finalized = current.slice(0, carryoverStart).filter(Boolean);
        const carryover = current.slice(carryoverStart).filter(Boolean);

        if (finalized.length) {
          groupedBlocks.push(finalized.join("\n"));
        }

        current = [...carryover, line];
        currentHasDate = true;
        continue;
      }

      current.push(line);
      if (hasDateRange(line)) currentHasDate = true;
    }

    if (current.length) {
      groupedBlocks.push(current.join("\n"));
    }

    return groupedBlocks;
  });
}

function compactSentenceList(lines: string[]) {
  return lines
    .map((line) => stripBullet(line))
    .filter(Boolean)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

function parseExperienceBlocks(sectionText: string, fallbackSkills: ResumeSkillDraft[]) {
  const blocks = expandStructuredBlocks(sectionText);
  const experiences: ResumeExperienceDraft[] = [];

  blocks.forEach((block, index) => {
    const lines = block.split("\n").map((line) => line.trim()).filter(Boolean);
    if (!lines.length) return;

    const dateMatch = block.match(dateRangeRegex);
    const firstBulletIndex = lines.findIndex((line) => /^[•*·\-]/.test(line));
    const headerLineCount =
      firstBulletIndex === -1
        ? Math.min(3, lines.length)
        : Math.min(Math.max(firstBulletIndex, 1), 3);
    const headerLines = lines
      .slice(0, headerLineCount)
      .map((line) => stripDateRangeFragments(line))
      .filter(Boolean);
    const detailLines = lines.slice(headerLineCount);

    const { position, company } = parseRoleAndCompany(headerLines);
    const startDate = dateMatch ? normalizeDateToken(dateMatch[1]) : "";
    const endToken = dateMatch?.[2] || "";
    const endDate = normalizeDateToken(endToken, true);
    const isCurrent = /present|current|now/i.test(endToken);
    const responsibilities = detailLines
      .filter((line) => /^[•*·\-]/.test(line))
      .map((line) => stripBullet(line))
      .filter(Boolean);
    const narrativeLines = detailLines
      .filter((line) => !/^[•*·\-]/.test(line))
      .map((line) => stripDateRangeFragments(stripBullet(line)))
      .filter(Boolean);
    const description =
      narrativeLines[0] ||
      responsibilities[0] ||
      compactSentenceList(detailLines).slice(0, 280) ||
      "";
    const techUsed = Array.from(
      new Set([
        ...extractTechFromText(block),
        ...fallbackSkills
          .map((skill) => skill.name)
          .filter((skill) => new RegExp(`(^|[^a-z0-9])${skill.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}([^a-z0-9]|$)`, "i").test(block)),
      ])
    );

    if (!position || !company || !startDate || !description) return;

    experiences.push({
      company,
      position,
      type: detectExperienceType(`${position} ${company} ${block}`),
      startDate,
      endDate,
      isCurrent,
      description: truncateText(description, 300),
      responsibilities: responsibilities.slice(0, 6),
      techUsed: techUsed.slice(0, 8),
      companyLogo: "",
      companyUrl: "",
      order: index,
      isVisible: true,
    });
  });

  return experiences;
}

function detectProjectCategory(techStack: string[]): ProjectCategory {
  const lower = techStack.map((item) => item.toLowerCase());
  const hasFrontend = lower.some((item) => frontendSkills.some((skill) => item.includes(skill)));
  const hasBackend = lower.some((item) => backendSkills.some((skill) => item.includes(skill)));
  const hasMobile = lower.some((item) => /react native|flutter|android|ios/.test(item));

  if (hasMobile) return "Mobile";
  if (hasFrontend && hasBackend) return "Full Stack";
  if (hasFrontend) return "Frontend";
  if (hasBackend) return "Backend";
  return "Other";
}

function parseProjectBlocks(sectionText: string) {
  const blocks = expandStructuredBlocks(sectionText);
  const projects: ResumeProjectDraft[] = [];

  blocks.forEach((block, index) => {
    const lines = block.split("\n").map((line) => line.trim()).filter(Boolean);
    if (!lines.length) return;

    const titleLine = lines.find(
      (line) =>
        !dateRangeRegex.test(line) &&
        !/^(?:tech(?:nologies)?|stack|tools)\s*:?/i.test(line) &&
        !/^https?:\/\//i.test(line)
    );
    const techLine = lines.find((line) => /^(tech(?:nologies)?|stack|tools)\s*:/i.test(line));
    const techStack = Array.from(
      new Set(
        [
          ...(techLine ? splitListValues(techLine.split(":").slice(1).join(":")) : []),
          ...extractTechFromText(block),
        ].map((item) => canonicalSkillName(item)).filter(Boolean)
      )
    );
    const githubUrl = extractFirstUrl(block, /github\.com/i);
    const liveUrl = extractFirstUrl(block, /^(?!.*github\.com)/i);
    const dateMatch = block.match(dateRangeRegex);
    const descriptionLines = lines.filter(
      (line) =>
        line !== titleLine &&
        line !== techLine &&
        !/^https?:\/\//i.test(line) &&
        (!dateMatch || !line.includes(dateMatch[0]))
    );
    const description = compactSentenceList(descriptionLines);
    const shortDescription = truncateText(description || titleLine || "Project import", 220);
    const completionDate = dateMatch ? normalizeDateToken(dateMatch[2], true) : "";

    if (!titleLine) return;

    projects.push({
      title: stripBullet(titleLine),
      shortDescription,
      longDescription: description,
      thumbnail: "",
      images: [],
      techStack: techStack.slice(0, 10),
      category: detectProjectCategory(techStack),
      liveUrl: liveUrl && !/github\.com/i.test(liveUrl) ? liveUrl : "",
      githubUrl,
      clientName: "",
      completionDate,
      isFeatured: index === 0,
      isVisible: true,
      order: index,
    });
  });

  return projects.filter((project) => project.title.length >= 2);
}

function parseEducationBlocks(sectionText: string) {
  return expandStructuredBlocks(sectionText)
    .map((block) => {
      const lines = block.split("\n").map((line) => line.trim()).filter(Boolean);
      if (!lines.length) return null;

      const dateMatch = block.match(dateRangeRegex);
      const contentLines = lines
        .map((line) => stripDateRangeFragments(stripBullet(line)))
        .filter(Boolean);
      if (!contentLines.length) return null;

      const [first = "", second = "", ...rest] = contentLines;
      let title = first;
      let subtitle = second;

      if (first && second) {
        const firstLooksLikeTitle = looksLikeEducationTitle(first);
        const secondLooksLikeTitle = looksLikeEducationTitle(second);
        const firstLooksLikeInstitution = looksLikeEducationInstitution(first);
        const secondLooksLikeInstitution = looksLikeEducationInstitution(second);

        if (!firstLooksLikeTitle && secondLooksLikeTitle) {
          title = second;
          subtitle = first;
        } else if (firstLooksLikeInstitution && !secondLooksLikeInstitution) {
          title = second;
          subtitle = first;
        }
      }

      return {
        title,
        subtitle,
        dateRange: dateMatch?.[0] || "",
        description: compactSentenceList(rest),
      };
    })
    .filter((item): item is z.infer<typeof resumeListItemSchema> => Boolean(item?.title));
}

function parseSimpleListItems(sectionText: string) {
  return expandStructuredBlocks(sectionText)
    .map((block) => {
      const lines = block.split("\n").map((line) => line.trim()).filter(Boolean);
      if (!lines.length) return null;

      const dateMatch = block.match(dateRangeRegex);
      const contentLines = lines
        .map((line) => stripDateRangeFragments(stripBullet(line)))
        .filter(Boolean);
      const title = contentLines[0] || "";
      const subtitle = contentLines[1] || "";
      const description = compactSentenceList(contentLines.slice(subtitle ? 2 : 1));

      if (!title) return null;

      return {
        title,
        subtitle,
        dateRange: dateMatch?.[0] || "",
        description,
      };
    })
    .filter((item): item is z.infer<typeof resumeListItemSchema> => Boolean(item));
}

function buildSummaryFromIntro(
  intro: string,
  profile: z.infer<typeof resumeProfileSchema>,
  sectionSummary: string
) {
  if (sectionSummary) return sectionSummary;

  const lines = intro
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .filter(
      (line) =>
        line !== profile.name &&
        line !== profile.headline &&
        line !== profile.location &&
        (!profile.email || !line.includes(profile.email)) &&
        (!profile.phone || !line.includes(profile.phone)) &&
        !/linkedin\.com|github\.com|https?:\/\//i.test(line)
    );

  return compactSentenceList(lines.slice(0, 4));
}

function buildProfile(intro: string, rawText: string, summaryText: string) {
  const introLines = intro.split("\n").map((line) => line.trim()).filter(Boolean);
  const name = introLines.find(looksLikeName) || "";
  const headline =
    introLines.find((line) => line !== name && looksLikeHeadline(line)) || "";
  const email = extractEmail(rawText);
  const phone = extractPhone(rawText);
  const github = extractFirstUrl(rawText, /github\.com/i);
  const linkedin = extractFirstUrl(rawText, /linkedin\.com/i);
  const website = extractFirstUrl(rawText, /^(?!.*(?:github|linkedin)\.com)/i);
  const location = extractLocation(introLines);

  return {
    name,
    headline,
    summary: buildSummaryFromIntro(intro, { name, headline, summary: "", email, phone, location, website, github, linkedin }, summaryText),
    email,
    phone,
    location,
    website,
    github,
    linkedin,
  };
}

function computeYearsOfExperience(experiences: ResumeExperienceDraft[]) {
  if (!experiences.length) return 0;

  const timestamps = experiences
    .map((experience) => Date.parse(experience.startDate))
    .filter((value) => Number.isFinite(value));

  if (!timestamps.length) return 0;

  const first = Math.min(...timestamps);
  const last = Date.now();
  const yearCount = Math.floor((last - first) / (365.25 * 24 * 60 * 60 * 1000));
  return Math.max(0, yearCount);
}

function formatHighlights(items: z.infer<typeof resumeListItemSchema>[], label: string) {
  if (!items.length) return "";
  const titles = items
    .slice(0, 2)
    .map((item) => item.title)
    .filter(Boolean)
    .join(" and ");
  return titles ? `${label} include ${titles}.` : "";
}

function buildSuggestedSettings({
  profile,
  skills,
  experiences,
  projects,
  education,
  achievements,
}: {
  profile: z.infer<typeof resumeProfileSchema>;
  skills: ResumeSkillDraft[];
  experiences: ResumeExperienceDraft[];
  projects: ResumeProjectDraft[];
  education: z.infer<typeof resumeListItemSchema>[];
  achievements: z.infer<typeof resumeListItemSchema>[];
}): Partial<SettingsFormData> {
  const latestRole = profile.headline || experiences[0]?.position || "";
  const summary = profile.summary || "";
  const heroDescription =
    truncateText(
      summary ||
        [
          latestRole ? `I work as ${latestRole}.` : "",
          skills.length
            ? `My core stack includes ${skills
                .slice(0, 6)
                .map((skill) => skill.name)
                .join(", ")}.`
            : "",
        ]
          .filter(Boolean)
          .join(" "),
      220
    ) || "";

  const aboutParagraphs = [
    summary,
    [
      experiences[0]
        ? `Most recently, I have been working as ${experiences[0].position} at ${experiences[0].company}.`
        : "",
      formatHighlights(education, "Education highlights"),
      formatHighlights(achievements, "Achievements"),
      skills.length
        ? `Core skills include ${skills
            .slice(0, 8)
            .map((skill) => skill.name)
            .join(", ")}.`
        : "",
    ]
      .filter(Boolean)
      .join(" "),
  ]
    .filter(Boolean)
    .join("\n\n");

  return {
    brandName: profile.name || undefined,
    heroTitle: profile.name ? `Hi, I'm ${profile.name}` : undefined,
    heroSubtitle: latestRole || undefined,
    heroDescription: heroDescription || undefined,
    aboutTitle: aboutParagraphs ? "About Me" : undefined,
    aboutDescription: aboutParagraphs || undefined,
    yearsOfExperience: experiences.length ? computeYearsOfExperience(experiences) : undefined,
    totalProjects: projects.length || undefined,
    email: profile.email || undefined,
    phone: profile.phone || undefined,
    location: profile.location || undefined,
    github: profile.github || undefined,
    linkedin: profile.linkedin || undefined,
    siteTitle:
      profile.name && latestRole ? `${profile.name} | ${latestRole}` : profile.name || undefined,
    siteDescription: truncateText(summary || heroDescription, 155) || undefined,
    footerDescription: truncateText(summary || heroDescription, 170) || undefined,
  };
}

function extractJsonObject(text: string) {
  const direct = text.trim();
  if (direct.startsWith("{") && direct.endsWith("}")) return direct;

  const fenced = direct.match(/```(?:json)?\s*([\s\S]+?)```/i);
  if (fenced?.[1]) return fenced[1].trim();

  const start = direct.indexOf("{");
  const end = direct.lastIndexOf("}");
  if (start >= 0 && end > start) return direct.slice(start, end + 1);

  return "";
}

async function withTempFile<T>(
  buffer: Buffer,
  extension: string,
  callback: (filePath: string) => Promise<T>
) {
  const tempDir = await mkdtemp(join(tmpdir(), "portfolio-resume-"));
  const filePath = join(tempDir, `resume${extension}`);

  try {
    await writeFile(filePath, buffer);
    return await callback(filePath);
  } finally {
    await rm(tempDir, { recursive: true, force: true }).catch(() => undefined);
  }
}

async function readMdlsText(filePath: string) {
  if (process.platform !== "darwin") return "";

  const { stdout } = await execFileAsync("/usr/bin/mdls", [
    "-raw",
    "-name",
    "kMDItemTextContent",
    filePath,
  ]);
  const text = String(stdout || "").trim();

  if (!text || text === "(null)") return "";
  return sanitizeText(text.replace(/^"+|"+$/g, ""));
}

async function extractPdfText(buffer: Buffer) {
  try {
    const requireFunc = typeof process !== "undefined" && process.release.name === "node" ? eval("require") : null;
    if (!requireFunc) throw new Error("Runtime is not Node.js, cannot load pdf-parse.");
    const { PDFParse } = requireFunc("pdf-parse");
    const parser = new PDFParse({ data: buffer });

    try {
      const result = await parser.getText();
      return sanitizeText(result.text || "");
    } finally {
      await parser.destroy().catch(() => undefined);
    }
  } catch (error) {
    const fallback = await withTempFile(buffer, ".pdf", readMdlsText).catch(() => "");
    if (fallback) return fallback;

    throw error;
  }
}

async function extractDocxText(buffer: Buffer) {
  try {
    const mammoth = await import("mammoth");
    const result = await mammoth.extractRawText({ buffer });
    return sanitizeText(result.value || "");
  } catch (error) {
    if (process.platform !== "darwin") throw error;

    const fallback = await withTempFile(buffer, ".docx", async (filePath) => {
      const { stdout } = await execFileAsync(
        "/usr/bin/textutil",
        ["-convert", "txt", "-stdout", filePath],
        { maxBuffer: 10 * 1024 * 1024 }
      );
      return sanitizeText(String(stdout || ""));
    }).catch(() => "");

    if (fallback) return fallback;
    throw error;
  }
}

function mergeProfile(
  base: z.infer<typeof resumeProfileSchema>,
  override: z.infer<typeof resumeProfileSchema>
) {
  return {
    name: override.name || base.name,
    headline: override.headline || base.headline,
    summary: override.summary || base.summary,
    email: override.email || base.email,
    phone: override.phone || base.phone,
    location: override.location || base.location,
    website: override.website || base.website,
    github: override.github || base.github,
    linkedin: override.linkedin || base.linkedin,
  };
}

function getAiProviderConfig():
  | { provider: "groq"; model: string; apiKey: string; url: string; headers: Record<string, string> }
  | {
      provider: "openrouter";
      model: string;
      apiKey: string;
      url: string;
      headers: Record<string, string>;
    }
  | null {
  if (process.env.GROQ_API_KEY) {
    return {
      provider: "groq",
      model: "openai/gpt-oss-120b",
      apiKey: process.env.GROQ_API_KEY,
      url: "https://api.groq.com/openai/v1/chat/completions",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
    };
  }

  if (process.env.OPENROUTER_API_KEY) {
    return {
      provider: "openrouter",
      model: "openrouter/auto",
      apiKey: process.env.OPENROUTER_API_KEY,
      url: "https://openrouter.ai/api/v1/chat/completions",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "X-Title": "Portfolio Resume Importer",
      },
    };
  }

  return null;
}

async function tryAiExtraction(rawText: string, aiInstructions = "") {
  const config = getAiProviderConfig();
  if (!config) return null;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  const response = await fetch(config.url, {
    method: "POST",
    headers: config.headers,
    body: JSON.stringify({
      model: config.model,
      temperature: 0.1,
      max_tokens: 2200,
      messages: [
        {
          role: "system",
          content: [
            "You extract structured data from resumes for a portfolio builder.",
            "Return valid JSON only.",
            "Do not invent facts.",
            "Use empty strings or empty arrays when data is missing.",
            "For dates, prefer YYYY-MM-DD when month is known, YYYY-01-01 when only the year is known, and empty string when unknown.",
            `Use one of these skill categories: ${SKILL_CATEGORY_VALUES.join(", ")}.`,
            `Use one of these experience types: ${EXPERIENCE_TYPE_VALUES.join(", ")}.`,
            `Use one of these project categories: ${PROJECT_CATEGORY_VALUES.join(", ")}.`,
          ].join(" "),
        },
        {
          role: "user",
          content: [
            "Extract this resume into the following JSON shape:",
            JSON.stringify(
              {
                profile: {
                  name: "",
                  headline: "",
                  summary: "",
                  email: "",
                  phone: "",
                  location: "",
                  website: "",
                  github: "",
                  linkedin: "",
                },
                skills: [{ name: "", category: "", proficiency: 80 }],
                experiences: [
                  {
                    company: "",
                    position: "",
                    type: "",
                    startDate: "",
                    endDate: "",
                    isCurrent: false,
                    description: "",
                    responsibilities: [],
                    techUsed: [],
                  },
                ],
                projects: [
                  {
                    title: "",
                    shortDescription: "",
                    longDescription: "",
                    techStack: [],
                    category: "",
                    liveUrl: "",
                    githubUrl: "",
                    completionDate: "",
                  },
                ],
                education: [{ title: "", subtitle: "", dateRange: "", description: "" }],
                achievements: [{ title: "", subtitle: "", dateRange: "", description: "" }],
              },
              null,
              2
            ),
            "Keep experience, education, projects, achievements, and profile fields in the correct arrays. If something is ambiguous, leave it empty instead of placing it in the wrong section.",
            aiInstructions.trim()
              ? `Additional extraction instructions: ${aiInstructions.trim()}`
              : "",
            "Resume:",
            rawText.slice(0, 24000),
          ]
            .filter(Boolean)
            .join("\n\n"),
        },
      ],
    }),
    cache: "no-store",
    signal: controller.signal,
  }).finally(() => clearTimeout(timeout));

  if (!response.ok) return null;

  const payload = await response.json().catch(() => null);
  const content = payload?.choices?.[0]?.message?.content;
  const text =
    typeof content === "string"
      ? content
      : Array.isArray(content)
        ? content
            .map((item: any) => (typeof item === "string" ? item : item?.text || ""))
            .join("\n")
        : "";
  const json = extractJsonObject(text);
  if (!json) return null;

  const parsed = aiResumeDraftSchema.safeParse(JSON.parse(json));
  if (!parsed.success) return null;

  return {
    provider: config.provider,
    model: config.model,
    data: parsed.data,
  };
}

function normalizeAiResult(result: z.infer<typeof aiResumeDraftSchema>) {
  const skills = result.skills
    .map((skill, index) => {
      const name = canonicalSkillName(skill.name);
      if (!name) return null;

      return {
        name,
        icon: "",
        category: categorizeSkill(name, skill.category),
        proficiency: typeof skill.proficiency === "number" ? skill.proficiency : 80,
        order: index,
        isVisible: true,
      };
    })
    .filter((item): item is ResumeSkillDraft => Boolean(item));

  const experiences = result.experiences
    .map((experience, index) => {
      const company = experience.company.trim();
      const position = experience.position.trim();
      const startDate = normalizeDateToken(experience.startDate);
      if (!company || !position || !startDate || !experience.description.trim()) return null;

      return {
        company,
        position,
        type: detectExperienceType(`${experience.type} ${position}`),
        startDate,
        endDate: normalizeDateToken(experience.endDate, true),
        isCurrent:
          experience.isCurrent || /present|current|now/i.test(experience.endDate || ""),
        description: truncateText(experience.description.trim(), 300),
        responsibilities: experience.responsibilities.filter(Boolean).slice(0, 6),
        techUsed: Array.from(
          new Set(
            [...experience.techUsed, ...extractTechFromText(experience.description)]
              .map((item) => canonicalSkillName(item))
              .filter(Boolean)
          )
        ).slice(0, 8),
        companyLogo: "",
        companyUrl: "",
        order: index,
        isVisible: true,
      };
    })
    .filter((item): item is ResumeExperienceDraft => Boolean(item));

  const projects = result.projects
    .map<ResumeProjectDraft | null>((project, index) => {
      const title = project.title.trim();
      if (!title) return null;

      const techStack = Array.from(
        new Set(
          [...project.techStack, ...extractTechFromText(project.longDescription || project.shortDescription)]
            .map((item) => canonicalSkillName(item))
            .filter(Boolean)
        )
      );

      return {
        title,
        shortDescription: truncateText(
          project.shortDescription.trim() || project.longDescription.trim() || title,
          220
        ),
        longDescription: project.longDescription.trim(),
        thumbnail: "",
        images: [] as string[],
        techStack: techStack.slice(0, 10),
        category: detectProjectCategory(techStack),
        liveUrl: normalizeUrl(project.liveUrl || ""),
        githubUrl: normalizeUrl(project.githubUrl || ""),
        clientName: "",
        completionDate: normalizeDateToken(project.completionDate, true),
        isFeatured: index === 0,
        isVisible: true,
        order: index,
      };
    })
    .filter((item): item is ResumeProjectDraft => Boolean(item));

  const education = result.education
    .filter((item) => item.title.trim())
    .map((item) => ({
      title: item.title.trim(),
      subtitle: item.subtitle.trim(),
      dateRange: item.dateRange.trim(),
      description: item.description.trim(),
    }));

  const achievements = result.achievements
    .filter((item) => item.title.trim())
    .map((item) => ({
      title: item.title.trim(),
      subtitle: item.subtitle.trim(),
      dateRange: item.dateRange.trim(),
      description: item.description.trim(),
    }));

  const profile = {
    name: result.profile.name.trim(),
    headline: result.profile.headline.trim(),
    summary: result.profile.summary.trim(),
    email: result.profile.email.trim(),
    phone: result.profile.phone.trim(),
    location: result.profile.location.trim(),
    website: normalizeUrl(result.profile.website || ""),
    github: normalizeUrl(result.profile.github || ""),
    linkedin: normalizeUrl(result.profile.linkedin || ""),
  };

  return { profile, skills, experiences, projects, education, achievements };
}

function buildHeuristicResult(rawText: string) {
  const { intro, sections } = splitIntoSections(rawText);
  const profile = buildProfile(intro, rawText, sections.summary || "");
  const skills = parseSkills(sections.skills || "", rawText);
  const experiences = sections.experience
    ? parseExperienceBlocks(sections.experience, skills)
    : [];
  const projects = sections.projects ? parseProjectBlocks(sections.projects) : [];
  const education = sections.education ? parseEducationBlocks(sections.education) : [];
  const achievements = sections.achievements ? parseSimpleListItems(sections.achievements) : [];
  const suggestedSettings = buildSuggestedSettings({
    profile,
    skills,
    experiences,
    projects,
    education,
    achievements,
  });
  const notes = [
    skills.length ? "" : "No dedicated skills section was found, so the importer inferred skills from the resume text.",
    experiences.length ? "" : "No structured work-experience entries were confidently parsed.",
    projects.length ? "" : "No structured project entries were confidently parsed.",
    education.length ? "" : "No structured education entries were confidently parsed.",
    achievements.length ? "" : "No structured achievements or certifications were confidently parsed.",
  ].filter(Boolean);

  return resumeParsedDataSchema.parse({
    mode: "heuristic",
    notes,
    rawTextPreview: truncateText(rawText.replace(/\s+/g, " "), 1600),
    profile,
    skills,
    experiences,
    projects,
    education,
    achievements,
    suggestedSettings,
  });
}

export async function extractResumeText(file: File) {
  const name = file.name.toLowerCase();
  const buffer = Buffer.from(await file.arrayBuffer());

  if (file.type === "text/plain" || name.endsWith(".txt")) {
    return sanitizeText(buffer.toString("utf8"));
  }

  if (file.type === "application/pdf" || name.endsWith(".pdf")) {
    return extractPdfText(buffer);
  }

  if (
    file.type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    name.endsWith(".docx")
  ) {
    return extractDocxText(buffer);
  }

  throw new Error("Unsupported file type. Please upload a PDF, DOCX, or TXT resume.");
}

export async function parseResumeFile(
  file: File,
  options: ParseResumeOptions = {}
): Promise<ResumeParsedData> {
  const rawText = await extractResumeText(file);
  if (!rawText || rawText.length < 80) {
    throw new Error("The uploaded resume did not contain enough readable text to import.");
  }

  const heuristicResult = buildHeuristicResult(rawText);
  const requestedMode = options.mode || "auto";

  if (requestedMode === "manual") {
    return resumeParsedDataSchema.parse({
      ...heuristicResult,
      notes: ["Manual parsing mode used the built-in resume rules.", ...heuristicResult.notes],
    });
  }

  if (requestedMode === "ai" && !getAiProviderConfig()) {
    throw new Error(
      "AI parsing is not configured on the server. Add GROQ_API_KEY or OPENROUTER_API_KEY, or choose Manual."
    );
  }

  try {
    const aiResult = await tryAiExtraction(rawText, options.aiInstructions || "");
    if (!aiResult) {
      if (requestedMode === "ai") {
        throw new Error(
          "AI parsing could not produce a structured result. Try refining the AI instructions or switch to Manual."
        );
      }

      return heuristicResult;
    }

    const normalized = normalizeAiResult(aiResult.data);
    const mergedProfile = mergeProfile(heuristicResult.profile, normalized.profile);
    return resumeParsedDataSchema.parse({
      mode: "ai",
      notes: [
        `AI-assisted extraction used ${aiResult.provider} (${aiResult.model}).`,
        ...(options.aiInstructions?.trim()
          ? ["Custom AI extraction instructions were applied."]
          : []),
        ...heuristicResult.notes,
      ],
      rawTextPreview: heuristicResult.rawTextPreview,
      profile: mergedProfile,
      skills: normalized.skills.length ? normalized.skills : heuristicResult.skills,
      experiences: normalized.experiences.length
        ? normalized.experiences
        : heuristicResult.experiences,
      projects: normalized.projects.length ? normalized.projects : heuristicResult.projects,
      education: normalized.education.length ? normalized.education : heuristicResult.education,
      achievements: normalized.achievements.length
        ? normalized.achievements
        : heuristicResult.achievements,
      suggestedSettings: buildSuggestedSettings({
        profile: mergedProfile,
        skills: normalized.skills.length ? normalized.skills : heuristicResult.skills,
        experiences: normalized.experiences.length
          ? normalized.experiences
          : heuristicResult.experiences,
        projects: normalized.projects.length ? normalized.projects : heuristicResult.projects,
        education: normalized.education.length ? normalized.education : heuristicResult.education,
        achievements: normalized.achievements.length
          ? normalized.achievements
          : heuristicResult.achievements,
      }),
    });
  } catch (error) {
    if (requestedMode === "ai") {
      throw error instanceof Error
        ? error
        : new Error("AI parsing failed. Try Manual or verify the server AI configuration.");
    }

    return heuristicResult;
  }
}
