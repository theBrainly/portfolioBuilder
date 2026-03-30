import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/db";
import { buildDefaultSettingsData } from "@/lib/portfolioUsers";
import { AppError, handleApiError } from "@/lib/apiError";
import User from "@/models/User";
import Settings from "@/models/Settings";

function hasValidSeedSecret(req: NextRequest) {
  const configuredSecret = process.env.SEED_SECRET;

  if (!configuredSecret) {
    return process.env.NODE_ENV !== "production";
  }

  const providedSecret =
    req.headers.get("x-seed-secret") || req.nextUrl.searchParams.get("secret");

  return providedSecret === configuredSecret;
}

export async function GET(req: NextRequest) {
  try {
    if (!hasValidSeedSecret(req)) {
      throw new AppError(
        "Seeding is disabled. Provide a valid setup secret to continue.",
        403,
        "FORBIDDEN"
      );
    }

    await connectDB();

    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: "admin" });

    if (existingAdmin) {
      if (!existingAdmin.portfolioSlug) {
        existingAdmin.portfolioSlug = "demo-admin";
        await existingAdmin.save();
      }

      const existingSettings = await Settings.findOne({ userId: existingAdmin._id });
      if (!existingSettings) {
        await Settings.create(
          buildDefaultSettingsData({
            id: existingAdmin._id.toString(),
            name: existingAdmin.name,
            email: existingAdmin.email,
            portfolioSlug: existingAdmin.portfolioSlug,
          })
        );
      }

      return NextResponse.json({
        success: true,
        message: "Admin user already exists. Seed skipped.",
      });
    }

    if (
      process.env.NODE_ENV === "production" &&
      (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD)
    ) {
      throw new AppError(
        "ADMIN_EMAIL and ADMIN_PASSWORD must be configured before seeding production.",
        500,
        "INTERNAL_ERROR"
      );
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash(
      process.env.ADMIN_PASSWORD || "admin123",
      12
    );

    await User.create({
      email: process.env.ADMIN_EMAIL || "admin@portfolio.com",
      password: hashedPassword,
      name: "Admin",
      role: "admin",
      portfolioSlug: "demo-admin",
    });

    const adminUser = await User.findOne({
      email: process.env.ADMIN_EMAIL || "admin@portfolio.com",
    });

    // Create default settings
    const existingSettings = await Settings.findOne({ userId: adminUser?._id });
    if (!existingSettings) {
      await Settings.create(
        buildDefaultSettingsData({
          id: adminUser!._id.toString(),
          name: "Admin",
          email: process.env.ADMIN_EMAIL || "admin@portfolio.com",
          portfolioSlug: "demo-admin",
        })
      );
    }

    return NextResponse.json({
      success: true,
      message: "✅ Admin user and default settings created successfully!",
    });
  } catch (error) {
    return handleApiError(error, "GET /api/seed");
  }
}
