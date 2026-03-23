import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/db";
import User from "@/models/User";
import Settings from "@/models/Settings";

export async function GET() {
  try {
    await connectDB();

    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: "admin" });

    if (existingAdmin) {
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
    });

    // Create default settings
    const existingSettings = await Settings.findOne();
    if (!existingSettings) {
      await Settings.create({
        heroTitle: "Hi, I'm a Developer",
        heroSubtitle: "Full Stack Developer",
        heroDescription:
          "I build exceptional digital experiences that live on the internet. Specialized in React, Next.js, and Node.js.",
        heroCTA: "View My Work",
        aboutTitle: "About Me",
        aboutDescription:
          "I'm a passionate full-stack developer with experience building modern web applications. I love turning complex problems into simple, beautiful solutions.",
        yearsOfExperience: 0,
        totalProjects: 0,
        totalClients: 0,
        email: process.env.ADMIN_EMAIL || "admin@portfolio.com",
        siteTitle: "Developer Portfolio",
        siteDescription:
          "Full Stack Developer portfolio showcasing projects and experience",
      });
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
