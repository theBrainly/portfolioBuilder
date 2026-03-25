import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/db";
import { buildDefaultSettingsData } from "@/lib/portfolioUsers";
import User from "@/models/User";
import Settings from "@/models/Settings";

export async function GET() {
  try {
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
        message: "Admin user already exists. Seed skipped.",
      });
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
      credentials: {
        email: process.env.ADMIN_EMAIL || "admin@portfolio.com",
        note: "Use the password from your .env ADMIN_PASSWORD",
      },
    });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json(
      { error: "Failed to seed database" },
      { status: 500 }
    );
  }
}
