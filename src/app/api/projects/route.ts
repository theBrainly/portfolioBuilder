import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Project from "@/models/Project";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");
    const limit = parseInt(searchParams.get("limit") || "0");

    const filter: any = { isVisible: true };
    if (category && category !== "All") filter.category = category;
    if (featured === "true") filter.isFeatured = true;

    let query = Project.find(filter).sort({ order: 1, createdAt: -1 });
    if (limit > 0) query = query.limit(limit);

    const projects = await query.lean();

    return NextResponse.json({ success: true, data: projects });
  } catch (error) {
    console.error("GET /api/projects error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}
