"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CreditCard, Wallet, ArrowRight, HardDrive, Terminal, Database, Send } from "lucide-react"
import { UserCircle, Activity, Coins, Settings, BanknoteIcon as Bank } from "lucide-react"
import { BuyCryptoForm } from "@/components/buy-crypto-form"
import { AddCardForm } from "@/components/add-card-form"
import { ColdWalletManager } from "@/components/cold-wallet/cold-wallet-manager"
import { POSTerminal } from "@/components/pos/pos-terminal"
import { useWallet } from "@/components/wallet-provider"
import { useSearchParams, useRouter } from "next/navigation"
import { useLanguage } from "./language-provider"
import { AppHeader } from "./app-header"

export function BankingScreen() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [showBuyForm, setShowBuyForm] = useState(false)
  const [showAddCardForm, setShowAddCardForm] = useState(false)
  const [showColdWallet, setShowColdWallet] = useState(false)
  const [showPOSTerminal, setShowPOSTerminal] = useState(false)
  const [activeTab, setActiveTab] = useState("cards")
  const { balance, isConnected } = useWallet()
  const { t } = useLanguage()

  // Set the active tab based on URL parameter
  useEffect(() => {
    const tab = searchParams.get("tab")
    if (tab && ["cards", "crypto", "cash"].includes(tab)) {
      setActiveTab(tab)
    }
  }, [searchParams])

  // Update URL when tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value)
    router.push(`/banking?tab=${value}`, { scroll: false })
  }

  // Handle bottom navigation
  const handleBottomNavigation = (value: string) => {
    if (value === "banking") {
      // Already on banking page, do nothing
      return
    }

    // Navigate to other tabs
    if (value === "home") {
      router.push("/")
    } else if (value === "activity" || value === "terminal" || value === "assets" || value === "settings") {
      router.push(`/?tab=${value}`)
    }
  }

  if (showBuyForm) {
    return (
      <>
        <AppHeader />
        <BuyCryptoForm onBack={() => setShowBuyForm(false)} />
      </>
    )
  }

  if (showAddCardForm) {
    return (
      <>
        <AppHeader />
        <AddCardForm onBack={() => setShowAddCardForm(false)} />
      </>
    )
  }

  if (showColdWallet) {
    return (
      <>
        <AppHeader />
        <ColdWalletManager onBack={() => setShowColdWallet(false)} balance={balance} />
      </>
    )
  }

  if (showPOSTerminal) {
    return (
      <>
        <AppHeader />
        <POSTerminal onBack={() => setShowPOSTerminal(false)} />
      </>
    )
  }

  return (
    <div className="flex flex-col min-h-screen w-full max-w-md mx-auto">
      <AppHeader />
      <div className="flex flex-col p-4 space-y-4 pb-20">
        <h1 className="text-2xl font-bold">{t("banking.title")}</h1>

        {/* Featured Card - POS Terminal */}
        <Card className="bg-primary/10 border-primary">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Terminal className="h-5 w-5 mr-2" />
              {t("terminal.title")}
            </CardTitle>
            <CardDescription>{t("terminal.description")}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm mb-4">{t("terminal.connect")}</p>
            <Button className="w-full" onClick={() => setShowPOSTerminal(true)}>
              {t("terminal.open")}
            </Button>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="cards">{t("banking.cards")}</TabsTrigger>
            <TabsTrigger value="crypto">{t("banking.crypto")}</TabsTrigger>
            <TabsTrigger value="cash">{t("banking.cash")}</TabsTrigger>
          </TabsList>

          <TabsContent value="cards" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{t("banking.yourCards")}</CardTitle>
                <CardDescription>{t("banking.managePaymentMethods")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full justify-between" onClick={() => setShowAddCardForm(true)}>
                  <div className="flex items-center">
                    <CreditCard className="mr-2 h-4 w-4" />
                    {t("banking.addCard")}
                  </div>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="crypto" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{t("banking.cryptocurrency")}</CardTitle>
                <CardDescription>{t("banking.buySellManage")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full justify-between" onClick={() => setShowBuyForm(true)}>
                  <div className="flex items-center">
                    <Wallet className="mr-2 h-4 w-4" />
                    {t("banking.buyCrypto")}
                  </div>
                  <ArrowRight className="h-4 w-4" />
                </Button>

                {!isConnected && <p className="text-sm text-muted-foreground mt-2">{t("banking.walletRequired")}</p>}
              </CardContent>
              <CardFooter className="text-sm text-muted-foreground">{t("banking.poweredBy")}</CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="cash" className="space-y-4">
            <Card className="bg-primary/10 border-primary">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <HardDrive className="h-5 w-5 mr-2" />
                  {t("banking.coldStorage")}
                </CardTitle>
                <CardDescription>{t("banking.securelyStore")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 p-3 bg-background rounded-md">
                  <div className="p-3 bg-primary/20 rounded-full">
                    <Database className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{t("banking.coldWalletStorage")}</p>
                    <p className="text-xs text-muted-foreground">{t("banking.transferFunds")}</p>
                  </div>
                  <Button className="shrink-0" onClick={() => setShowColdWallet(true)}>
                    {t("banking.access")}
                  </Button>
                </div>
                <div className="flex items-center gap-4 p-3 bg-background rounded-md">
                  <div className="p-3 bg-primary/20 rounded-full">
                    <Send className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{t("banking.offlineTransfer")}</p>
                    <p className="text-xs text-muted-foreground">{t("banking.transferBetweenAccounts")}</p>
                  </div>
                  <Button className="shrink-0" onClick={() => setShowColdWallet(true)}>
                    {t("banking.transfer")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Bottom Navigation Bar */}
        <div className="fixed bottom-0 left-0 right-0 h-16 grid grid-cols-6 bg-background border-t">
          <button
            onClick={() => handleBottomNavigation("home")}
            className="flex flex-col items-center justify-center text-muted-foreground hover:text-foreground"
          >
            <UserCircle className="h-5 w-5" />
            <span className="text-xs">{t("nav.home")}</span>
          </button>
          <button
            onClick={() => handleBottomNavigation("activity")}
            className="flex flex-col items-center justify-center text-muted-foreground hover:text-foreground"
          >
            <Activity className="h-5 w-5" />
            <span className="text-xs">{t("nav.activity")}</span>
          </button>
          <button className="flex flex-col items-center justify-center text-primary">
            <Bank className="h-5 w-5" />
            <span className="text-xs">{t("nav.banking")}</span>
          </button>
          <button
            onClick={() => handleBottomNavigation("terminal")}
            className="flex flex-col items-center justify-center text-muted-foreground hover:text-foreground"
          >
            <Terminal className="h-5 w-5" />
            <span className="text-xs">{t("nav.terminal")}</span>
          </button>
          <button
            onClick={() => handleBottomNavigation("assets")}
            className="flex flex-col items-center justify-center text-muted-foreground hover:text-foreground"
          >
            <Coins className="h-5 w-5" />
            <span className="text-xs">{t("nav.assets")}</span>
          </button>
          <button
            onClick={() => handleBottomNavigation("settings")}
            className="flex flex-col items-center justify-center text-muted-foreground hover:text-foreground"
          >
            <Settings className="h-5 w-5" />
            <span className="text-xs">{t("nav.settings")}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
