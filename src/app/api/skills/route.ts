import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Skill from "@/models/Skill";

export async function GET() {
  try {
    await connectDB();
    const skills = await Skill.find({ isVisible: true })
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
