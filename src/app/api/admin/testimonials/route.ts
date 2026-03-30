import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { getSessionUser } from "@/lib/session";
import Project from "@/models/Project";
import Testimonial from "@/models/Testimonial";
import { testimonialSchema } from "@/lib/validations";
import { AppError, handleApiError, unauthorizedResponse } from "@/lib/apiError";
import { assertPlanLimit, getEffectiveSubscriptionForUser } from "@/lib/subscription";

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) return unauthorizedResponse();

    await connectDB();
    const testimonials = await Testimonial.find({ userId: user.id })
      .sort({ order: 1, createdAt: -1 })
      .lean();

    return NextResponse.json({ success: true, data: testimonials });
  } catch (error) {
    return handleApiError(error, "GET /api/admin/testimonials");
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) return unauthorizedResponse();

    const body = await req.json();
    const validated = testimonialSchema.parse(body);
    const projectId = validated.projectId?.trim();

    await connectDB();
    const [subscription, totalTestimonials] = await Promise.all([
      getEffectiveSubscriptionForUser(user.id, { ensureRecord: true }),
      Testimonial.countDocuments({ userId: user.id }),
    ]);

    assertPlanLimit(
      subscription.plan,
      "maxTestimonials",
      totalTestimonials,
      "testimonials"
    );

    if (projectId) {
      const project = await Project.findOne({ _id: projectId, userId: user.id }).select("_id").lean();
      if (!project) {
        throw new AppError(
          "The selected project does not exist in your portfolio.",
          400,
          "VALIDATION_ERROR"
        );
      }
    }

    const testimonial = await Testimonial.create({
      ...validated,
      userId: user.id,
      projectId: projectId || null,
    });

    return NextResponse.json(
      { success: true, data: testimonial, message: "Testimonial added!" },
      { status: 201 }
    );
  } catch (error) {
    return handleApiError(error, "POST /api/admin/testimonials");
  }
}
