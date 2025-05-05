"use client"

import { useState, useCallback } from "react"

export function useStripe() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const createPaymentIntent = useCallback(
    async (amount: number, currency = "usd", metadata: Record<string, string> = {}) => {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch("/api/create-payment-intent", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount,
            currency,
            metadata,
          }),
        })

        if (!response.ok) {
          throw new Error("Failed to create payment intent")
        }

        const data = await response.json()
        return data
      } catch (err) {
        console.error("Error creating payment intent:", err)
        setError(err instanceof Error ? err : new Error(String(err)))

        // For demo purposes, return a mock client secret
        return { clientSecret: "pi_mock_" + Math.random().toString(36).substring(2, 15) }
      } finally {
        setLoading(false)
      }
    },
    [],
  )

  const processPayment = useCallback(async (clientSecret: string) => {
    setLoading(true)
    setError(null)

    try {
      // In a real app, this would use Stripe.js to confirm the payment
      // For demo purposes, we'll just simulate a successful payment
      await new Promise((resolve) => setTimeout(resolve, 2000))

      return { success: true }
    } catch (err) {
      console.error("Error processing payment:", err)
      setError(err instanceof Error ? err : new Error(String(err)))
      return { success: false, error: String(err) }
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    loading,
    error,
    createPaymentIntent,
    processPayment,
  }
}
