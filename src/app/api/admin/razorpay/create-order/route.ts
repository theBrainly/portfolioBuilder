import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { getSessionUser } from "@/lib/session";
import { handleApiError, unauthorizedResponse } from "@/lib/apiError";
import { AppError } from "@/lib/apiError";
import { PLANS } from "@/constants/plans";
import { getRazorpayServerClient } from "@/lib/razorpayServer";
import { getEffectiveSubscriptionForUser } from "@/lib/subscription";

export async function POST() {
  try {
    const user = await getSessionUser();
    if (!user) return unauthorizedResponse();

    await connectDB();

    // Check if already on Pro
    const existing = await getEffectiveSubscriptionForUser(user.id, { ensureRecord: true });
    if (existing.plan === "pro" && existing.status === "active") {
      throw new AppError("You are already on the Pro plan", 400, "VALIDATION_ERROR");
    }

    const plan = PLANS.pro;
    const razorpay = getRazorpayServerClient();

    const order = await razorpay.orders.create({
      amount: plan.amountInPaise,
      currency: plan.currency,
      receipt: `pro_${user.id}_${Date.now()}`,
      notes: {
        userId: user.id,
        plan: "pro",
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        userName: user.name,
        userEmail: user.email,
      },
    });
  } catch (error) {
    return handleApiError(error, "POST /api/admin/razorpay/create-order");
  }
}
