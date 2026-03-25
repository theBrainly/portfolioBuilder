import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { getPortfolioFromRequest } from "@/lib/portfolioUsers";
import Skill from "@/models/Skill";

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
    const skills = await Skill.find({ userId: portfolio.userId, isVisible: true })
      .sort({ order: 1, category: 1 })
      .lean();

    return NextResponse.json({ success: true, data: skills });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch skills" },
      { status: 500 }
    );
  }
}
