import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { getSessionUser } from "@/lib/session";
import Testimonial from "@/models/Testimonial";
import { testimonialSchema } from "@/lib/validations";

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const testimonials = await Testimonial.find({ userId: user.id })
      .sort({ order: 1, createdAt: -1 })
      .lean();

    return NextResponse.json({ success: true, data: testimonials });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch testimonials" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validated = testimonialSchema.parse(body);

    await connectDB();
    const testimonial = await Testimonial.create({ ...validated, userId: user.id });

    return NextResponse.json(
      { success: true, data: testimonial, message: "Testimonial added!" },
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
      { success: false, error: "Failed to create testimonial" },
      { status: 500 }
    );
  }
}
