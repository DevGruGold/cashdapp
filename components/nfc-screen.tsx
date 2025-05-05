"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

export function NFCScreen() {
  const [isNfcSupported, setIsNfcSupported] = useState<boolean | null>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [contacts, setContacts] = useState<string[]>(["0x1234...5678", "0x8765...4321", "0x9876...5432"])
  const { toast } = useToast()

  useEffect(() => {
    // Check if NFC is supported
    if (typeof window !== "undefined") {
      setIsNfcSupported("NDEFReader" in window)
    }
  }, [])

  const startNfcScan = async () => {
    if (!isNfcSupported) {
      toast({
        title: "NFC not supported",
        description: "Your device does not support NFC",
        variant: "destructive",
      })
      return
    }

    setIsScanning(true)

    try {
      // In a real app, this would use the Web NFC API
      // For demo purposes, we'll simulate finding a device after a delay
      await new Promise((resolve) => setTimeout(resolve, 3000))

      // Simulate finding a device
      const foundAddress = "0x" + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join("")

      // Add to contacts if not already present
      setContacts((prev) => {
        if (!prev.includes(foundAddress)) {
          return [...prev, foundAddress]
        }
        return prev
      })

      toast({
        title: "Device Found",
        description: "Successfully connected with nearby device",
      })
    } catch (error) {
      console.error("NFC error:", error)
      toast({
        title: "Connection failed",
        description: "Failed to connect with nearby device",
        variant: "destructive",
      })
    } finally {
      setIsScanning(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen p-4 space-y-4">
      <h1 className="text-2xl font-bold">Tap to Pay</h1>

      <Card>
        <CardHeader>
          <CardTitle>Nearby Payments</CardTitle>
          <CardDescription>Tap your phone to another CashDapp user to send or request money</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isScanning ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
              <p>Scanning for nearby devices...</p>
              <p className="text-sm text-muted-foreground mt-2">Hold your phone near another CashDapp user</p>
            </div>
          ) : (
            <Button onClick={startNfcScan} className="w-full h-16" disabled={isNfcSupported === false}>
              Tap to Connect
            </Button>
          )}
        </CardContent>
        <CardFooter className="flex flex-col items-start">
          <h3 className="text-sm font-medium mb-2">Your Secure Circle</h3>
          <div className="w-full space-y-2">
            {contacts.map((contact, index) => (
              <Card key={index} className="w-full">
                <CardContent className="p-3 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                      <span className="text-white font-bold text-xs">{contact.substring(0, 1)}</span>
                    </div>
                    <p className="text-sm font-medium">{contact}</p>
                  </div>
                  <Button variant="ghost" size="sm">
                    Send
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
