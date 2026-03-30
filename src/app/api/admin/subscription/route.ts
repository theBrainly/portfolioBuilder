import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { getSessionUser } from "@/lib/session";
import { handleApiError, unauthorizedResponse } from "@/lib/apiError";
import { PLANS } from "@/constants/plans";
import { getEffectiveSubscriptionForUser } from "@/lib/subscription";

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) return unauthorizedResponse();

    await connectDB();

    const subscription = await getEffectiveSubscriptionForUser(user.id, { ensureRecord: true });
    const planDetails = PLANS[subscription.plan as keyof typeof PLANS];

    return NextResponse.json({
      success: true,
      data: {
        plan: subscription.plan,
        status: subscription.status,
        currentPeriodStart: subscription.currentPeriodStart,
        currentPeriodEnd: subscription.currentPeriodEnd,
        planDetails,
      },
    });
  } catch (error) {
    return handleApiError(error, "GET /api/admin/subscription");
  }
}
