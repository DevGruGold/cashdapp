"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  ArrowLeft,
  Bluetooth,
  Printer,
  Check,
  X,
  UserCircle,
  Activity,
  Coins,
  Settings,
  BanknoteIcon as Bank,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { BluetoothScanner, type BluetoothDevice } from "@/components/pos/bluetooth-scanner"
import { Terminal } from "lucide-react"

interface POSTerminalProps {
  onBack: () => void
}

export function POSTerminal({ onBack }: POSTerminalProps) {
  const [device, setDevice] = useState<BluetoothDevice | null>(null)
  const [amount, setAmount] = useState("")
  const [processing, setProcessing] = useState(false)
  const [transactionStatus, setTransactionStatus] = useState<"idle" | "processing" | "success" | "failed">("idle")
  const { toast } = useToast()

  const handleDeviceDetected = async (detectedDevice: BluetoothDevice) => {
    // Simulate connecting to the device
    setDevice({ ...detectedDevice, connected: true })

    toast({
      title: "Device Connected",
      description: `Connected to ${detectedDevice.name}`,
    })
  }

  const handleProcessPayment = async () => {
    if (!device) {
      toast({
        title: "No Device Connected",
        description: "Please connect a POS terminal or card reader first",
        variant: "destructive",
      })
      return
    }

    if (!amount || Number.parseFloat(amount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount",
        variant: "destructive",
      })
      return
    }

    setProcessing(true)
    setTransactionStatus("processing")

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 3000))

      // 90% chance of success
      const success = Math.random() < 0.9

      if (success) {
        setTransactionStatus("success")
        toast({
          title: "Payment Successful",
          description: `$${amount} has been processed successfully`,
        })
      } else {
        setTransactionStatus("failed")
        toast({
          title: "Payment Failed",
          description: "The payment could not be processed. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error processing payment:", error)
      setTransactionStatus("failed")
      toast({
        title: "Payment Error",
        description: "An error occurred while processing the payment",
        variant: "destructive",
      })
    } finally {
      setProcessing(false)
    }
  }

  const handleDisconnect = () => {
    setDevice(null)
    setTransactionStatus("idle")

    toast({
      title: "Device Disconnected",
      description: "The Bluetooth device has been disconnected",
    })
  }

  const handleReset = () => {
    setAmount("")
    setTransactionStatus("idle")
  }

  return (
    <div className="flex flex-col min-h-screen p-4 pb-20">
      <div className="flex justify-between items-center mb-4">
        <Button variant="ghost" className="w-fit p-0" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Banking
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>POS Terminal</CardTitle>
          <CardDescription>Process payments using a Bluetooth POS terminal or card reader</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!device ? (
            <BluetoothScanner onDeviceDetected={handleDeviceDetected} />
          ) : (
            <>
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div className="flex items-center">
                  <Bluetooth className="h-8 w-8 mr-3 text-primary" />
                  <div>
                    <p className="font-medium">{device.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {device.type === "pos"
                        ? "POS Terminal"
                        : device.type === "card-reader"
                          ? "Card Reader"
                          : device.type === "printer"
                            ? "Receipt Printer"
                            : "Bluetooth Device"}
                      {" • "}
                      <span className="text-green-500">Connected</span>
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={handleDisconnect}>
                  <X className="h-4 w-4 mr-1" />
                  Disconnect
                </Button>
              </div>

              {transactionStatus === "idle" && (
                <div className="space-y-4">
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
                        required
                      />
                    </div>
                  </div>

                  <Button className="w-full" onClick={handleProcessPayment}>
                    Process Payment
                  </Button>
                </div>
              )}

              {transactionStatus === "processing" && (
                <div className="flex flex-col items-center justify-center py-8 space-y-4">
                  <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                  <p className="text-lg font-medium">Processing Payment</p>
                  <p className="text-sm text-muted-foreground text-center">
                    Please wait while we process your payment of ${amount}
                  </p>
                </div>
              )}

              {transactionStatus === "success" && (
                <div className="flex flex-col items-center justify-center py-8 space-y-4">
                  <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Check className="h-6 w-6 text-green-600" />
                  </div>
                  <p className="text-lg font-medium">Payment Successful</p>
                  <p className="text-sm text-muted-foreground text-center">${amount} has been processed successfully</p>
                  <div className="flex space-x-2 w-full">
                    <Button variant="outline" className="flex-1" onClick={handleReset}>
                      New Payment
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        // Simulate printing receipt
                        toast({
                          title: "Receipt Printed",
                          description: "The receipt has been sent to the printer",
                        })
                      }}
                    >
                      <Printer className="h-4 w-4 mr-2" />
                      Print Receipt
                    </Button>
                  </div>
                </div>
              )}

              {transactionStatus === "failed" && (
                <div className="flex flex-col items-center justify-center py-8 space-y-4">
                  <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
                    <X className="h-6 w-6 text-red-600" />
                  </div>
                  <p className="text-lg font-medium">Payment Failed</p>
                  <p className="text-sm text-muted-foreground text-center">
                    The payment could not be processed. Please try again.
                  </p>
                  <Button className="w-full" onClick={handleReset}>
                    Try Again
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
        <CardFooter className="flex flex-col text-sm text-muted-foreground border-t p-4">
          <p className="mb-2 font-medium">Supported Devices</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Square Terminal</li>
            <li>Card Readers</li>
            <li>Receipt Printers</li>
            <li>Other Bluetooth POS devices</li>
          </ul>
        </CardFooter>
      </Card>

      {/* Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 h-16 grid grid-cols-6 bg-background border-t">
        <button
          onClick={() => onBack()}
          className="flex flex-col items-center justify-center text-muted-foreground hover:text-foreground"
        >
          <UserCircle className="h-5 w-5" />
          <span className="text-xs">Home</span>
        </button>
        <button
          onClick={() => onBack()}
          className="flex flex-col items-center justify-center text-muted-foreground hover:text-foreground"
        >
          <Activity className="h-5 w-5" />
          <span className="text-xs">Activity</span>
        </button>
        <button className="flex flex-col items-center justify-center text-primary">
          <Bank className="h-5 w-5" />
          <span className="text-xs">Banking</span>
        </button>
        <button
          onClick={() => onBack()}
          className="flex flex-col items-center justify-center text-muted-foreground hover:text-foreground"
        >
          <Terminal className="h-5 w-5" />
          <span className="text-xs">Terminal</span>
        </button>
        <button
          onClick={() => onBack()}
          className="flex flex-col items-center justify-center text-muted-foreground hover:text-foreground"
        >
          <Coins className="h-5 w-5" />
          <span className="text-xs">Assets</span>
        </button>
        <button
          onClick={() => onBack()}
          className="flex flex-col items-center justify-center text-muted-foreground hover:text-foreground"
        >
          <Settings className="h-5 w-5" />
          <span className="text-xs">Settings</span>
        </button>
      </div>
    </div>
  )
}
