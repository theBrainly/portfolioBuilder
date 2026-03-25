import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { getPortfolioFromRequest } from "@/lib/portfolioUsers";
import Project from "@/models/Project";

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const portfolio = await getPortfolioFromRequest({
      portfolioSlug: new URL(req.url).searchParams.get("portfolioSlug"),
      host: req.headers.get("x-forwarded-host") || req.headers.get("host"),
    });

    if (!portfolio) {
      return NextResponse.json(
        { success: false, error: "Portfolio not found" },
        { status: 404 }
      );
    }

    await connectDB();

    const project = await Project.findOne({
      userId: portfolio.userId,
      slug: params.slug,
      isVisible: true,
    }).lean();

    if (!project) {
      return NextResponse.json(
        { success: false, error: "Project not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: project });
  } catch (error) {
    console.error("GET /api/projects/[slug] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch project" },
      { status: 500 }
    );
  }
}
