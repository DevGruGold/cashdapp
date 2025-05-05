import { NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
})

export const runtime = "edge"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const paymentIntent = searchParams.get("payment_intent")

    if (!paymentIntent) {
      return NextResponse.json({ error: "Payment intent ID is required" }, { status: 400 })
    }

    const intent = await stripe.paymentIntents.retrieve(paymentIntent)

    return NextResponse.json({
      status: intent.status,
      amount: intent.amount / 100,
      currency: intent.currency,
      metadata: intent.metadata,
    })
  } catch (error) {
    console.error("Error checking payment status:", error)
    return NextResponse.json({ error: "Error checking payment status" }, { status: 500 })
  }
}
