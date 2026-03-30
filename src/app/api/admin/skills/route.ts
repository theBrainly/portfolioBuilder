import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { getSessionUser } from "@/lib/session";
import Skill from "@/models/Skill";
import { skillSchema } from "@/lib/validations";
import { handleApiError, unauthorizedResponse } from "@/lib/apiError";
import { assertPlanLimit, getEffectiveSubscriptionForUser } from "@/lib/subscription";

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) return unauthorizedResponse();

    await connectDB();
    const skills = await Skill.find({ userId: user.id })
      .sort({ order: 1, category: 1 })
      .lean();

    return NextResponse.json({ success: true, data: skills });
  } catch (error) {
    return handleApiError(error, "GET /api/admin/skills");
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) return unauthorizedResponse();

    const body = await req.json();
    const validated = skillSchema.parse(body);

    await connectDB();
    const [subscription, totalSkills] = await Promise.all([
      getEffectiveSubscriptionForUser(user.id, { ensureRecord: true }),
      Skill.countDocuments({ userId: user.id }),
    ]);

    assertPlanLimit(subscription.plan, "maxSkills", totalSkills, "skills");
    const skill = await Skill.create({ ...validated, userId: user.id });

    return NextResponse.json(
      { success: true, data: skill, message: "Skill added!" },
      { status: 201 }
    );
  } catch (error) {
    return handleApiError(error, "POST /api/admin/skills");
  }
}
