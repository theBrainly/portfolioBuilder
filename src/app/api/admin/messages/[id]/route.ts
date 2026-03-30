import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import connectDB from "@/lib/db";
import { getSessionUser } from "@/lib/session";
import Message from "@/models/Message";
import { handleApiError, unauthorizedResponse, notFoundResponse } from "@/lib/apiError";

const messageUpdateSchema = z
  .object({
    isRead: z.boolean().optional(),
    isStarred: z.boolean().optional(),
    repliedAt: z.union([z.string().datetime(), z.null()]).optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: "Provide at least one message field to update",
  });

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getSessionUser();
    if (!user) return unauthorizedResponse();

    const body = await req.json();
    const validated = messageUpdateSchema.parse(body);
    const updatePayload: Record<string, unknown> = {
      ...(validated.isRead !== undefined ? { isRead: validated.isRead } : {}),
      ...(validated.isStarred !== undefined ? { isStarred: validated.isStarred } : {}),
    };

    if (validated.repliedAt !== undefined) {
      updatePayload.repliedAt = validated.repliedAt ? new Date(validated.repliedAt) : null;
    }

    await connectDB();
    const message = await Message.findOneAndUpdate(
      { _id: params.id, userId: user.id },
      { $set: updatePayload },
      { new: true, runValidators: true }
    );

    if (!message) return notFoundResponse("Message");

    return NextResponse.json({ success: true, data: message });
  } catch (error) {
    return handleApiError(error, `PUT /api/admin/messages/${params.id}`);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getSessionUser();
    if (!user) return unauthorizedResponse();

    await connectDB();
    const message = await Message.findOneAndDelete({ _id: params.id, userId: user.id });

    if (!message) return notFoundResponse("Message");

    return NextResponse.json({ success: true, message: "Message deleted!" });
  } catch (error) {
    return handleApiError(error, `DELETE /api/admin/messages/${params.id}`);
  }
}
