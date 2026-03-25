import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { getSessionUser } from "@/lib/session";
import Skill from "@/models/Skill";
import { skillSchema } from "@/lib/validations";

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const skills = await Skill.find({ userId: user.id })
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

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validated = skillSchema.parse(body);

    await connectDB();
    const skill = await Skill.create({ ...validated, userId: user.id });

    return NextResponse.json(
      { success: true, data: skill, message: "Skill added!" },
      { status: 201 }
    );
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json(
        { success: false, error: error.errors[0].message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to create skill" },
      { status: 500 }
    );
  }
}
