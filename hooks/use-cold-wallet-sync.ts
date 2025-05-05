"use client"

import { useState, useCallback, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { useUser } from "@/components/user-provider"

interface PendingTransfer {
  id: string
  fromUserId: string
  toUserId: string
  amount: number
  deviceId: string
  status: "pending" | "completed" | "failed"
  createdAt: string
}

export function useColdWalletSync() {
  const [pendingTransfers, setPendingTransfers] = useState<PendingTransfer[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const { toast } = useToast()
  const { currentUser } = useUser()

  // Fetch pending transfers for the current user
  const fetchPendingTransfers = useCallback(async () => {
    if (!currentUser) return

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/cold-wallet?userId=${currentUser.id}`)

      if (!response.ok) {
        throw new Error("Failed to fetch pending transfers")
      }

      const data = await response.json()
      setPendingTransfers(data.transfers || [])
    } catch (err) {
      console.error("Error fetching pending transfers:", err)
      setError(err instanceof Error ? err : new Error(String(err)))
    } finally {
      setLoading(false)
    }
  }, [currentUser])

  // Create a new pending transfer
  const createPendingTransfer = useCallback(
    async (toUserId: string, amount: number, deviceId: string): Promise<string | null> => {
      if (!currentUser) return null

      setLoading(true)
      setError(null)

      try {
        const response = await fetch("/api/cold-wallet", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "create",
            fromUserId: currentUser.id,
            toUserId,
            amount,
            deviceId,
          }),
        })

        if (!response.ok) {
          throw new Error("Failed to create pending transfer")
        }

        const data = await response.json()

        if (data.success) {
          toast({
            title: "Transfer Initiated",
            description:
              "The offline transfer has been initiated. Connect the device to the recipient's account to complete.",
          })
          return data.transferId
        }

        return null
      } catch (err) {
        console.error("Error creating pending transfer:", err)
        setError(err instanceof Error ? err : new Error(String(err)))

        toast({
          title: "Transfer Failed",
          description: "Failed to initiate the offline transfer",
          variant: "destructive",
        })

        return null
      } finally {
        setLoading(false)
      }
    },
    [currentUser, toast],
  )

  // Complete a pending transfer
  const completePendingTransfer = useCallback(
    async (transferId: string): Promise<boolean> => {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch("/api/cold-wallet", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "complete",
            transferId,
          }),
        })

        if (!response.ok) {
          throw new Error("Failed to complete transfer")
        }

        const data = await response.json()

        if (data.success) {
          // Remove from local state
          setPendingTransfers((prev) => prev.filter((t) => t.id !== transferId))

          toast({
            title: "Transfer Completed",
            description: "The offline transfer has been completed successfully",
          })

          return true
        }

        return false
      } catch (err) {
        console.error("Error completing transfer:", err)
        setError(err instanceof Error ? err : new Error(String(err)))

        toast({
          title: "Transfer Failed",
          description: "Failed to complete the offline transfer",
          variant: "destructive",
        })

        return false
      } finally {
        setLoading(false)
      }
    },
    [toast],
  )

  // Cancel a pending transfer
  const cancelPendingTransfer = useCallback(
    async (transferId: string): Promise<boolean> => {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch("/api/cold-wallet", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "cancel",
            transferId,
          }),
        })

        if (!response.ok) {
          throw new Error("Failed to cancel transfer")
        }

        const data = await response.json()

        if (data.success) {
          // Remove from local state
          setPendingTransfers((prev) => prev.filter((t) => t.id !== transferId))

          toast({
            title: "Transfer Cancelled",
            description: "The offline transfer has been cancelled",
          })

          return true
        }

        return false
      } catch (err) {
        console.error("Error cancelling transfer:", err)
        setError(err instanceof Error ? err : new Error(String(err)))

        toast({
          title: "Cancellation Failed",
          description: "Failed to cancel the offline transfer",
          variant: "destructive",
        })

        return false
      } finally {
        setLoading(false)
      }
    },
    [toast],
  )

  // Periodically check for pending transfers
  useEffect(() => {
    if (!currentUser) return

    // Initial fetch
    fetchPendingTransfers()

    // Set up polling
    const intervalId = setInterval(fetchPendingTransfers, 10000) // Check every 10 seconds

    return () => clearInterval(intervalId)
  }, [currentUser, fetchPendingTransfers])

  return {
    pendingTransfers,
    loading,
    error,
    createPendingTransfer,
    completePendingTransfer,
    cancelPendingTransfer,
    refreshPendingTransfers: fetchPendingTransfers,
  }
}
