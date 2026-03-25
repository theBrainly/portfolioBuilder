import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { getSessionUser } from "@/lib/session";
import Project from "@/models/Project";
import Experience from "@/models/Experience";
import Skill from "@/models/Skill";
import Testimonial from "@/models/Testimonial";
import Message from "@/models/Message";

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) {
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
      Project.countDocuments({ userId: user.id }),
      Experience.countDocuments({ userId: user.id }),
      Skill.countDocuments({ userId: user.id }),
      Testimonial.countDocuments({ userId: user.id }),
      Message.countDocuments({ userId: user.id }),
      Message.countDocuments({ userId: user.id, isRead: false }),
      Message.find({ userId: user.id }).sort({ createdAt: -1 }).limit(5).lean(),
      Project.find({ userId: user.id }).sort({ createdAt: -1 }).limit(5).lean(),
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
