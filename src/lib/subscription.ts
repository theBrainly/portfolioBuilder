import type { DesignPreset, ThemePalette } from "@/constants/siteCustomization";
import { PLANS, type PlanId } from "@/constants/plans";
import connectDB from "@/lib/db";
import { AppError } from "@/lib/apiError";
import Subscription from "@/models/Subscription";

type EffectiveSubscriptionStatus = "active" | "expired" | "cancelled";

export type EffectiveSubscription = {
  plan: PlanId;
  status: EffectiveSubscriptionStatus;
  currentPeriodStart: Date | null;
  currentPeriodEnd: Date | null;
};

type PlanFeatureKey = keyof (typeof PLANS.free.features);
type PlanLimitKey = Extract<
  PlanFeatureKey,
  "maxProjects" | "maxSkills" | "maxExperience" | "maxTestimonials"
>;

export const FREE_THEME_PALETTES = ["graphite", "ocean"] as const satisfies readonly ThemePalette[];
export const FREE_DESIGN_PRESETS = ["classic"] as const satisfies readonly DesignPreset[];

function normalizeDate(value: Date | string | null | undefined) {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function getExpiredSubscriptionSnapshot(
  currentPeriodEnd: Date | string | null | undefined
): EffectiveSubscription {
  return {
    plan: "free",
    status: "expired",
    currentPeriodStart: null,
    currentPeriodEnd: normalizeDate(currentPeriodEnd),
  };
}

export async function getEffectiveSubscriptionForUser(
  userId: string,
  options?: { ensureRecord?: boolean }
): Promise<EffectiveSubscription> {
  await connectDB();

  let subscription = await Subscription.findOne({ userId });

  if (!subscription) {
    if (!options?.ensureRecord) {
      return {
        plan: "free",
        status: "active",
        currentPeriodStart: null,
        currentPeriodEnd: null,
      };
    }

    subscription = await Subscription.create({
      userId,
      plan: "free",
      status: "active",
    });
  }

  const periodEnd = normalizeDate(subscription.currentPeriodEnd);

  if (subscription.plan === "pro") {
    if (subscription.status !== "active") {
      return getExpiredSubscriptionSnapshot(periodEnd);
    }

    if (periodEnd && periodEnd.getTime() <= Date.now()) {
      await Subscription.findByIdAndUpdate(subscription._id, {
        plan: "free",
        status: "expired",
        currentPeriodStart: null,
        currentPeriodEnd: periodEnd,
      });

      return getExpiredSubscriptionSnapshot(periodEnd);
    }

    return {
      plan: "pro",
      status: "active",
      currentPeriodStart: normalizeDate(subscription.currentPeriodStart),
      currentPeriodEnd: periodEnd,
    };
  }

  return {
    plan: "free",
    status: "active",
    currentPeriodStart: null,
    currentPeriodEnd: periodEnd,
  };
}

export async function assertFeatureEnabledForUser(
  userId: string,
  feature: Exclude<PlanFeatureKey, PlanLimitKey>,
  message: string
) {
  const subscription = await getEffectiveSubscriptionForUser(userId);
  const enabled = Boolean(PLANS[subscription.plan].features[feature]);

  if (!enabled) {
    throw new AppError(message, 403, "FORBIDDEN");
  }

  return subscription;
}

export function assertPlanLimit(
  plan: PlanId,
  limitKey: PlanLimitKey,
  currentCount: number,
  resourceLabel: string
) {
  const limit = PLANS[plan].features[limitKey];

  if (Number.isFinite(limit) && currentCount >= limit) {
    throw new AppError(
      `Your ${PLANS[plan].name} plan allows up to ${limit} ${resourceLabel}. Upgrade to add more.`,
      403,
      "FORBIDDEN"
    );
  }
}

export function getRemainingPlanSlots(plan: PlanId, limitKey: PlanLimitKey, currentCount: number) {
  const limit = PLANS[plan].features[limitKey];

  if (!Number.isFinite(limit)) {
    return Number.POSITIVE_INFINITY;
  }

  return Math.max(0, limit - currentCount);
}

export function assertAllowedThemePalette(plan: PlanId, palette: ThemePalette) {
  if (
    plan === "pro" ||
    FREE_THEME_PALETTES.includes(palette as (typeof FREE_THEME_PALETTES)[number])
  ) {
    return;
  }

  throw new AppError(
    "This theme palette is available on the Pro plan only.",
    403,
    "FORBIDDEN"
  );
}

export function assertAllowedDesignPreset(plan: PlanId, preset: DesignPreset) {
  if (
    plan === "pro" ||
    FREE_DESIGN_PRESETS.includes(preset as (typeof FREE_DESIGN_PRESETS)[number])
  ) {
    return;
  }

  throw new AppError(
    "This design preset is available on the Pro plan only.",
    403,
    "FORBIDDEN"
  );
}
