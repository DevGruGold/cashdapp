"use client"

import { useState, useCallback } from "react"

export function useAlchemy() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const getBalance = useCallback(async (address: string): Promise<string> => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/alchemy/balance?address=${address}`)

      if (!response.ok) {
        throw new Error("Failed to fetch balance")
      }

      const data = await response.json()
      return data.balance
    } catch (err) {
      console.error("Error fetching balance:", err)
      setError(err instanceof Error ? err : new Error(String(err)))
      return "0.00"
    } finally {
      setLoading(false)
    }
  }, [])

  const getTokenBalances = useCallback(async (address: string) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/alchemy/tokens?address=${address}`)

      if (!response.ok) {
        throw new Error("Failed to fetch token balances")
      }

      const data = await response.json()
      return data
    } catch (err) {
      console.error("Error fetching token balances:", err)
      setError(err instanceof Error ? err : new Error(String(err)))
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const sendTransaction = useCallback(async (to: string, value: string) => {
    setLoading(true)
    setError(null)

    try {
      // In a real app, this would call a server action or API route to send a transaction
      // For demo purposes, we'll just simulate a successful transaction
      await new Promise((resolve) => setTimeout(resolve, 2000))

      return {
        success: true,
        hash:
          "0x" +
          Array(64)
            .fill(0)
            .map(() => Math.floor(Math.random() * 16).toString(16))
            .join(""),
      }
    } catch (err) {
      console.error("Error sending transaction:", err)
      setError(err instanceof Error ? err : new Error(String(err)))
      return { success: false, error: String(err) }
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    loading,
    error,
    getBalance,
    getTokenBalances,
    sendTransaction,
  }
}
