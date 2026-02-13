"use client";

import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { FloatingNav } from "@/components/ui/floating-navbar";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import DownloadButton from "@/components/global/download-button";
import { useMemo } from "react";
import {
  Palette,
  Sparkles,
  DollarSign,
  Home,
  User,
} from "lucide-react";

export default function Navbar() {
  const { data: session } = authClient.useSession();

  const navItems = useMemo(
    () => [
      { name: "Home", link: "/#home", icon: <Home className="size-4" /> },
      { name: "Themes", link: "/#showcase", icon: <Palette className="size-4" /> },
      { name: "Features", link: "/#features", icon: <Sparkles className="size-4" /> },
      { name: "Pricing", link: "/#pricing", icon: <DollarSign className="size-4" /> },
    ],
    []
  );

  return (
    <>
      <FloatingNav
        navItems={navItems}
        themeSlot={
          <AnimatedThemeToggler className="text-muted-foreground hover:text-muted-foreground/80 p-2 rounded-full hover:bg-muted transition-colors [&>svg]:size-4" />
        }
        authSlot={
          <Link
            href={session ? "/dashboard" : "/auth/sign-in"}
            className="flex items-center justify-center size-8 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
          >
            <User className="size-4" />
          </Link>
        }
      />

      <div className="pointer-events-none fixed inset-x-0 top-6 flex justify-end px-6 z-[5000] sm:px-10">
        <div className="pointer-events-auto">
          <DownloadButton size="sm" />
        </div>
      </div>
    </>
  );
}
