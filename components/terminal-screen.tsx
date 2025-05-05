"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { QRCodeScreen } from "@/components/qrcode-screen"
import { NFCScreen } from "@/components/nfc-screen"
import { BluetoothScanner } from "@/components/pos/bluetooth-scanner"
import { StripeTerminal } from "@/components/stripe-terminal"
import { useLanguage } from "./language-provider"

export function TerminalScreen() {
  const [activeTab, setActiveTab] = useState("qrcode")
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")
  const { t } = useLanguage()

  return (
    <div className="flex flex-col min-h-screen p-4 space-y-4 pb-20">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{t("nav.terminal")}</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payment Details</CardTitle>
          <CardDescription>Enter the payment information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="amount">Amount ($)</Label>
            <Input
              id="amount"
              type="number"
              min="0.01"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What's it for?"
            />
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="qrcode">QR Code</TabsTrigger>
          <TabsTrigger value="nfc">NFC</TabsTrigger>
          <TabsTrigger value="bluetooth">Bluetooth</TabsTrigger>
          <TabsTrigger value="stripe">Stripe</TabsTrigger>
        </TabsList>

        <TabsContent value="qrcode" className="space-y-4">
          <QRCodeScreen amount={Number.parseFloat(amount) || 0} description={description} />
        </TabsContent>

        <TabsContent value="nfc" className="space-y-4">
          <NFCScreen amount={Number.parseFloat(amount) || 0} description={description} />
        </TabsContent>

        <TabsContent value="bluetooth" className="space-y-4">
          <BluetoothScanner amount={Number.parseFloat(amount) || 0} description={description} />
        </TabsContent>

        <TabsContent value="stripe" className="space-y-4">
          <StripeTerminal amount={Number.parseFloat(amount) || 0} description={description} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
