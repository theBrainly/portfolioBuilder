import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { getSessionUser } from "@/lib/session";
import Project from "@/models/Project";
import Testimonial from "@/models/Testimonial";
import { testimonialSchema } from "@/lib/validations";
import { AppError, handleApiError, unauthorizedResponse, notFoundResponse } from "@/lib/apiError";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getSessionUser();
    if (!user) return unauthorizedResponse();

    const body = await req.json();
    const validated = testimonialSchema.parse(body);
    const projectId = validated.projectId?.trim();

    await connectDB();
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

    const testimonial = await Testimonial.findOneAndUpdate(
      { _id: params.id, userId: user.id },
      { ...validated, projectId: projectId || null },
      { new: true, runValidators: true }
    );

    if (!testimonial) return notFoundResponse("Testimonial");

    return NextResponse.json({
      success: true,
      data: testimonial,
      message: "Testimonial updated!",
    });
  } catch (error) {
    return handleApiError(error, `PUT /api/admin/testimonials/${params.id}`);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getSessionUser();
    if (!user) return unauthorizedResponse();

    await connectDB();
    const testimonial = await Testimonial.findOneAndDelete({
      _id: params.id,
      userId: user.id,
    });

    if (!testimonial) return notFoundResponse("Testimonial");

    return NextResponse.json({
      success: true,
      message: "Testimonial deleted!",
    });
  } catch (error) {
    return handleApiError(error, `DELETE /api/admin/testimonials/${params.id}`);
  }
}
