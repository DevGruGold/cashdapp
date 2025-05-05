"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [paymentStatus, setPaymentStatus] = useState<"success" | "processing" | "failed">("processing")

  useEffect(() => {
    const paymentIntent = searchParams.get("payment_intent")
    const paymentIntentClientSecret = searchParams.get("payment_intent_client_secret")

    if (!paymentIntent || !paymentIntentClientSecret) {
      router.push("/")
      return
    }

    const checkPaymentStatus = async () => {
      try {
        const response = await fetch(`/api/check-payment?payment_intent=${paymentIntent}`)
        const data = await response.json()

        if (data.status === "succeeded") {
          setPaymentStatus("success")
        } else if (data.status === "processing") {
          setPaymentStatus("processing")
        } else {
          setPaymentStatus("failed")
        }
      } catch (error) {
        console.error("Error checking payment status:", error)
        setPaymentStatus("failed")
      } finally {
        setLoading(false)
      }
    }

    checkPaymentStatus()
  }, [router, searchParams])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          {loading ? (
            <div className="flex flex-col items-center">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              <CardTitle className="mt-4 text-center">Processing Payment</CardTitle>
            </div>
          ) : paymentStatus === "success" ? (
            <>
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <Check className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle className="text-center">Payment Successful</CardTitle>
              <CardDescription className="text-center">Your cryptocurrency purchase was successful</CardDescription>
            </>
          ) : paymentStatus === "processing" ? (
            <>
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-yellow-600 border-t-transparent"></div>
              </div>
              <CardTitle className="text-center">Payment Processing</CardTitle>
              <CardDescription className="text-center">Your payment is still being processed</CardDescription>
            </>
          ) : (
            <>
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <span className="text-red-600 text-xl">×</span>
              </div>
              <CardTitle className="text-center">Payment Failed</CardTitle>
              <CardDescription className="text-center">There was an issue processing your payment</CardDescription>
            </>
          )}
        </CardHeader>
        <CardContent>
          {!loading && (
            <div className="rounded-lg bg-muted p-4">
              <div className="flex justify-between">
                <span>Status:</span>
                <span
                  className={
                    paymentStatus === "success"
                      ? "text-green-600"
                      : paymentStatus === "processing"
                        ? "text-yellow-600"
                        : "text-red-600"
                  }
                >
                  {paymentStatus === "success" ? "Completed" : paymentStatus === "processing" ? "Processing" : "Failed"}
                </span>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={() => router.push("/")} className="w-full">
            Return to Home
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
