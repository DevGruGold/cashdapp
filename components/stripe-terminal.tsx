"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Check } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { loadStripe } from "@stripe/stripe-js"
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { UserCircle, Activity, Coins, Settings, BanknoteIcon as Bank, Terminal } from "lucide-react"

// Initialize Stripe with the existing environment variable
const stripePromise = loadStripe(process.env.STRIPE_PUBLISHABLE_KEY || "")

interface StripeTerminalProps {
  onBack: () => void
  amount: string
  crypto: string
}

// Checkout Form Component
function CheckoutForm({ amount, crypto, onBack }: StripeTerminalProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setLoading(true)

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment-success`,
        },
        redirect: "if_required",
      })

      if (error) {
        toast({
          title: "Payment Failed",
          description: error.message || "An error occurred during payment",
          variant: "destructive",
        })
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        setSuccess(true)
        toast({
          title: "Payment Successful",
          description: `You have successfully purchased ${amount} USD worth of ${crypto}`,
        })
      }
    } catch (error) {
      console.error("Payment error:", error)
      toast({
        title: "Payment Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="space-y-6">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
          <Check className="h-6 w-6 text-green-600" />
        </div>
        <CardTitle className="text-center">Payment Successful</CardTitle>
        <CardDescription className="text-center">
          Your purchase of {amount} USD worth of {crypto} was successful
        </CardDescription>
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
        <Button onClick={onBack} className="w-full">
          Return to Banking
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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

        <PaymentElement />
      </div>

      <div className="flex flex-col space-y-2">
        <Button type="submit" className="w-full" disabled={!stripe || loading}>
          {loading ? "Processing..." : `Pay $${amount}`}
        </Button>
        <Button type="button" variant="outline" className="w-full" onClick={onBack} disabled={loading}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Cancel
        </Button>
      </div>
    </form>
  )
}

export function StripeTerminal({ onBack, amount, crypto }: StripeTerminalProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchPaymentIntent = async () => {
      try {
        setLoading(true)
        const amountInCents = Math.floor(Number.parseFloat(amount) * 100)

        const response = await fetch("/api/create-payment-intent", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: amountInCents,
            currency: "usd",
            metadata: {
              crypto,
            },
          }),
        })

        if (!response.ok) {
          throw new Error("Failed to create payment intent")
        }

        const data = await response.json()
        setClientSecret(data.clientSecret)
      } catch (error) {
        console.error("Error creating payment intent:", error)
        toast({
          title: "Error",
          description: "Failed to initialize payment. Please try again.",
          variant: "destructive",
        })
        onBack()
      } finally {
        setLoading(false)
      }
    }

    fetchPaymentIntent()
  }, [amount, crypto, onBack, toast])

  return (
    <div className="flex flex-col min-h-screen p-4 pb-20">
      <div className="flex justify-between items-center mb-4">
        <Button variant="ghost" className="w-fit p-0" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Complete Your Purchase</CardTitle>
          <CardDescription>
            You are purchasing {amount} USD worth of {crypto}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              <p className="mt-4">Initializing payment...</p>

              {/* Add progress indicator */}
              <div className="w-full bg-muted h-2 rounded-full mt-4">
                <div className="bg-primary h-2 rounded-full animate-pulse" style={{ width: "40%" }}></div>
              </div>
            </div>
          ) : clientSecret ? (
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <CheckoutForm amount={amount} crypto={crypto} onBack={onBack} />
            </Elements>
          ) : (
            <div className="text-center text-red-500">Failed to initialize payment. Please try again.</div>
          )}
        </CardContent>
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
