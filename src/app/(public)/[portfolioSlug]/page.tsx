import { notFound } from "next/navigation";
import type { Metadata } from "next";
import PortfolioHomeContent from "@/components/public/PortfolioHomeContent";
import { getPortfolioHomeMetadata, getPortfolioHomePageData } from "@/lib/portfolioData";

export async function generateMetadata({
  params,
}: {
  params: { portfolioSlug: string };
}): Promise<Metadata> {
  return getPortfolioHomeMetadata(params.portfolioSlug);
}

export const dynamic = "force-dynamic";

export default async function SlugHomePage({
  params,
}: {
  params: { portfolioSlug: string };
}) {
  const data = await getPortfolioHomePageData(params.portfolioSlug);
  if (!data) {
    notFound();
  }

  return <PortfolioHomeContent {...data} />;
}
