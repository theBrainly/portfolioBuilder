import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { ensureCustomDomainAvailable, ensurePortfolioSlugAvailable, getOrCreateUserSettings } from "@/lib/portfolioUsers";
import { getSessionUser } from "@/lib/session";
import Settings from "@/models/Settings";
import User from "@/models/User";
import { settingsSchema } from "@/lib/validations";
import { normalizeSiteSettings } from "@/lib/siteSettings";

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      data: await getOrCreateUserSettings(user),
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validated = settingsSchema.parse(body);

    const portfolioSlug = await ensurePortfolioSlugAvailable(validated.portfolioSlug, user.id);
    const customDomain = await ensureCustomDomainAvailable(validated.customDomain, user.id);

    await connectDB();
    let settings = await Settings.findOne({ userId: user.id });

    const payload = {
      ...validated,
      customDomain,
      portfolioSlug,
      userId: user.id,
    };

    if (!settings) {
      settings = await Settings.create(payload);
    } else {
      settings = await Settings.findByIdAndUpdate(settings._id, payload, {
        new: true,
        runValidators: true,
      });
    }

    await User.findByIdAndUpdate(user.id, { portfolioSlug });

    return NextResponse.json({
      success: true,
      data: normalizeSiteSettings(JSON.parse(JSON.stringify(settings))),
      message: "Settings updated!",
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
      { success: false, error: "Failed to update settings" },
      { status: 500 }
    );
  }
}
