"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { useUser } from "@/components/user-provider"
import { useColdWalletSync } from "@/hooks/use-cold-wallet-sync"
import { ArrowRight, RefreshCw, AlertCircle, Check, Database, Send } from "lucide-react"
import type { StorageDevice } from "@/components/cold-wallet/device-detector"
import type { ColdWalletTransaction } from "@/components/cold-wallet/transaction-history"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

interface OfflineTransferProps {
  device: StorageDevice
  coldWalletBalance: string
  onTransferComplete: (transaction: ColdWalletTransaction) => void
}

export function OfflineTransfer({ device, coldWalletBalance, onTransferComplete }: OfflineTransferProps) {
  const [amount, setAmount] = useState("")
  const [recipient, setRecipient] = useState("")
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<"idle" | "success" | "error" | "processing">("idle")
  const [errorMessage, setErrorMessage] = useState("")
  const { toast } = useToast()
  const { contacts, currentUser, withdrawFunds } = useUser()
  const { createPendingTransfer } = useColdWalletSync()

  const handleTransfer = async () => {
    if (!amount || Number.parseFloat(amount) <= 0) {
      setErrorMessage("Please enter a valid amount")
      return
    }

    if (!recipient) {
      setErrorMessage("Please select a recipient")
      return
    }

    if (Number.parseFloat(amount) > Number.parseFloat(coldWalletBalance)) {
      setErrorMessage("Insufficient funds in your Cold Wallet")
      return
    }

    setLoading(true)
    setStatus("processing")
    setErrorMessage("")

    try {
      // First withdraw from cold wallet
      const amountNum = Number.parseFloat(amount)

      // Withdraw from user account to simulate moving to cold wallet
      const withdrawSuccess = await withdrawFunds(amountNum, "Offline Transfer")

      if (!withdrawSuccess) {
        throw new Error("Failed to withdraw funds for offline transfer")
      }

      // Create pending transfer
      const transferId = await createPendingTransfer(recipient, amountNum, device.id)

      if (!transferId) {
        throw new Error("Failed to create offline transfer")
      }

      // Create transaction record
      const newTransaction: ColdWalletTransaction = {
        id: transferId,
        type: "withdraw",
        amount: amountNum,
        date: new Date().toISOString(),
        status: "completed",
        description: `Offline transfer to ${contacts.find((c) => c.id === recipient)?.name || "Unknown"}`,
      }

      // Notify parent component
      onTransferComplete(newTransaction)

      setStatus("success")
      toast({
        title: "Offline Transfer Initiated",
        description: "Connect this device to the recipient's account to complete the transfer",
      })

      // Reset form
      setAmount("")
      setRecipient("")
    } catch (error) {
      console.error("Error initiating offline transfer:", error)
      setStatus("error")
      setErrorMessage("Failed to initiate offline transfer")

      toast({
        title: "Transfer Failed",
        description: "Failed to initiate offline transfer",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Offline Transfer</h3>
        <Badge variant="outline" className="bg-primary/10 text-primary">
          <Database className="h-3 w-3 mr-1" />
          No Internet Required
        </Badge>
      </div>

      <div className="bg-primary/5 p-4 rounded-lg mb-4 border border-primary/20">
        <div className="flex items-center mb-2">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mr-3">
            <Send className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-medium">Secure Offline Transfers</p>
            <p className="text-sm text-muted-foreground">Transfer funds securely without an internet connection</p>
          </div>
        </div>
        <p className="text-sm">The recipient will need to connect this device to their account to receive the funds.</p>
      </div>

      {errorMessage && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 px-4 py-3 rounded-md flex items-start mb-4">
          <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
          <p>{errorMessage}</p>
        </div>
      )}

      {status === "processing" && (
        <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 px-4 py-3 rounded-md mb-4">
          <div className="flex items-start mb-2">
            <RefreshCw className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0 animate-spin" />
            <p>Processing your transfer...</p>
          </div>
          <div className="w-full bg-blue-200 dark:bg-blue-800 h-2 rounded-full">
            <div className="bg-blue-600 dark:bg-blue-400 h-2 rounded-full animate-pulse" style={{ width: "60%" }}></div>
          </div>
        </div>
      )}

      {status === "success" && (
        <div className="bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 px-4 py-3 rounded-md flex items-start mb-4">
          <Check className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
          <p>Offline transfer initiated successfully</p>
        </div>
      )}

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="recipient">Recipient</Label>
          <Select value={recipient} onValueChange={setRecipient}>
            <SelectTrigger id="recipient">
              <SelectValue placeholder="Select recipient" />
            </SelectTrigger>
            <SelectContent>
              {contacts.map((contact) => (
                <SelectItem key={contact.id} value={contact.id}>
                  {contact.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
              required
            />
          </div>
        </div>

        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4">
            <div className="flex justify-between mb-3">
              <p className="text-sm font-medium">Current Storage Balance:</p>
              <p className="font-bold text-primary">${coldWalletBalance}</p>
            </div>
            <Button
              className="w-full bg-primary hover:bg-primary/90"
              onClick={handleTransfer}
              disabled={loading || !amount || !recipient}
            >
              {loading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  Initiate Offline Transfer
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
