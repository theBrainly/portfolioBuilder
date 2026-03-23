import { MetadataRoute } from "next";
import connectDB from "@/lib/db";
import Project from "@/models/Project";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://yourdomain.com";
  await connectDB();
  const projects = await Project.find({ isVisible: true }).select("slug updatedAt").lean();
  return [
    { url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    ...projects.map((p) => ({ url: `${base}/projects/${p.slug}`, lastModified: p.updatedAt || new Date(), changeFrequency: "monthly" as const, priority: 0.8 })),
  ];
}
