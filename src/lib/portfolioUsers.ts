import connectDB from "@/lib/db";
import { normalizeSiteSettings } from "@/lib/siteSettings";
import {
  getHostWithoutPort,
  getSuggestedPortfolioSlug,
  isLocalHostname,
  isReservedPortfolioSlug,
  normalizeCustomDomain,
  normalizePortfolioSlug,
} from "@/lib/portfolioUrl";
import { getInitials } from "@/lib/utils";
import Settings from "@/models/Settings";
import User from "@/models/User";
import type { SessionUserContext } from "@/lib/session";
import type { ISiteSettings } from "@/types";

function toPlainObject<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

type UserSeedLike = {
  id: string;
  name?: string | null;
  email?: string | null;
  portfolioSlug?: string | null;
};

export function getDefaultPortfolioSlug(user: {
  name?: string | null;
  email?: string | null;
}) {
  const suggested = getSuggestedPortfolioSlug({
    brandName: user.name || undefined,
    siteTitle: user.email ? user.email.split("@")[0] : undefined,
  });

  if (!suggested || isReservedPortfolioSlug(suggested)) {
    return "my-portfolio";
  }

  return suggested;
}

export function buildDefaultSettingsData(user: UserSeedLike) {
  const name = (user.name || "Your Name").trim() || "Your Name";
  const portfolioSlug = normalizePortfolioSlug(user.portfolioSlug) || getDefaultPortfolioSlug(user);

  return {
    userId: user.id,
    portfolioSlug,
    heroTitle: `Hi, I'm ${name}`,
    heroSubtitle: "Full Stack Developer",
    heroDescription:
      "I build thoughtful digital products with clean interfaces, strong engineering, and a focus on real results.",
    heroCTA: "View My Work",
    aboutTitle: "About Me",
    aboutDescription:
      "Use this space to introduce your background, the kinds of products you build, and the value you bring to clients or teams.",
    yearsOfExperience: 0,
    totalProjects: 0,
    totalClients: 0,
    email: user.email || "",
    siteTitle: `${name} | Portfolio`,
    siteDescription: `${name}'s portfolio featuring projects, experience, and skills.`,
    brandName: name,
    brandMark: getInitials(name).slice(0, 3) || "P",
  };
}

export async function ensurePortfolioSlugAvailable(
  portfolioSlugInput: string,
  excludeUserId?: string
) {
  const portfolioSlug = normalizePortfolioSlug(portfolioSlugInput);

  if (!portfolioSlug || isReservedPortfolioSlug(portfolioSlug)) {
    throw new Error("Choose a different portfolio slug");
  }

  await connectDB();

  const query: Record<string, unknown> = { portfolioSlug };
  if (excludeUserId) {
    query._id = { $ne: excludeUserId };
  }

  const existingUser = await User.findOne(query).select("_id").lean();
  if (existingUser) {
    throw new Error("This portfolio slug is already taken");
  }

  return portfolioSlug;
}

export async function ensureCustomDomainAvailable(customDomainInput: string, excludeUserId?: string) {
  const customDomain = normalizeCustomDomain(customDomainInput);
  if (!customDomain) return "";

  await connectDB();

  const query: Record<string, unknown> = { customDomain };
  if (excludeUserId) {
    query.userId = { $ne: excludeUserId };
  }

  const existingSettings = await Settings.findOne(query).select("_id").lean();
  if (existingSettings) {
    throw new Error("This custom domain is already connected to another user");
  }

  return customDomain;
}

function normalizeSettingsRecord(settings: unknown): ISiteSettings | null {
  if (!settings) return null;
  return normalizeSiteSettings(
    toPlainObject(settings) as Record<string, unknown>
  ) as unknown as ISiteSettings;
}

export async function getOrCreateUserSettings(user: SessionUserContext) {
  await connectDB();

  let settings = await Settings.findOne({ userId: user.id }).lean();
  if (!settings) {
    const created = await Settings.create(buildDefaultSettingsData(user));
    settings = created.toObject();
  }

  return normalizeSettingsRecord({
    ...settings,
    portfolioSlug:
      normalizePortfolioSlug((settings as Record<string, unknown>)?.portfolioSlug as string) ||
      normalizePortfolioSlug(user.portfolioSlug),
    email:
      (settings as Record<string, unknown>)?.email ||
      user.email ||
      "",
    brandName:
      (settings as Record<string, unknown>)?.brandName ||
      user.name ||
      "Portfolio",
  });
}

export async function getPortfolioBySlug(portfolioSlugInput: string) {
  const portfolioSlug = normalizePortfolioSlug(portfolioSlugInput);
  if (!portfolioSlug || isReservedPortfolioSlug(portfolioSlug)) return null;

  await connectDB();

  const settings = await Settings.findOne({ portfolioSlug }).lean();
  if (!settings) return null;

  return {
    userId: String((settings as Record<string, unknown>).userId),
    settings: normalizeSettingsRecord(settings),
  };
}

export async function getPortfolioByCustomDomain(customDomainInput: string) {
  const customDomain = normalizeCustomDomain(customDomainInput);
  if (!customDomain) return null;

  await connectDB();

  const settings = await Settings.findOne({ customDomain }).lean();
  if (!settings) return null;

  return {
    userId: String((settings as Record<string, unknown>).userId),
    settings: normalizeSettingsRecord(settings),
  };
}

export async function getPortfolioFromRequest(params: {
  portfolioSlug?: string | null;
  host?: string | null;
}) {
  if (params.portfolioSlug) {
    return getPortfolioBySlug(params.portfolioSlug);
  }

  const host = getHostWithoutPort(params.host);
  if (!host || isLocalHostname(host)) {
    return null;
  }

  return getPortfolioByCustomDomain(host);
}
