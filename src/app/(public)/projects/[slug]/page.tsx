import { headers } from "next/headers";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import PortfolioProjectContent from "@/components/public/PortfolioProjectContent";
import {
  getPortfolioProjectMetadataByCustomDomain,
  getPortfolioProjectPageDataByCustomDomain,
} from "@/lib/portfolioData";
import { getHostWithoutPort, isLocalHostname } from "@/lib/portfolioUrl";

function getRequestHost() {
  const headerStore = headers();
  return getHostWithoutPort(headerStore.get("x-forwarded-host") || headerStore.get("host"));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const host = getRequestHost();
  if (!host || isLocalHostname(host)) {
    return { title: "Not Found" };
  }

  return getPortfolioProjectMetadataByCustomDomain(host, params.slug);
}

export const dynamic = "force-dynamic";

export default async function ProjectPage({
  params,
}: {
  params: { slug: string };
}) {
  const host = getRequestHost();
  if (!host || isLocalHostname(host)) {
    notFound();
  }

  const data = await getPortfolioProjectPageDataByCustomDomain(host, params.slug);
  if (!data) {
    notFound();
  }

  return <PortfolioProjectContent {...data} />;
}
