import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { getSessionUser } from "@/lib/session";
import Project from "@/models/Project";
import { projectSchema } from "@/lib/validations";
import { generateSlug } from "@/lib/utils";
import { handleApiError, unauthorizedResponse, notFoundResponse } from "@/lib/apiError";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getSessionUser();
    if (!user) return unauthorizedResponse();

    await connectDB();
    const project = await Project.findOne({ _id: params.id, userId: user.id }).lean();

    if (!project) return notFoundResponse("Project");

    return NextResponse.json({ success: true, data: project });
  } catch (error) {
    return handleApiError(error, `GET /api/admin/projects/${params.id}`);
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getSessionUser();
    if (!user) return unauthorizedResponse();

    const body = await req.json();
    const validated = projectSchema.parse(body);

    await connectDB();

    const existing = await Project.findOne({ _id: params.id, userId: user.id });
    if (!existing) return notFoundResponse("Project");

    // Update slug if title changed
    let slug = existing.slug;
    if (validated.title !== existing.title) {
      slug = generateSlug(validated.title);
      const slugExists = await Project.findOne({
        userId: user.id,
        slug,
        _id: { $ne: params.id },
      });
      if (slugExists) slug = `${slug}-${Date.now()}`;
    }

    const project = await Project.findOneAndUpdate(
      { _id: params.id, userId: user.id },
      { ...validated, slug },
      { new: true, runValidators: true }
    );

    return NextResponse.json({
      success: true,
      data: project,
      message: "Project updated!",
    });
  } catch (error) {
    return handleApiError(error, `PUT /api/admin/projects/${params.id}`);
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

    const project = await Project.findOneAndDelete({ _id: params.id, userId: user.id });
    if (!project) return notFoundResponse("Project");

    return NextResponse.json({
      success: true,
      message: "Project deleted!",
    });
  } catch (error) {
    return handleApiError(error, `DELETE /api/admin/projects/${params.id}`);
  }
}
