"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useWallet } from "@/components/wallet-provider"
import { useUser } from "@/components/user-provider"
import { Wallet, LogOut } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProfileSection } from "@/components/settings/profile-section"
import { SecuritySection } from "@/components/settings/security-section"
import { PaymentMethodsSection } from "@/components/settings/payment-methods-section"
import { NotificationsSection } from "@/components/settings/notifications-section"
import { AppearanceSection } from "@/components/settings/appearance-section"
import { UserSwitcher } from "@/components/settings/user-switcher"
import { WalletConnectButton } from "@/components/wallet-connect-button"
import { useLanguage } from "./language-provider"
import { LanguageSection } from "./settings/language-section"

export function SettingsScreen() {
  const { isConnected } = useWallet()
  const { currentUser, logout } = useUser()
  const [activeTab, setActiveTab] = useState("profile")
  const { t } = useLanguage()

  return (
    <div className="flex flex-col min-h-screen p-4 space-y-4 pb-20">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{t("settings.title")}</h1>
        <UserSwitcher />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="profile">{t("settings.profile")}</TabsTrigger>
          <TabsTrigger value="security">{t("settings.security")}</TabsTrigger>
          <TabsTrigger value="preferences">{t("settings.preferences")}</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <ProfileSection />
          <PaymentMethodsSection />
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <SecuritySection />

          <Card>
            <CardHeader>
              <CardTitle>{t("settings.wallet")}</CardTitle>
              <CardDescription>{t("settings.manageWallet")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Wallet className={`h-4 w-4 ${isConnected ? "text-green-500" : ""}`} />
                  <span>{isConnected ? t("settings.walletConnected") : t("settings.connectWallet")}</span>
                </div>
                <WalletConnectButton variant="outline" size="sm" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-4">
          <AppearanceSection />
          <LanguageSection />
          <NotificationsSection />
        </TabsContent>
      </Tabs>

      <Button variant="destructive" className="w-full" onClick={logout}>
        <LogOut className="mr-2 h-4 w-4" />
        {t("settings.signOut")}
      </Button>
    </div>
  )
}
