import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { getSessionUser } from "@/lib/session";
import Message from "@/models/Message";
import { handleApiError, unauthorizedResponse } from "@/lib/apiError";

const MESSAGE_FILTERS = new Set(["all", "unread", "starred"]);

function parsePositiveInteger(value: string | null, fallback: number, max: number) {
  const parsed = Number.parseInt(value || "", 10);

  if (!Number.isFinite(parsed) || parsed < 1) {
    return fallback;
  }

  return Math.min(parsed, max);
}

export async function GET(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) return unauthorizedResponse();

    await connectDB();

    const { searchParams } = new URL(req.url);
    const filter = searchParams.get("filter")?.trim() || "all";
    const normalizedFilter = MESSAGE_FILTERS.has(filter) ? filter : "all";
    const page = parsePositiveInteger(searchParams.get("page"), 1, 10000);
    const limit = parsePositiveInteger(searchParams.get("limit"), 20, 100);

    const query: any = { userId: user.id };
    if (normalizedFilter === "unread") query.isRead = false;
    if (normalizedFilter === "starred") query.isStarred = true;

    const total = await Message.countDocuments(query);
    const messages = await Message.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return NextResponse.json({
      success: true,
      data: messages,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return handleApiError(error, "GET /api/admin/messages");
  }
}
