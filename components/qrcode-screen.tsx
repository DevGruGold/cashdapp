"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useWallet } from "@/components/wallet-provider"
import { QRCodeSVG } from "qrcode.react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

export function QRCodeScreen() {
  const { address } = useWallet()
  const [activeTab, setActiveTab] = useState("myCode")
  const [scannedAddress, setScannedAddress] = useState("")
  const [amount, setAmount] = useState("")
  const { toast } = useToast()

  // Simulate QR code scanning
  const handleScan = () => {
    // In a real app, this would use the device camera to scan a QR code
    // For demo purposes, we'll just set a random address
    const demoAddress = "0x" + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join("")

    setScannedAddress(demoAddress)
    setActiveTab("scanResult")

    toast({
      title: "QR Code Scanned",
      description: "Address detected successfully",
    })
  }

  const handleSend = () => {
    if (!amount || Number.parseFloat(amount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount",
        variant: "destructive",
      })
      return
    }

    // In a real app, this would initiate a blockchain transaction
    toast({
      title: "Transaction Initiated",
      description: `Sending $${amount} to ${scannedAddress.substring(0, 6)}...${scannedAddress.substring(38)}`,
    })

    // Reset and go back to my code
    setTimeout(() => {
      setActiveTab("myCode")
      setScannedAddress("")
      setAmount("")
    }, 2000)
  }

  return (
    <div className="flex flex-col min-h-screen p-4 space-y-4">
      <h1 className="text-2xl font-bold">QR Code</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="myCode">My Code</TabsTrigger>
          <TabsTrigger value="scan">Scan</TabsTrigger>
        </TabsList>

        <TabsContent value="myCode" className="space-y-4">
          <Card>
            <CardContent className="p-6 flex flex-col items-center justify-center space-y-4">
              <div className="bg-white p-4 rounded-lg">
                <QRCodeSVG
                  value={address || "No wallet connected"}
                  size={200}
                  bgColor={"#ffffff"}
                  fgColor={"#000000"}
                  level={"L"}
                  includeMargin={false}
                />
              </div>
              <p className="text-sm text-center text-muted-foreground">Scan this code to send money to me</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scan" className="space-y-4">
          <Card>
            <CardContent className="p-6 flex flex-col items-center justify-center space-y-4">
              <div className="w-full aspect-square bg-muted rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Camera preview would appear here</p>
              </div>
              <Button onClick={handleScan} className="w-full">
                Scan QR Code
              </Button>
              <p className="text-sm text-center text-muted-foreground">Position the QR code within the frame to scan</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scanResult" className="space-y-4">
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="address">Recipient Address</Label>
                <Input id="address" value={scannedAddress} readOnly />
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Amount (USD)</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <span className="text-muted-foreground">$</span>
                  </div>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    className="pl-7"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
              </div>

              <Button onClick={handleSend} className="w-full">
                Send Payment
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
