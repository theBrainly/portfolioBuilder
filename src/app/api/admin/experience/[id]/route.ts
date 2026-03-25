import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { getSessionUser } from "@/lib/session";
import Experience from "@/models/Experience";
import { experienceSchema } from "@/lib/validations";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validated = experienceSchema.parse(body);

    await connectDB();
    const experience = await Experience.findOneAndUpdate(
      { _id: params.id, userId: user.id },
      validated,
      { new: true, runValidators: true }
    );

    if (!experience) {
      return NextResponse.json(
        { success: false, error: "Experience not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: experience,
      message: "Experience updated!",
    });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json(
        { success: false, error: error.errors[0].message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to update experience" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const experience = await Experience.findOneAndDelete({
      _id: params.id,
      userId: user.id,
    });

    if (!experience) {
      return NextResponse.json(
        { success: false, error: "Experience not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Experience deleted!",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to delete experience" },
      { status: 500 }
    );
  }
}
