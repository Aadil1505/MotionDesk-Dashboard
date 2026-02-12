"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LiquidGlassCard } from "@/components/kokonutui/liquid-glass-card";
import { authClient } from "@/lib/auth-client";
import DownloadButton from "@/components/global/download-button";
import {
  CalendarDays,
  Check,
  CreditCard,
  ExternalLink,
  Infinity,
  Key,
  Loader2,
  Package,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function get(obj: any, ...keys: string[]) {
  for (const key of keys) {
    const val = obj?.[key];
    if (val !== undefined) return val;
  }
  return undefined;
}

function formatDate(value: string | Date | null | undefined): string {
  if (!value) return "—";
  const date = typeof value === "string" ? new Date(value) : value;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatAmount(cents: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(cents / 100);
}

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, isPending: sessionPending } =
    authClient.useSession();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [customerState, setCustomerState] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sessionPending) return;
    if (!session) {
      router.push("/auth/sign-in");
      return;
    }

    authClient.customer
      .state()
      .then(({ data }) => {
        setCustomerState(data);
      })
      .catch(() => {
        setCustomerState(null);
      })
      .finally(() => setLoading(false));
  }, [session, sessionPending, router]);

  const handlePortal = async () => {
    const { data } = await authClient.customer.portal();
    if (data?.url) {
      window.location.href = data.url;
    }
  };

  if (sessionPending || loading) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!session) return null;

  const activeSubscriptions =
    get(customerState, "activeSubscriptions", "active_subscriptions") ?? [];
  const grantedBenefits =
    get(customerState, "grantedBenefits", "granted_benefits") ?? [];
  const hasActivePurchase =
    activeSubscriptions.length > 0 || grantedBenefits.length > 0;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const licenseKeyBenefit = grantedBenefits.find((b: any) => {
    const type = get(b, "benefitType", "benefit_type");
    return type === "license_keys";
  });

  const licenseKey = licenseKeyBenefit
    ? get(licenseKeyBenefit.properties, "displayKey", "display_key") ??
      get(licenseKeyBenefit.properties, "licenseKey", "license_key") ??
      get(licenseKeyBenefit.properties, "licenseKeyId", "license_key_id")
    : undefined;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sub = activeSubscriptions[0] as any;
  const subAmount = sub ? get(sub, "amount") : undefined;
  const subCurrency = sub ? get(sub, "currency") ?? "usd" : "usd";
  const subInterval = sub
    ? get(sub, "recurringInterval", "recurring_interval")
    : undefined;
  const subPeriodStart = sub
    ? get(sub, "currentPeriodStart", "current_period_start")
    : undefined;
  const subPeriodEnd = sub
    ? get(sub, "currentPeriodEnd", "current_period_end")
    : undefined;
  const subStartedAt = sub ? get(sub, "startedAt", "started_at") : undefined;
  const subStatus = sub ? get(sub, "status") : undefined;

  // Check for lifetime/one-time orders
  const orders = get(customerState, "orders") ?? [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const lifetimeOrder = orders.find((o: any) => {
    const productName = get(o, "product", "productName", "product_name") ?? "";
    const productId = get(o, "productId", "product_id") ?? "";
    return (
      productName.toLowerCase().includes("lifetime") ||
      productId === "a9ae9cbc-cf34-4119-bdce-439dec938363"
    );
  });

  // Determine if user has lifetime access (has benefits but no subscription, or has lifetime order)
  const hasLifetime = lifetimeOrder || (grantedBenefits.length > 0 && activeSubscriptions.length === 0);
  const orderAmount = lifetimeOrder ? get(lifetimeOrder, "amount") : 3900; // Default to $39 if not available
  const orderCurrency = lifetimeOrder ? get(lifetimeOrder, "currency") ?? "usd" : "usd";
  const orderCreatedAt = lifetimeOrder ? get(lifetimeOrder, "createdAt", "created_at") : undefined;
  console.log(lifetimeOrder)

  return (
    <section className="px-6 py-40">
      <div className="mx-auto max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="mt-2 text-muted-foreground">
            Welcome back, {session.user.name || session.user.email}.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mt-8 space-y-6"
        >
          <LiquidGlassCard
            glassSize="lg"
            className="rounded-3xl border border-border/60 bg-linear-to-br from-primary-foreground to-bg-card shadow-xl"
          >
            {/* Header */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Package className="size-5" />
                  <h3 className="text-xl font-semibold text-foreground">MotionDesk</h3>
                </div>
                <Badge variant={hasActivePurchase ? "default" : "secondary"}>
                  {hasActivePurchase
                    ? hasLifetime && !sub
                      ? "Lifetime"
                      : "Active"
                    : "No purchase"}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {hasActivePurchase
                  ? hasLifetime && !sub
                    ? "You have lifetime access. Enjoy all themes and features forever."
                    : "Your license is active. You have full access to all themes and features."
                  : "You haven't purchased MotionDesk yet."}
              </p>
            </div>

            {hasActivePurchase && sub && (
              <>
                <div className="my-6 h-px bg-linear-to-r from-transparent via-border to-transparent" />
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <CreditCard className="size-3.5" />
                      Amount
                    </div>
                    <p className="font-medium text-foreground">
                      {subAmount !== undefined
                        ? `${formatAmount(subAmount, subCurrency)} / ${subInterval ?? "month"}`
                        : "—"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <RefreshCw className="size-3.5" />
                      Status
                    </div>
                    <p className="font-medium capitalize text-foreground">{subStatus ?? "—"}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <CalendarDays className="size-3.5" />
                      Current period
                    </div>
                    <p className="font-medium text-foreground">
                      {formatDate(subPeriodStart)} — {formatDate(subPeriodEnd)}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <CalendarDays className="size-3.5" />
                      Subscribed since
                    </div>
                    <p className="font-medium text-foreground">{formatDate(subStartedAt)}</p>
                  </div>
                </div>
              </>
            )}

            {hasActivePurchase && hasLifetime && !sub && (
              <>
                <div className="my-6 h-px bg-linear-to-r from-transparent via-border to-transparent" />
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Infinity className="size-3.5" />
                      Plan
                    </div>
                    <p className="font-medium flex items-center gap-1.5 text-foreground">
                      Lifetime
                      <Sparkles className="size-3.5 text-primary" />
                    </p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <CreditCard className="size-3.5" />
                      Amount paid
                    </div>
                    <p className="font-medium text-foreground">
                      {formatAmount(orderAmount, orderCurrency)}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Check className="size-3.5" />
                      Status
                    </div>
                    <p className="font-medium text-green-600 dark:text-green-400">
                      Lifetime access
                    </p>
                  </div>
                </div>
              </>
            )}

            {hasActivePurchase && (
              <>
                <div className="my-6 h-px bg-linear-to-r from-transparent via-border to-transparent" />
                {licenseKey ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                      <Key className="size-4" />
                      License key
                    </div>
                    <code className="block rounded-xl bg-muted/50 px-4 py-3 text-sm font-mono break-all text-foreground">
                      {licenseKey}
                    </code>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Your license key will appear here once processed. Check the
                    Polar portal for details.
                  </p>
                )}
              </>
            )}

            <div className="mt-8 flex flex-wrap gap-3">
              {hasActivePurchase ? (
                <>
                  <DownloadButton size="default" className="rounded-full" />
                  <Button variant="outline" onClick={handlePortal} className="rounded-full">
                    Manage license
                    <ExternalLink className="size-4" />
                  </Button>
                </>
              ) : (
                <Button asChild className="rounded-full">
                  <a href="/#pricing">Get MotionDesk</a>
                </Button>
              )}
            </div>
          </LiquidGlassCard>
        </motion.div>
      </div>
    </section>
  );
}
