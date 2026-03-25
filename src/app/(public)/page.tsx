import { headers } from "next/headers";
import type { Metadata } from "next";
import ProductLandingPage from "@/components/public/ProductLandingPage";
import PortfolioHomeContent from "@/components/public/PortfolioHomeContent";
import { getHostWithoutPort, isLocalHostname } from "@/lib/portfolioUrl";
import {
  getPortfolioHomeMetadataByCustomDomain,
  getPortfolioHomePageDataByCustomDomain,
} from "@/lib/portfolioData";

function getRequestHost() {
  const headerStore = headers();
  return getHostWithoutPort(headerStore.get("x-forwarded-host") || headerStore.get("host"));
}

export async function generateMetadata(): Promise<Metadata> {
  const host = getRequestHost();

  if (!host || isLocalHostname(host)) {
    return {
      title: "Portfolio Builder",
      description:
        "A multi-user portfolio builder where each user gets their own slug, dashboard, and published portfolio.",
    };
  }

  return getPortfolioHomeMetadataByCustomDomain(host);
}

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const host = getRequestHost();

  if (!host || isLocalHostname(host)) {
    return <ProductLandingPage />;
  }

  const data = await getPortfolioHomePageDataByCustomDomain(host);
  if (!data) {
    return <ProductLandingPage />;
  }

  return <PortfolioHomeContent {...data} />;
}
