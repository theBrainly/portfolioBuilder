import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { getSessionUser } from "@/lib/session";
import Experience from "@/models/Experience";
import { experienceSchema } from "@/lib/validations";
import { handleApiError, unauthorizedResponse } from "@/lib/apiError";
import { assertPlanLimit, getEffectiveSubscriptionForUser } from "@/lib/subscription";

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) return unauthorizedResponse();

    await connectDB();
    const experiences = await Experience.find({ userId: user.id })
      .sort({ order: 1, startDate: -1 })
      .lean();

    return NextResponse.json({ success: true, data: experiences });
  } catch (error) {
    return handleApiError(error, "GET /api/admin/experience");
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) return unauthorizedResponse();

    const body = await req.json();
    const validated = experienceSchema.parse(body);

    await connectDB();
    const [subscription, totalExperience] = await Promise.all([
      getEffectiveSubscriptionForUser(user.id, { ensureRecord: true }),
      Experience.countDocuments({ userId: user.id }),
    ]);

    assertPlanLimit(subscription.plan, "maxExperience", totalExperience, "experience entries");
    const experience = await Experience.create({ ...validated, userId: user.id });

    return NextResponse.json(
      { success: true, data: experience, message: "Experience added!" },
      { status: 201 }
    );
  } catch (error) {
    return handleApiError(error, "POST /api/admin/experience");
  }
}
