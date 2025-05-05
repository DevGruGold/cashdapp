"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Check } from "lucide-react"
import { useStripe } from "@/hooks/use-stripe"
import { useRouter } from "next/navigation"

export default function CheckoutPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const clientSecret = searchParams.get("clientSecret")
  const amount = searchParams.get("amount")
  const crypto = searchParams.get("crypto")

  const [loading, setLoading] = useState(true)
  const [success, setSuccess] = useState(false)
  const { processPayment } = useStripe()

  useEffect(() => {
    if (!clientSecret || !amount || !crypto) {
      router.push("/")
      return
    }

    const initializeCheckout = async () => {
      try {
        setLoading(true)

        // In a real app, this would initialize Stripe Elements
        // For demo purposes, we'll simulate a payment after a delay
        await new Promise((resolve) => setTimeout(resolve, 2000))

        setLoading(false)
      } catch (error) {
        console.error("Error initializing checkout:", error)
        router.push("/")
      }
    }

    initializeCheckout()
  }, [clientSecret, amount, crypto, router])

  const handlePayment = async () => {
    if (!clientSecret) return

    try {
      setLoading(true)

      // In a real app, this would process the payment with Stripe
      // For demo purposes, we'll simulate a successful payment
      await processPayment(clientSecret)

      setSuccess(true)
    } catch (error) {
      console.error("Payment error:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleReturn = () => {
    router.push("/")
  }

  if (success) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <Check className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="text-center">Payment Successful</CardTitle>
            <CardDescription className="text-center">
              Your purchase of {amount} USD worth of {crypto} was successful
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-muted p-4">
              <div className="flex justify-between">
                <span>Amount:</span>
                <span>${amount} USD</span>
              </div>
              <div className="flex justify-between">
                <span>Cryptocurrency:</span>
                <span>{crypto}</span>
              </div>
              <div className="flex justify-between">
                <span>Status:</span>
                <span className="text-green-600">Completed</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleReturn} className="w-full">
              Return to Home
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Complete Your Purchase</CardTitle>
          <CardDescription>
            You are purchasing {amount} USD worth of {crypto}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              <p className="mt-4">Processing your payment...</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="rounded-lg bg-muted p-4">
                <div className="flex justify-between">
                  <span>Amount:</span>
                  <span>${amount} USD</span>
                </div>
                <div className="flex justify-between">
                  <span>Cryptocurrency:</span>
                  <span>{crypto}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div id="card-element" className="border rounded-md p-4 bg-background">
                  {/* In a real app, this would be the Stripe Elements card input */}
                  <p className="text-center text-muted-foreground">Card details would appear here</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button onClick={handlePayment} className="w-full" disabled={loading}>
            Pay ${amount}
          </Button>
          <Button variant="outline" className="w-full" onClick={handleReturn} disabled={loading}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Cancel
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
