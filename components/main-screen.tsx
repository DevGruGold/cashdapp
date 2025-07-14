"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SendMoneyDialog } from "@/components/send-money-dialog"
import { RequestMoneyDialog } from "@/components/request-money-dialog"
import { AddFundsDialog } from "@/components/add-funds-dialog"
import { useUser } from "@/components/user-provider"
import { TokenizeAssetDialog } from "@/components/tokenize-asset-dialog"
import { useLanguage } from "./language-provider"
import { useWallet } from "./wallet-provider"
import { formatAddress } from "@/lib/utils"

export function MainScreen() {
  const { currentUser } = useUser()
  const { isConnected, address, balance, chainId } = useWallet()
  const [showSendDialog, setShowSendDialog] = useState(false)
  const [showRequestDialog, setShowRequestDialog] = useState(false)
  const [showAddFundsDialog, setShowAddFundsDialog] = useState(false)
  const [showTokenizeDialog, setShowTokenizeDialog] = useState(false)
  const { t } = useLanguage()

  return (
    <div className="flex flex-col min-h-screen p-4 space-y-4 pb-20">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{t("nav.home")}</h1>
      </div>

      {isConnected && (
        <Card className="bg-green-500/10 border-green-500">
          <CardHeader>
            <CardTitle>Wallet Connected</CardTitle>
            <CardDescription>Address: {address && formatAddress(address)}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Balance: ${balance}</div>
            <div className="text-sm text-muted-foreground">Chain ID: {chainId}</div>
          </CardContent>
        </Card>
      )}

      <Card className="bg-primary/10 border-primary">
        <CardHeader>
          <CardTitle>{t("home.balance")}</CardTitle>
          <CardDescription>{currentUser?.name}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">${currentUser?.balance.toFixed(2)}</div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => setShowSendDialog(true)}>
            {t("common.send")}
          </Button>
          <Button variant="outline" onClick={() => setShowRequestDialog(true)}>
            {t("common.receive")}
          </Button>
          <Button variant="outline" onClick={() => setShowAddFundsDialog(true)}>
            {t("common.add")}
          </Button>
        </CardFooter>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>{t("home.sendMoney")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Send money to friends, family, or businesses instantly.</p>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={() => setShowSendDialog(true)}>
              {t("common.send")}
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("home.requestMoney")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Request money from friends, family, or customers.</p>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={() => setShowRequestDialog(true)}>
              {t("common.receive")}
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("home.addFunds")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Add funds to your account from a bank or card.</p>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={() => setShowAddFundsDialog(true)}>
              {t("common.add")}
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("assets.tokenize")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Convert physical assets into digital tokens.</p>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={() => setShowTokenizeDialog(true)}>
              Tokenize
            </Button>
          </CardFooter>
        </Card>
      </div>

      {showSendDialog && <SendMoneyDialog open={showSendDialog} onOpenChange={setShowSendDialog} />}
      {showRequestDialog && <RequestMoneyDialog open={showRequestDialog} onOpenChange={setShowRequestDialog} />}
      {showAddFundsDialog && <AddFundsDialog open={showAddFundsDialog} onOpenChange={setShowAddFundsDialog} />}
      {showTokenizeDialog && <TokenizeAssetDialog open={showTokenizeDialog} onOpenChange={setShowTokenizeDialog} />}
    </div>
  )
}


