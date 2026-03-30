import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { uploadImage } from "@/lib/cloudinary";
import { handleApiError, unauthorizedResponse, AppError } from "@/lib/apiError";

function sanitizeUploadFolder(value: string) {
  const sanitized = value
    .toLowerCase()
    .replace(/[^a-z0-9/_-]/g, "-")
    .replace(/\.+/g, "-")
    .replace(/\/{2,}/g, "/")
    .replace(/^\/+|\/+$/g, "");

  return sanitized ? sanitized.split("/").slice(0, 3).join("/") : "general";
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return unauthorizedResponse();

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const folder = sanitizeUploadFolder((formData.get("folder") as string) || "general");

    if (!file) {
      throw new AppError("No file provided", 400, "VALIDATION_ERROR");
    }

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!validTypes.includes(file.type)) {
      throw new AppError(
        "Invalid file type. Use JPEG, PNG, WebP, or GIF",
        400,
        "VALIDATION_ERROR"
      );
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      throw new AppError("File size must be less than 5MB", 400, "VALIDATION_ERROR");
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

    const result = await uploadImage(base64, folder);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    return handleApiError(error, "POST /api/admin/upload");
  }
}
