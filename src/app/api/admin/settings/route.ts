import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import Settings from "@/models/Settings";
import { settingsSchema } from "@/lib/validations";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    let settings = await Settings.findOne().lean();
    if (!settings) {
      const created = await Settings.create({});
      settings = created.toObject();
    }

    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validated = settingsSchema.parse(body);

    await connectDB();
    let settings = await Settings.findOne();

    if (!settings) {
      settings = await Settings.create(validated);
    } else {
      settings = await Settings.findByIdAndUpdate(settings._id, validated, {
        new: true,
        runValidators: true,
      });
    }

    return NextResponse.json({
      success: true,
      data: settings,
      message: "Settings updated!",
    });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json(
        { success: false, error: error.errors[0].message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to update settings" },
      { status: 500 }
    );
  }
}
