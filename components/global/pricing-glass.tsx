"use client";

import { authClient } from "@/lib/auth-client";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { motion } from "motion/react";
import {
  LiquidGlassCard,
  LiquidButton,
} from "@/components/kokonutui/liquid-glass-card";
import { Button } from "../ui/button";

const features = [
  "All 7 visualization themes",
  "Multi-display support",
  "Cursor-responsive physics",
  "GPU-accelerated (Metal)",
  "Autopilot mode",
  "Granular customization",
  "Free updates",
];

export default function PricingGlass() {
  const handleCheckout = async () => {
    await authClient.checkout({
      slug: "Fluid-Field-Monthly",
      successUrl: `${window.location.origin}/success`,
    });
  };

  const handleLifetimeCheckout = async () => {
    await authClient.checkout({
      slug: "Fluid-Field-Lifetime",
      successUrl: `${window.location.origin}/success`,
    });
  };

  return (
    <section id="pricing" className="px-6 py-24">
      <div className="mx-auto flex max-w-5xl flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight">Simple pricing</h2>
          <p className="mt-3 text-muted-foreground">
            One purchase, everything included. Less than a coffee.
          </p>
        </motion.div>

        <div className="mt-12 grid w-full max-w-3xl gap-6 md:grid-cols-2">
          {/* Monthly Plan */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <LiquidGlassCard
              glassSize="lg"
              className="h-full rounded-3xl border border-border/60 bg-linear-to-br from-primary-foreground to-bg-card shadow-xl"
            >
              {/* Header */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-semibold text-foreground">
                    Monthly
                  </h3>
                  {/* <Badge variant="secondary">Monthly</Badge> */}
                </div>
                <p className="text-sm text-muted-foreground">
                  Full access to every theme and feature.
                </p>
                <div className="pt-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg text-muted-foreground line-through">
                      $9.99
                    </span>
                    <Badge className="bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20">
                      65% OFF
                    </Badge>
                  </div>
                  <span className="text-4xl font-bold text-foreground">
                    $3.49
                  </span>
                  <span className="ml-1 text-muted-foreground">Per Month</span>
                </div>
              </div>

              {/* Divider */}
              <div className="my-6 h-px bg-linear-to-r from-transparent via-border to-transparent" />

              {/* Features */}
              <ul className="space-y-3">
                {features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-3 text-sm text-foreground"
                  >
                    <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-muted">
                      <Check className="size-3 text-muted-foreground" />
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>

              {/* Button */}
              <div className="mt-8">
                <Button onClick={handleCheckout} className="rounded-full w-full" variant="outline">
                  Get FluidField
                </Button>
              </div>
            </LiquidGlassCard>
          </motion.div>

          {/* Lifetime Plan */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.25 }}
          >
            <LiquidGlassCard
              glassSize="lg"
              className="h-full rounded-3xl border border-primary/50 bg-linear-to-br from-primary-foreground to-bg-card shadow-xl shadow-primary/10 ring-1 ring-primary/20 relative"
            >

              {/* Header */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-semibold text-foreground">
                    Lifetime
                  </h3>
                  {/* <Badge variant="secondary">Lifetime</Badge> */}
                </div>
                <p className="text-sm text-muted-foreground">
                  Pay once, own forever. No recurring fees.
                </p>
                <div className="pt-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg text-muted-foreground line-through">
                      $99.00
                    </span>
                    <Badge className="bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20">
                      60% OFF
                    </Badge>
                  </div>
                  <span className="text-4xl font-bold text-foreground">
                    $39.00
                  </span>
                  <span className="ml-1 text-muted-foreground">One Time</span>
                </div>
              </div>

              {/* Divider */}
              <div className="my-6 h-px bg-linear-to-r from-transparent via-border to-transparent" />

              {/* Features */}
              <ul className="space-y-3">
                {features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-3 text-sm text-foreground"
                  >
                    <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <Check className="size-3 text-primary" />
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>

              {/* Button */}
              <div className="mt-8">
                <Button onClick={handleLifetimeCheckout} className="rounded-full w-full">
                  Get Lifetime Access
                </Button>
              </div>
            </LiquidGlassCard>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
