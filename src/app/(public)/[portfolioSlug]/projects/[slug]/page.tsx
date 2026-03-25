import { notFound } from "next/navigation";
import type { Metadata } from "next";
import PortfolioProjectContent from "@/components/public/PortfolioProjectContent";
import {
  getPortfolioProjectMetadata,
  getPortfolioProjectPageData,
} from "@/lib/portfolioData";

export async function generateMetadata({
  params,
}: {
  params: { portfolioSlug: string; slug: string };
}): Promise<Metadata> {
  return getPortfolioProjectMetadata(params.portfolioSlug, params.slug);
}

export const dynamic = "force-dynamic";

export default async function SlugProjectPage({
  params,
}: {
  params: { portfolioSlug: string; slug: string };
}) {
  const data = await getPortfolioProjectPageData(params.portfolioSlug, params.slug);
  if (!data) {
    notFound();
  }

  return <PortfolioProjectContent {...data} />;
}
