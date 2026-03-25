import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/db";
import { buildDefaultSettingsData, ensurePortfolioSlugAvailable } from "@/lib/portfolioUsers";
import Settings from "@/models/Settings";
import User from "@/models/User";
import { signupSchema } from "@/lib/validations";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = signupSchema.parse(body);
    const portfolioSlug = await ensurePortfolioSlugAvailable(validated.portfolioSlug);

    await connectDB();

    const existingUser = await User.findOne({ email: validated.email }).lean();
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "An account with this email already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(validated.password, 12);
    const user = await User.create({
      email: validated.email,
      password: hashedPassword,
      name: validated.name,
      role: "user",
      portfolioSlug,
    });

    await Settings.create(
      buildDefaultSettingsData({
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        portfolioSlug,
      })
    );

    return NextResponse.json({
      success: true,
      data: {
        id: user._id.toString(),
        email: user.email,
        portfolioSlug,
      },
      message: "Account created successfully",
    });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json(
        { success: false, error: error.errors[0].message },
        { status: 400 }
      );
    }

    if (error instanceof Error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Failed to create account" },
      { status: 500 }
    );
  }
}
