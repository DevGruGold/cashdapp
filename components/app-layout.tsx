"use client"

import type { ReactNode } from "react"
import { AppHeader } from "./app-header"
import { BottomNav } from "./bottom-nav"
import { useLanguage } from "./language-provider"

interface AppLayoutProps {
  children: ReactNode
  hideBottomNav?: boolean
  hideHeader?: boolean
}

export function AppLayout({ children, hideBottomNav = false, hideHeader = false }: AppLayoutProps) {
  const { t } = useLanguage()

  return (
    <div className="flex flex-col min-h-screen">
      {!hideHeader && <AppHeader />}
      <main className="flex-1 pb-16">{children}</main>
      {!hideBottomNav && <BottomNav />}
    </div>
  )
}
