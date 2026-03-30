"use client";
import { useEffect, useState, useCallback } from "react";
import {
  Crown,
  Check,
  X as XIcon,
  Sparkles,
  Zap,
  Shield,
  Globe,
  BarChart3,
  Brain,
  Palette,
  Loader2,
} from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";
import { useAdminMenu } from "@/hooks/useAdminMenu";
import { PLANS, PRO_ONLY_FEATURES } from "@/constants/plans";
import { openRazorpayCheckout } from "@/lib/razorpay";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

const FEATURE_ICONS: Record<string, any> = {
  "Unlimited Projects": Zap,
  "Custom Domain": Globe,
  "AI Writing Assistant": Brain,
  "All Themes & Presets": Palette,
  "Portfolio Analytics": BarChart3,
  "Priority Support": Shield,
};

export default function UpgradePage() {
  const { onMenuClick } = useAdminMenu();
  const [currentPlan, setCurrentPlan] = useState<string>("free");
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState(false);
  const [periodEnd, setPeriodEnd] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/subscription")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          setCurrentPlan(d.data.plan);
          setPeriodEnd(d.data.currentPeriodEnd);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleUpgrade = useCallback(async () => {
    setUpgrading(true);
    try {
      const res = await fetch("/api/admin/razorpay/create-order", {
        method: "POST",
      });
      const data = await res.json();

      if (!data.success) {
        toast.error(data.error || "Failed to create order");
        setUpgrading(false);
        return;
      }

      openRazorpayCheckout({
        orderId: data.data.orderId,
        amount: data.data.amount,
        currency: data.data.currency,
        keyId: data.data.keyId,
        userName: data.data.userName,
        userEmail: data.data.userEmail,
        onSuccess: async (response) => {
          try {
            const verifyRes = await fetch(
              "/api/admin/razorpay/verify-payment",
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(response),
              }
            );
            const verifyData = await verifyRes.json();

            if (verifyData.success) {
              toast.success(verifyData.message || "Upgraded to Pro! 🎉");
              setCurrentPlan("pro");
              setPeriodEnd(verifyData.data.currentPeriodEnd);
            } else {
              toast.error(verifyData.error || "Verification failed");
            }
          } catch {
            toast.error("Payment verification failed. Contact support.");
          } finally {
            setUpgrading(false);
          }
        },
        onFailure: (error: any) => {
          toast.error(error?.description || "Payment failed. Please try again.");
          setUpgrading(false);
        },
      });
    } catch {
      toast.error("Something went wrong. Please try again.");
      setUpgrading(false);
    }
  }, []);

  const isPro = currentPlan === "pro";

  return (
    <>
      <AdminHeader
        title="Upgrade"
        subtitle="Unlock the full power of your portfolio"
        onMenuClick={onMenuClick}
      />
      <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-8">
        {/* Current Plan Banner */}
        {!loading && (
          <div
            className={cn(
              "rounded-2xl p-5 flex items-center gap-4 border",
              isPro
                ? "bg-gradient-to-r from-amber-500/10 via-yellow-500/5 to-transparent border-amber-500/20"
                : "bg-surface-2/50 border-border"
            )}
          >
            <div
              className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0",
                isPro
                  ? "bg-gradient-to-br from-amber-400 to-yellow-600"
                  : "bg-surface-2"
              )}
            >
              <Crown
                className={cn(
                  "w-6 h-6",
                  isPro ? "text-white" : "text-text-muted"
                )}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-text-muted">Current Plan</p>
              <p className="text-lg font-bold text-text-primary">
                {isPro ? "Pro" : "Free"}
                {isPro && periodEnd && (
                  <span className="text-sm font-normal text-text-muted ml-2">
                    · Active until{" "}
                    {new Date(periodEnd).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                )}
              </p>
            </div>
            {isPro && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-amber-400 to-yellow-600 text-white">
                ACTIVE
              </span>
            )}
          </div>
        )}

        {/* Pro Features Highlight */}
        {!isPro && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {PRO_ONLY_FEATURES.map((feature) => {
              const Icon = FEATURE_ICONS[feature.label] || Sparkles;
              return (
                <div
                  key={feature.label}
                  className="group relative rounded-2xl border border-border bg-surface p-5 hover:border-amber-500/30 hover:bg-amber-500/[0.03] transition-all duration-300"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400/20 to-yellow-600/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-5 h-5 text-amber-500" />
                  </div>
                  <h4 className="text-sm font-semibold text-text-primary mb-1">
                    {feature.label}
                  </h4>
                  <p className="text-xs text-text-muted leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        )}

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Free Plan */}
          <div
            className={cn(
              "rounded-2xl border p-6 flex flex-col",
              currentPlan === "free"
                ? "border-primary/30 bg-primary/[0.03]"
                : "border-border bg-surface"
            )}
          >
            <div className="mb-6">
              <h3 className="text-xl font-bold text-text-primary mb-1">Free</h3>
              <p className="text-sm text-text-muted">
                {PLANS.free.description}
              </p>
            </div>
            <div className="mb-6">
              <span className="text-4xl font-extrabold text-text-primary">
                ₹0
              </span>
              <span className="text-text-muted text-sm ml-1">/forever</span>
            </div>
            <ul className="space-y-3 flex-1 mb-6">
              {PLANS.free.featureList.map((feat) => (
                <li key={feat} className="flex items-start gap-2.5 text-sm">
                  <Check className="w-4 h-4 mt-0.5 text-green-500 flex-shrink-0" />
                  <span className="text-text-secondary">{feat}</span>
                </li>
              ))}
              {/* Items NOT in Free */}
              {[
                "Custom Domain",
                "AI Writing Assistant",
                "Portfolio Analytics",
                "Priority Support",
              ].map((feat) => (
                <li
                  key={feat}
                  className="flex items-start gap-2.5 text-sm opacity-40"
                >
                  <XIcon className="w-4 h-4 mt-0.5 text-red-400 flex-shrink-0" />
                  <span className="text-text-muted line-through">{feat}</span>
                </li>
              ))}
            </ul>
            {currentPlan === "free" && (
              <div className="w-full py-2.5 rounded-xl bg-surface-2 text-center text-sm font-medium text-text-muted">
                Current Plan
              </div>
            )}
          </div>

          {/* Pro Plan */}
          <div className="relative rounded-2xl border-2 border-amber-500/40 bg-gradient-to-b from-amber-500/[0.04] to-transparent p-6 flex flex-col overflow-hidden">
            {/* Popular Badge */}
            <div className="absolute top-4 right-4">
              <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r from-amber-400 to-yellow-600 text-white shadow-lg shadow-amber-500/20">
                Most Popular
              </span>
            </div>
            <div className="mb-6">
              <h3 className="text-xl font-bold text-text-primary mb-1 flex items-center gap-2">
                <Crown className="w-5 h-5 text-amber-500" />
                Pro
              </h3>
              <p className="text-sm text-text-muted">
                {PLANS.pro.description}
              </p>
            </div>
            <div className="mb-6">
              <span className="text-4xl font-extrabold text-text-primary">
                ₹{PLANS.pro.price}
              </span>
              <span className="text-text-muted text-sm ml-1">/month</span>
            </div>
            <ul className="space-y-3 flex-1 mb-6">
              {PLANS.pro.featureList.map((feat) => (
                <li key={feat} className="flex items-start gap-2.5 text-sm">
                  <Check className="w-4 h-4 mt-0.5 text-amber-500 flex-shrink-0" />
                  <span className="text-text-primary font-medium">{feat}</span>
                </li>
              ))}
            </ul>
            {isPro ? (
              <div className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-600 text-center text-sm font-semibold text-white">
                ✓ Your Plan
              </div>
            ) : (
              <button
                onClick={handleUpgrade}
                disabled={upgrading || loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-600 text-white text-sm font-semibold hover:shadow-lg hover:shadow-amber-500/25 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
              >
                {upgrading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing…
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Upgrade to Pro
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* FAQ / Trust */}
        <div className="rounded-2xl border border-border bg-surface p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4">
            Frequently Asked Questions
          </h3>
          <div className="space-y-4">
            {[
              {
                q: "What happens after I upgrade?",
                a: "Your Pro features are activated instantly. All limits are removed and you can start using custom domains, AI writing, all themes, and more right away.",
              },
              {
                q: "Is my payment secure?",
                a: "Absolutely. All payments are processed through Razorpay, India's leading payment gateway. We never store your card details.",
              },
              {
                q: "Can I cancel my subscription?",
                a: "Yes, you can cancel anytime. Your Pro features will remain active until the end of your current billing period.",
              },
              {
                q: "What payment methods are accepted?",
                a: "We accept UPI, Credit/Debit cards, Net Banking, and popular wallets through Razorpay.",
              },
            ].map((faq) => (
              <details
                key={faq.q}
                className="group rounded-xl bg-surface-2/50 px-4 py-3"
              >
                <summary className="cursor-pointer text-sm font-medium text-text-primary list-none flex items-center justify-between">
                  {faq.q}
                  <span className="text-text-muted group-open:rotate-45 transition-transform duration-200 text-lg">
                    +
                  </span>
                </summary>
                <p className="mt-2 text-sm text-text-muted leading-relaxed">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
