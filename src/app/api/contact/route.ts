import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Message from "@/models/Message";
import { contactSchema } from "@/lib/validations";
import { sendContactEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = contactSchema.parse(body);

    await connectDB();

    const message = await Message.create(validated);

    // Send email notification (non-blocking)
    sendContactEmail(validated).catch((err) =>
      console.error("Email send error:", err)
    );

    return NextResponse.json(
      {
        success: true,
        message: "Message sent successfully!",
        data: { id: message._id },
      },
      { status: 201 }
    );
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json(
        { success: false, error: error.errors[0].message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to send message" },
      { status: 500 }
    );
  }
}
