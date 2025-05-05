"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useUser } from "@/components/user-provider"
import { useColdWalletSync } from "@/hooks/use-cold-wallet-sync"
import { Clock, Check, X, RefreshCw, AlertCircle } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import type { ColdWalletTransaction } from "@/components/cold-wallet/transaction-history"
import { Badge } from "@/components/ui/badge"

interface PendingTransfersProps {
  deviceId: string
  onTransferComplete: (transaction: ColdWalletTransaction) => void
}

export function PendingTransfers({ deviceId, onTransferComplete }: PendingTransfersProps) {
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const { toast } = useToast()
  const { contacts, currentUser, depositFunds } = useUser()
  const { pendingTransfers, completePendingTransfer, cancelPendingTransfer, refreshPendingTransfers } =
    useColdWalletSync()

  // Filter transfers for this device
  const deviceTransfers = pendingTransfers.filter((transfer) => transfer.deviceId === deviceId)

  const handleAcceptTransfer = async (transferId: string, amount: number, fromUserId: string) => {
    setLoading(true)
    setErrorMessage("")

    try {
      // First deposit to user account
      const depositSuccess = await depositFunds(amount, "Offline Transfer")

      if (!depositSuccess) {
        throw new Error("Failed to deposit funds from offline transfer")
      }

      // Complete the transfer
      const success = await completePendingTransfer(transferId)

      if (!success) {
        throw new Error("Failed to complete offline transfer")
      }

      // Create transaction record
      const newTransaction: ColdWalletTransaction = {
        id: transferId,
        type: "deposit",
        amount,
        date: new Date().toISOString(),
        status: "completed",
        description: `Offline transfer from ${contacts.find((c) => c.id === fromUserId)?.name || "Unknown"}`,
      }

      // Notify parent component
      onTransferComplete(newTransaction)

      toast({
        title: "Transfer Completed",
        description: `You've received ${formatCurrency(amount)} via offline transfer`,
      })
    } catch (error) {
      console.error("Error accepting offline transfer:", error)
      setErrorMessage("Failed to accept offline transfer")

      toast({
        title: "Transfer Failed",
        description: "Failed to accept offline transfer",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleRejectTransfer = async (transferId: string) => {
    setLoading(true)
    setErrorMessage("")

    try {
      const success = await cancelPendingTransfer(transferId)

      if (!success) {
        throw new Error("Failed to reject offline transfer")
      }

      toast({
        title: "Transfer Rejected",
        description: "The offline transfer has been rejected",
      })
    } catch (error) {
      console.error("Error rejecting offline transfer:", error)
      setErrorMessage("Failed to reject offline transfer")

      toast({
        title: "Rejection Failed",
        description: "Failed to reject offline transfer",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (deviceTransfers.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Pending Transfers</h3>
          <Button variant="outline" size="sm" onClick={refreshPendingTransfers} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-1 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
        <Card>
          <CardContent className="p-4 text-center py-8">
            <p className="text-muted-foreground">No pending transfers for this device</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Pending Transfers</h3>
        <Button variant="outline" size="sm" onClick={refreshPendingTransfers} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-1 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {errorMessage && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 px-4 py-3 rounded-md flex items-start mb-4">
          <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
          <p>{errorMessage}</p>
        </div>
      )}

      {deviceTransfers.map((transfer) => {
        const fromContact = contacts.find((c) => c.id === transfer.fromUserId)

        return (
          <Card key={transfer.id} className="border-primary/40 shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center">
                      <p className="font-medium">Offline Transfer</p>
                      <Badge className="ml-2 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                        Pending
                      </Badge>
                    </div>
                    <p className="text-sm">From: {fromContact?.name || "Unknown"}</p>
                    <p className="text-xs text-muted-foreground">{new Date(transfer.createdAt).toLocaleString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-green-500 text-xl">+{formatCurrency(transfer.amount)}</p>
                  <p className="text-xs text-muted-foreground">Awaiting acceptance</p>
                </div>
              </div>

              <div className="p-3 bg-muted/50 rounded-md mb-4">
                <p className="text-sm text-center">Connect your device to accept this offline transfer</p>
              </div>

              <div className="flex space-x-2">
                <Button
                  className="flex-1"
                  onClick={() => handleAcceptTransfer(transfer.id, transfer.amount, transfer.fromUserId)}
                  disabled={loading}
                >
                  {loading ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <Check className="h-4 w-4 mr-2" />}
                  Accept Transfer
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => handleRejectTransfer(transfer.id)}
                  disabled={loading}
                >
                  <X className="h-4 w-4 mr-2" />
                  Reject
                </Button>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
