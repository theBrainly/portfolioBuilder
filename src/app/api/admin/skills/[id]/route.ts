import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { getSessionUser } from "@/lib/session";
import Skill from "@/models/Skill";
import { skillSchema } from "@/lib/validations";
import { handleApiError, unauthorizedResponse, notFoundResponse } from "@/lib/apiError";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getSessionUser();
    if (!user) return unauthorizedResponse();

    const body = await req.json();
    const validated = skillSchema.parse(body);

    await connectDB();
    const skill = await Skill.findOneAndUpdate({ _id: params.id, userId: user.id }, validated, {
      new: true,
      runValidators: true,
    });

    if (!skill) return notFoundResponse("Skill");

    return NextResponse.json({
      success: true,
      data: skill,
      message: "Skill updated!",
    });
  } catch (error) {
    return handleApiError(error, `PUT /api/admin/skills/${params.id}`);
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
    const skill = await Skill.findOneAndDelete({ _id: params.id, userId: user.id });

    if (!skill) return notFoundResponse("Skill");

    return NextResponse.json({ success: true, message: "Skill deleted!" });
  } catch (error) {
    return handleApiError(error, `DELETE /api/admin/skills/${params.id}`);
  }
}
