import { NextRequest, NextResponse } from "next/server";
import { getPortfolioFromRequest } from "@/lib/portfolioUsers";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const portfolio = await getPortfolioFromRequest({
      portfolioSlug: searchParams.get("portfolioSlug"),
      host: req.headers.get("x-forwarded-host") || req.headers.get("host"),
    });

    if (!portfolio?.settings) {
      return NextResponse.json(
        { success: false, error: "Portfolio not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: portfolio.settings });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}
