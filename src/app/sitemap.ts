import { MetadataRoute } from "next";
import connectDB from "@/lib/db";
import { buildPortfolioAbsoluteUrl, getPortfolioProjectPath, getPortfolioPublicUrl } from "@/lib/portfolioUrl";
import Project from "@/models/Project";
import Settings from "@/models/Settings";

type SitemapSettingsLike = {
  userId: string;
  portfolioSlug?: string;
  customDomain?: string;
  updatedAt?: Date;
};

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await connectDB();

  const [settingsDocs, projectDocs] = await Promise.all([
    Settings.find({ portfolioSlug: { $exists: true, $ne: "" } })
      .select("userId portfolioSlug customDomain updatedAt")
      .lean(),
    Project.find({ isVisible: true }).select("userId slug updatedAt").lean(),
  ]);

  const settingsByUserId = new Map(
    settingsDocs.map((settings) => [
      String(settings.userId),
      settings as unknown as SitemapSettingsLike,
    ])
  );

  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const urls: MetadataRoute.Sitemap = [
    {
      url: base,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];

  for (const settings of settingsDocs) {
    const settingEntry = settings as unknown as SitemapSettingsLike;
    urls.push({
      url: getPortfolioPublicUrl(settingEntry, base),
      lastModified: settingEntry.updatedAt || new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    });
  }

  for (const project of projectDocs) {
    const settings = settingsByUserId.get(String(project.userId));
    if (!settings) continue;

    urls.push({
      url: buildPortfolioAbsoluteUrl(
        getPortfolioProjectPath(project.slug, settings),
        settings,
        base
      ),
      lastModified: project.updatedAt || new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    });
  }

  return urls;
}
