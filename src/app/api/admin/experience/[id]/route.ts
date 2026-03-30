import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { getSessionUser } from "@/lib/session";
import Experience from "@/models/Experience";
import { experienceSchema } from "@/lib/validations";
import { handleApiError, unauthorizedResponse, notFoundResponse } from "@/lib/apiError";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getSessionUser();
    if (!user) return unauthorizedResponse();

    const body = await req.json();
    const validated = experienceSchema.parse(body);

    await connectDB();
    const experience = await Experience.findOneAndUpdate(
      { _id: params.id, userId: user.id },
      validated,
      { new: true, runValidators: true }
    );

    if (!experience) return notFoundResponse("Experience");

    return NextResponse.json({
      success: true,
      data: experience,
      message: "Experience updated!",
    });
  } catch (error) {
    return handleApiError(error, `PUT /api/admin/experience/${params.id}`);
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
    const experience = await Experience.findOneAndDelete({
      _id: params.id,
      userId: user.id,
    });

    if (!experience) return notFoundResponse("Experience");

    return NextResponse.json({
      success: true,
      message: "Experience deleted!",
    });
  } catch (error) {
    return handleApiError(error, `DELETE /api/admin/experience/${params.id}`);
  }
}
