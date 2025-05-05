import { loadStripe } from "@stripe/stripe-js"

// Use the existing environment variable
export const getStripe = async () => {
  const publishableKey = process.env.STRIPE_PUBLISHABLE_KEY

  if (!publishableKey) {
    console.error("Missing Stripe publishable key")
    throw new Error("Missing Stripe publishable key")
  }

  const stripePromise = loadStripe(publishableKey)
  return stripePromise
}
