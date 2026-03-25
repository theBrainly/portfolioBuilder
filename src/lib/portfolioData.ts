import type { Metadata } from "next";
import connectDB from "@/lib/db";
import {
  buildPortfolioAbsoluteUrl,
  getPortfolioProjectPath,
  getPortfolioPublicUrl,
} from "@/lib/portfolioUrl";
import { getPortfolioByCustomDomain, getPortfolioBySlug } from "@/lib/portfolioUsers";
import Experience from "@/models/Experience";
import Project from "@/models/Project";
import Skill from "@/models/Skill";
import Testimonial from "@/models/Testimonial";
import type {
  IExperience,
  IProject,
  ISiteSettings,
  ISkill,
  ITestimonial,
} from "@/types";

type PortfolioLookup = {
  settings: ISiteSettings | null;
  userId: string;
};

type PortfolioHomePageData = {
  projects: IProject[];
  experiences: IExperience[];
  skills: ISkill[];
  testimonials: ITestimonial[];
  settings: ISiteSettings;
};

type PortfolioProjectPageData = {
  project: IProject;
  related: IProject[];
  settings: ISiteSettings;
};

function toPlainObject<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

async function getHomePageDataForPortfolio(portfolio: PortfolioLookup | null) {
  if (!portfolio?.settings) return null;

  await connectDB();

  const [projects, experiences, skills, testimonials] = await Promise.all([
    Project.find({ userId: portfolio.userId, isVisible: true })
      .sort({ order: 1, createdAt: -1 })
      .lean(),
    Experience.find({ userId: portfolio.userId, isVisible: true })
      .sort({ order: 1, startDate: -1 })
      .lean(),
    Skill.find({ userId: portfolio.userId, isVisible: true })
      .sort({ order: 1, category: 1 })
      .lean(),
    Testimonial.find({ userId: portfolio.userId, isVisible: true })
      .sort({ order: 1, createdAt: -1 })
      .lean(),
  ]);

  return {
    projects: toPlainObject(projects) as unknown as IProject[],
    experiences: toPlainObject(experiences) as unknown as IExperience[],
    skills: toPlainObject(skills) as unknown as ISkill[],
    testimonials: toPlainObject(testimonials) as unknown as ITestimonial[],
    settings: portfolio.settings,
  } satisfies PortfolioHomePageData;
}

async function getProjectPageDataForPortfolio(
  portfolio: PortfolioLookup | null,
  projectSlug: string
) {
  if (!portfolio?.settings) return null;

  await connectDB();

  const project = await Project.findOne({
    userId: portfolio.userId,
    slug: projectSlug,
    isVisible: true,
  }).lean();

  if (!project) return null;

  const plainProject = toPlainObject(project) as unknown as IProject;
  const related = await Project.find({
    userId: portfolio.userId,
    isVisible: true,
    category: plainProject.category,
    slug: { $ne: plainProject.slug },
  })
    .limit(3)
    .sort({ createdAt: -1 })
    .lean();

  return {
    project: plainProject,
    related: toPlainObject(related) as unknown as IProject[],
    settings: portfolio.settings,
  } satisfies PortfolioProjectPageData;
}

function buildHomeMetadata(settings: ISiteSettings): Metadata {
  const title = settings.siteTitle || "Portfolio";
  const description = settings.siteDescription || "Full Stack Developer Portfolio";
  const canonical = getPortfolioPublicUrl(settings, process.env.NEXT_PUBLIC_SITE_URL);

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      images: settings.ogImage ? [settings.ogImage] : [],
    },
  };
}

function buildProjectMetadata(settings: ISiteSettings, project: IProject): Metadata {
  const canonicalPath = getPortfolioProjectPath(project.slug, settings);
  const canonical = buildPortfolioAbsoluteUrl(
    canonicalPath,
    settings,
    process.env.NEXT_PUBLIC_SITE_URL
  );

  return {
    title: project.title,
    description: project.shortDescription,
    alternates: {
      canonical,
    },
    openGraph: {
      title: project.title,
      description: project.shortDescription,
      url: canonical,
      images: project.thumbnail ? [project.thumbnail] : [],
    },
  };
}

export async function getPortfolioHomePageData(portfolioSlug: string) {
  return getHomePageDataForPortfolio(await getPortfolioBySlug(portfolioSlug));
}

export async function getPortfolioHomePageDataByCustomDomain(customDomain: string) {
  return getHomePageDataForPortfolio(await getPortfolioByCustomDomain(customDomain));
}

export async function getPortfolioProjectPageData(portfolioSlug: string, projectSlug: string) {
  return getProjectPageDataForPortfolio(await getPortfolioBySlug(portfolioSlug), projectSlug);
}

export async function getPortfolioProjectPageDataByCustomDomain(
  customDomain: string,
  projectSlug: string
) {
  return getProjectPageDataForPortfolio(
    await getPortfolioByCustomDomain(customDomain),
    projectSlug
  );
}

export async function getPortfolioHomeMetadata(portfolioSlug: string): Promise<Metadata> {
  const data = await getPortfolioHomePageData(portfolioSlug);
  if (!data) return { title: "Not Found" };
  return buildHomeMetadata(data.settings);
}

export async function getPortfolioHomeMetadataByCustomDomain(
  customDomain: string
): Promise<Metadata> {
  const data = await getPortfolioHomePageDataByCustomDomain(customDomain);
  if (!data) return { title: "Build Your Portfolio" };
  return buildHomeMetadata(data.settings);
}

export async function getPortfolioProjectMetadata(
  portfolioSlug: string,
  projectSlug: string
): Promise<Metadata> {
  const data = await getPortfolioProjectPageData(portfolioSlug, projectSlug);
  if (!data) return { title: "Not Found" };
  return buildProjectMetadata(data.settings, data.project);
}

export async function getPortfolioProjectMetadataByCustomDomain(
  customDomain: string,
  projectSlug: string
): Promise<Metadata> {
  const data = await getPortfolioProjectPageDataByCustomDomain(customDomain, projectSlug);
  if (!data) return { title: "Not Found" };
  return buildProjectMetadata(data.settings, data.project);
}
