import { generateSlug } from "@/lib/utils";

type PortfolioSettingsLike = {
  brandName?: string | null;
  siteTitle?: string | null;
  customDomain?: string | null;
  portfolioSlug?: string | null;
};

const RESERVED_PORTFOLIO_SLUGS = new Set([
  "_next",
  "admin",
  "api",
  "favicon.ico",
  "login",
  "projects",
  "robots.txt",
  "sitemap.xml",
  "signup",
]);

function isIpv4Address(hostname: string) {
  return /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname);
}

export function isLocalHostname(hostname: string) {
  return hostname === "localhost" || hostname === "127.0.0.1";
}

export function getHostWithoutPort(hostname: string | null | undefined) {
  return String(hostname || "")
    .trim()
    .toLowerCase()
    .replace(/:\d+$/, "");
}

function getOriginFromUrl(value: string) {
  try {
    return new URL(value).origin;
  } catch {
    return null;
  }
}

export function normalizeCustomDomain(value: string | null | undefined) {
  const trimmed = String(value || "").trim().toLowerCase();
  if (!trimmed) return "";

  const withProtocol = /^[a-z]+:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;

  try {
    const url = new URL(withProtocol);
    return `${url.hostname}${url.port ? `:${url.port}` : ""}`;
  } catch {
    return trimmed.replace(/^[a-z]+:\/\//i, "").replace(/\/.*$/, "");
  }
}

export function isValidCustomDomain(value: string | null | undefined) {
  const normalized = normalizeCustomDomain(value);
  if (!normalized) return true;

  try {
    const url = new URL(`https://${normalized}`);
    const { hostname } = url;

    if (isLocalHostname(hostname) || isIpv4Address(hostname)) {
      return true;
    }

    return /^([a-z0-9-]+\.)+[a-z]{2,}$/i.test(hostname);
  } catch {
    return false;
  }
}

export function normalizePortfolioSlug(value: string | null | undefined) {
  return generateSlug(String(value || "")).slice(0, 60);
}

export function isReservedPortfolioSlug(value: string | null | undefined) {
  return RESERVED_PORTFOLIO_SLUGS.has(normalizePortfolioSlug(value));
}

export function getSuggestedPortfolioSlug(settings: PortfolioSettingsLike | null | undefined) {
  const candidate = settings?.brandName || settings?.siteTitle || "portfolio";
  const normalized = normalizePortfolioSlug(candidate);

  if (!normalized || isReservedPortfolioSlug(normalized)) {
    return "my-portfolio";
  }

  return normalized;
}

export function getActivePortfolioSlug(settings: PortfolioSettingsLike | null | undefined) {
  const normalized = normalizePortfolioSlug(settings?.portfolioSlug || "");

  if (!normalized || isReservedPortfolioSlug(normalized)) {
    return "";
  }

  return normalized;
}

export function hasCustomPortfolioDomain(settings: PortfolioSettingsLike | null | undefined) {
  return normalizeCustomDomain(settings?.customDomain || "") !== "";
}

export function usesSlugPortfolioPath(settings: PortfolioSettingsLike | null | undefined) {
  return !hasCustomPortfolioDomain(settings) && getActivePortfolioSlug(settings) !== "";
}

export function getPortfolioHomePath(settings: PortfolioSettingsLike | null | undefined) {
  const slug = getActivePortfolioSlug(settings);

  if (!hasCustomPortfolioDomain(settings) && slug) {
    return `/${slug}`;
  }

  return "/";
}

export function getPortfolioSectionHref(
  sectionId: string,
  settings: PortfolioSettingsLike | null | undefined
) {
  const homePath = getPortfolioHomePath(settings);
  return homePath === "/" ? `/#${sectionId}` : `${homePath}#${sectionId}`;
}

export function getPortfolioProjectPath(
  projectSlug: string,
  settings: PortfolioSettingsLike | null | undefined
) {
  const homePath = getPortfolioHomePath(settings);
  return homePath === "/"
    ? `/projects/${projectSlug}`
    : `${homePath}/projects/${projectSlug}`;
}

export function getBaseSiteOrigin(baseSiteUrl?: string | null) {
  const candidates = [
    baseSiteUrl,
    process.env.NEXT_PUBLIC_SITE_URL,
    typeof window !== "undefined" ? window.location.origin : null,
    "http://localhost:3000",
  ];

  for (const candidate of candidates) {
    if (!candidate) continue;
    const origin = getOriginFromUrl(candidate);
    if (origin) return origin;
  }

  return "http://localhost:3000";
}

function getCustomDomainOrigin(domain: string) {
  const protocol = isLocalHostname(domain.split(":")[0]) ? "http" : "https";
  return `${protocol}://${domain}`;
}

export function buildPortfolioAbsoluteUrl(
  path: string,
  settings: PortfolioSettingsLike | null | undefined,
  baseSiteUrl?: string | null
) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const customDomain = normalizeCustomDomain(settings?.customDomain || "");

  if (customDomain) {
    return `${getCustomDomainOrigin(customDomain)}${normalizedPath}`;
  }

  return `${getBaseSiteOrigin(baseSiteUrl)}${normalizedPath}`;
}

export function getPortfolioPublicUrl(
  settings: PortfolioSettingsLike | null | undefined,
  baseSiteUrl?: string | null
) {
  return buildPortfolioAbsoluteUrl(getPortfolioHomePath(settings), settings, baseSiteUrl);
}
