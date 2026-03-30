import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { z } from "zod";
import connectDB from "@/lib/db";
import { getSessionUser } from "@/lib/session";
import Subscription from "@/models/Subscription";
import { handleApiError, unauthorizedResponse } from "@/lib/apiError";
import { AppError } from "@/lib/apiError";
import { PLANS } from "@/constants/plans";
import { getRazorpayServerClient } from "@/lib/razorpayServer";

const verifyPaymentSchema = z.object({
  razorpay_order_id: z.string().min(1),
  razorpay_payment_id: z.string().min(1),
  razorpay_signature: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) return unauthorizedResponse();

    const body = await req.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      verifyPaymentSchema.parse(body);

    // Verify signature
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      throw new AppError("Payment verification failed. Invalid signature.", 400, "PAYMENT_FAILED");
    }

    await connectDB();
    const existingPayment = await Subscription.findOne({
      userId: { $ne: user.id },
      $or: [
        { razorpayOrderId: razorpay_order_id },
        { razorpayPaymentId: razorpay_payment_id },
      ],
    })
      .select("_id")
      .lean();

    if (existingPayment) {
      throw new AppError(
        "This payment has already been used for another account.",
        409,
        "CONFLICT"
      );
    }

    const plan = PLANS.pro;
    const razorpay = getRazorpayServerClient();
    const order = await razorpay.orders.fetch(razorpay_order_id);
    const orderNotes = (order.notes || {}) as Record<string, string | undefined>;
    const orderAmount = Number(order.amount || 0);
    const amountPaid = Number(order.amount_paid || 0);

    if (
      orderAmount !== plan.amountInPaise ||
      order.currency !== plan.currency ||
      orderNotes.userId !== user.id ||
      orderNotes.plan !== "pro" ||
      !(order.receipt || "").startsWith(`pro_${user.id}_`) ||
      amountPaid < plan.amountInPaise
    ) {
      throw new AppError(
        "Payment verification failed. Order details do not match this account.",
        400,
        "PAYMENT_FAILED"
      );
    }

    const now = new Date();
    const periodEnd = new Date(now);
    periodEnd.setDate(periodEnd.getDate() + 30);

    const subscription = await Subscription.findOneAndUpdate(
      { userId: user.id },
      {
        plan: "pro",
        status: "active",
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        currentPeriodStart: now,
        currentPeriodEnd: periodEnd,
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({
      success: true,
      data: {
        plan: subscription.plan,
        status: subscription.status,
        currentPeriodEnd: subscription.currentPeriodEnd,
      },
      message: "🎉 Welcome to Pro! Your upgrade is now active.",
    });
  } catch (error) {
    return handleApiError(error, "POST /api/admin/razorpay/verify-payment");
  }
}
