import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { ensureCustomDomainAvailable, ensurePortfolioSlugAvailable, getOrCreateUserSettings } from "@/lib/portfolioUsers";
import { getSessionUser } from "@/lib/session";
import Settings from "@/models/Settings";
import User from "@/models/User";
import { settingsSchema } from "@/lib/validations";
import { normalizeSiteSettings } from "@/lib/siteSettings";
import { AppError, handleApiError, unauthorizedResponse } from "@/lib/apiError";
import {
  assertAllowedDesignPreset,
  assertAllowedThemePalette,
  getEffectiveSubscriptionForUser,
} from "@/lib/subscription";
import { PLANS } from "@/constants/plans";

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) return unauthorizedResponse();

    return NextResponse.json({
      success: true,
      data: await getOrCreateUserSettings(user),
    });
  } catch (error) {
    return handleApiError(error, "GET /api/admin/settings");
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) return unauthorizedResponse();

    const body = await req.json();
    const validated = settingsSchema.parse(body);
    const subscription = await getEffectiveSubscriptionForUser(user.id);

    if (validated.customDomain && !PLANS[subscription.plan].features.customDomain) {
      throw new AppError(
        "Custom domains are available on the Pro plan only.",
        403,
        "FORBIDDEN"
      );
    }

    assertAllowedThemePalette(subscription.plan, validated.themePalette);
    assertAllowedDesignPreset(subscription.plan, validated.designPreset);

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
  } catch (error) {
    return handleApiError(error, "PUT /api/admin/settings");
  }
}
