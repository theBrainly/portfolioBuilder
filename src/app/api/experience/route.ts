import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { getPortfolioFromRequest } from "@/lib/portfolioUsers";
import Experience from "@/models/Experience";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const portfolio = await getPortfolioFromRequest({
      portfolioSlug: url.searchParams.get("portfolioSlug"),
      host: req.headers.get("x-forwarded-host") || req.headers.get("host"),
    });

    if (!portfolio) {
      return NextResponse.json(
        { success: false, error: "Portfolio not found" },
        { status: 404 }
      );
    }

    await connectDB();
    const experiences = await Experience.find({ userId: portfolio.userId, isVisible: true })
      .sort({ order: 1, startDate: -1 })
      .lean();

    return NextResponse.json({ success: true, data: experiences });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch experience" },
      { status: 500 }
    );
  }
}
