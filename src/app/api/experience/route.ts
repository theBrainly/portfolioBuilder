import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Experience from "@/models/Experience";

export async function GET() {
  try {
    await connectDB();
    const experiences = await Experience.find({ isVisible: true })
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
