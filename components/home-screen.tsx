"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MainScreen } from "@/components/main-screen"
import { ActivityScreen } from "@/components/activity-screen"
import { TerminalScreen } from "@/components/terminal-screen"
import { AssetsScreen } from "@/components/assets-screen"
import { UserCircle, Activity, Terminal, Coins, Settings, BanknoteIcon as Bank } from "lucide-react"
import { SettingsScreen } from "@/components/settings-screen"
import { useMobile } from "@/hooks/use-mobile"
import { useUser } from "@/components/user-provider"
import { LoginScreen } from "@/components/login-screen"
import { useRouter, useSearchParams } from "next/navigation"
import { useLanguage } from "./language-provider"
import { AppHeader } from "./app-header"

export function HomeScreen() {
  const [activeTab, setActiveTab] = useState("home")
  const isMobile = useMobile()
  const { isAuthenticated } = useUser()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { t } = useLanguage()

  // Check for tab parameter in URL when component mounts
  useEffect(() => {
    const tab = searchParams.get("tab")
    if (tab && ["home", "activity", "terminal", "assets", "settings"].includes(tab)) {
      setActiveTab(tab)
    }
  }, [searchParams])

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    return <LoginScreen />
  }

  // Update the handleTabChange function to properly navigate to other tabs
  const handleTabChange = (value: string) => {
    // If user selects banking tab, navigate to the banking page
    if (value === "banking") {
      router.push("/banking")
      return
    }

    // For other tabs, just update the active tab
    setActiveTab(value)
  }

  return (
    <div className="flex flex-col min-h-screen w-full max-w-md mx-auto">
      <AppHeader />
      <Tabs
        defaultValue="home"
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full h-full flex flex-col"
      >
        <TabsContent value="home" className="flex-1 p-0 m-0">
          <MainScreen />
        </TabsContent>
        <TabsContent value="activity" className="flex-1 p-0 m-0">
          <ActivityScreen />
        </TabsContent>
        <TabsContent value="terminal" className="flex-1 p-0 m-0">
          <TerminalScreen />
        </TabsContent>
        <TabsContent value="assets" className="flex-1 p-0 m-0">
          <AssetsScreen />
        </TabsContent>
        <TabsContent value="settings" className="flex-1 p-0 m-0">
          <SettingsScreen />
        </TabsContent>

        <TabsList className="fixed bottom-0 left-0 right-0 h-16 grid grid-cols-6 bg-background border-t">
          <TabsTrigger
            value="home"
            className="flex flex-col items-center justify-center data-[state=active]:text-primary"
          >
            <UserCircle className="h-5 w-5" />
            <span className="text-xs">{t("nav.home")}</span>
          </TabsTrigger>
          <TabsTrigger
            value="activity"
            className="flex flex-col items-center justify-center data-[state=active]:text-primary"
          >
            <Activity className="h-5 w-5" />
            <span className="text-xs">{t("nav.activity")}</span>
          </TabsTrigger>
          <TabsTrigger
            value="banking"
            className="flex flex-col items-center justify-center data-[state=active]:text-primary"
          >
            <Bank className="h-5 w-5" />
            <span className="text-xs">{t("nav.banking")}</span>
          </TabsTrigger>
          <TabsTrigger
            value="terminal"
            className="flex flex-col items-center justify-center data-[state=active]:text-primary"
          >
            <Terminal className="h-5 w-5" />
            <span className="text-xs">{t("nav.terminal")}</span>
          </TabsTrigger>
          <TabsTrigger
            value="assets"
            className="flex flex-col items-center justify-center data-[state=active]:text-primary"
          >
            <Coins className="h-5 w-5" />
            <span className="text-xs">{t("nav.assets")}</span>
          </TabsTrigger>
          <TabsTrigger
            value="settings"
            className="flex flex-col items-center justify-center data-[state=active]:text-primary"
          >
            <Settings className="h-5 w-5" />
            <span className="text-xs">{t("nav.settings")}</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  )
}
