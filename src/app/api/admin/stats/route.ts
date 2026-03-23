import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import Project from "@/models/Project";
import Experience from "@/models/Experience";
import Skill from "@/models/Skill";
import Testimonial from "@/models/Testimonial";
import Message from "@/models/Message";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const [
      totalProjects,
      totalExperience,
      totalSkills,
      totalTestimonials,
      totalMessages,
      unreadMessages,
      recentMessages,
      recentProjects,
    ] = await Promise.all([
      Project.countDocuments(),
      Experience.countDocuments(),
      Skill.countDocuments(),
      Testimonial.countDocuments(),
      Message.countDocuments(),
      Message.countDocuments({ isRead: false }),
      Message.find().sort({ createdAt: -1 }).limit(5).lean(),
      Project.find().sort({ createdAt: -1 }).limit(5).lean(),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        totalProjects,
        totalExperience,
        totalSkills,
        totalTestimonials,
        totalMessages,
        unreadMessages,
        recentMessages,
        recentProjects,
      },
    });
  } catch (error) {
    console.error("Stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
