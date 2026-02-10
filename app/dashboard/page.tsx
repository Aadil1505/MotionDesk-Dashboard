"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { authClient } from "@/lib/auth-client";
import {
  CalendarDays,
  Check,
  Copy,
  CreditCard,
  ExternalLink,
  Eye,
  EyeOff,
  Key,
  Loader2,
  Package,
  RefreshCw,
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
  const [showLicenseKey, setShowLicenseKey] = useState(false);
  const [copied, setCopied] = useState(false);

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

  return (
    <section className="px-6 py-24">
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
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Package className="size-5" />
                  FluidField
                </CardTitle>
                <Badge variant={hasActivePurchase ? "default" : "secondary"}>
                  {hasActivePurchase ? "Active" : "No purchase"}
                </Badge>
              </div>
              <CardDescription>
                {hasActivePurchase
                  ? "Your license is active. You have full access to all themes and features."
                  : "You haven't purchased FluidField yet."}
              </CardDescription>
            </CardHeader>

            {hasActivePurchase && sub && (
              <>
                <Separator />
                <CardContent className="pt-6">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <CreditCard className="size-3.5" />
                        Amount
                      </div>
                      <p className="font-medium">
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
                      <p className="font-medium capitalize">{subStatus ?? "—"}</p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <CalendarDays className="size-3.5" />
                        Current period
                      </div>
                      <p className="font-medium">
                        {formatDate(subPeriodStart)} — {formatDate(subPeriodEnd)}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <CalendarDays className="size-3.5" />
                        Subscribed since
                      </div>
                      <p className="font-medium">{formatDate(subStartedAt)}</p>
                    </div>
                  </div>
                </CardContent>
              </>
            )}

            {hasActivePurchase && (
              <>
                <Separator />
                <CardContent className="pt-6">
                  {licenseKey ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <Key className="size-4" />
                        License key
                      </div>
                      <code className="block rounded-md bg-muted px-4 py-3 text-sm font-mono break-all">
                        {licenseKey}
                      </code>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Your license key will appear here once processed. Check the
                      Polar portal for details.
                    </p>
                  )}
                </CardContent>
              </>
            )}

            <CardFooter className="gap-3">
              {hasActivePurchase ? (
                <Button variant="outline" onClick={handlePortal}>
                  Manage license
                  <ExternalLink className="size-4" />
                </Button>
              ) : (
                <Button asChild>
                  <a href="/#pricing">Get FluidField</a>
                </Button>
              )}
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
