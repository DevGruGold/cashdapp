"use client"

import { useRouter, usePathname } from "next/navigation"
import { Home, Activity, Wallet, Terminal, Settings } from "lucide-react"
import { cn } from "@/lib/utils"
import { useLanguage } from "./language-provider"

export function BottomNav() {
  const router = useRouter()
  const pathname = usePathname()
  const { t } = useLanguage()

  const navItems = [
    {
      label: t("nav.home"),
      icon: Home,
      href: "/",
      active: pathname === "/",
    },
    {
      label: t("nav.activity"),
      icon: Activity,
      href: "/?tab=activity",
      active: pathname === "/" && new URLSearchParams(window.location.search).get("tab") === "activity",
    },
    {
      label: t("nav.banking"),
      icon: Wallet,
      href: "/banking",
      active: pathname === "/banking" || pathname.startsWith("/banking/"),
    },
    {
      label: t("nav.terminal"),
      icon: Terminal,
      href: "/?tab=terminal",
      active: pathname === "/" && new URLSearchParams(window.location.search).get("tab") === "terminal",
    },
    {
      label: t("nav.settings"),
      icon: Settings,
      href: "/?tab=settings",
      active: pathname === "/" && new URLSearchParams(window.location.search).get("tab") === "settings",
    },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 border-t bg-background z-10">
      <div className="grid grid-cols-5 h-16">
        {navItems.map((item) => (
          <button
            key={item.href}
            className={cn(
              "flex flex-col items-center justify-center gap-1",
              item.active ? "text-primary" : "text-muted-foreground",
            )}
            onClick={() => router.push(item.href)}
          >
            <item.icon className="h-5 w-5" />
            <span className="text-xs">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
