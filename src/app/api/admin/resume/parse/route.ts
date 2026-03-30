import { NextRequest, NextResponse } from "next/server";
import { AppError, handleApiError, unauthorizedResponse } from "@/lib/apiError";
import { parseResumeFile, RESUME_PARSE_MODES } from "@/lib/resumeImport";
import { getSessionUser } from "@/lib/session";

export const runtime = "nodejs";

const supportedResumeTypes = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
];

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) return unauthorizedResponse();

    const formData = await req.formData();
    const file = formData.get("file");
    const requestedMode = formData.get("mode");
    const aiInstructions = formData.get("aiInstructions");

    if (!(file instanceof File)) {
      throw new AppError("Please choose a resume file to import.", 400, "VALIDATION_ERROR");
    }

    const mode =
      typeof requestedMode === "string" &&
      (RESUME_PARSE_MODES as readonly string[]).includes(requestedMode)
        ? (requestedMode as (typeof RESUME_PARSE_MODES)[number])
        : "auto";

    const lowerName = file.name.toLowerCase();
    const validExtension =
      lowerName.endsWith(".pdf") || lowerName.endsWith(".docx") || lowerName.endsWith(".txt");
    const validType = supportedResumeTypes.includes(file.type);

    if (!validExtension && !validType) {
      throw new AppError(
        "Unsupported file type. Upload a PDF, DOCX, or TXT resume.",
        400,
        "VALIDATION_ERROR"
      );
    }

    if (file.size > 8 * 1024 * 1024) {
      throw new AppError("Resume file size must be under 8MB.", 400, "VALIDATION_ERROR");
    }

    const parsed = await parseResumeFile(file, {
      mode,
      aiInstructions: typeof aiInstructions === "string" ? aiInstructions : "",
    });

    return NextResponse.json({
      success: true,
      data: parsed,
    });
  } catch (error) {
    return handleApiError(error, "POST /api/admin/resume/parse");
  }
}
