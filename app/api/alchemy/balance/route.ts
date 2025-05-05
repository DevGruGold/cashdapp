import { NextResponse } from "next/server"
import { Alchemy, Network } from "alchemy-sdk"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const address = searchParams.get("address")

    if (!address) {
      return NextResponse.json({ error: "Address parameter is required" }, { status: 400 })
    }

    const settings = {
      apiKey: process.env.ALCHEMY_API_KEY,
      network: Network.ETH_MAINNET,
    }

    const alchemy = new Alchemy(settings)

    // Get ETH balance
    const ethBalance = await alchemy.core.getBalance(address)
    const balanceInEth = Number.parseFloat(ethBalance.toString()) / 1e18

    // Get ETH price in USD
    // In a real app, you would fetch this from a price API
    const ethPriceInUsd = 3000 // Example price

    const balanceInUsd = balanceInEth * ethPriceInUsd

    return NextResponse.json({
      balance: balanceInUsd.toFixed(2),
    })
  } catch (error) {
    console.error("Error fetching balance:", error)
    return NextResponse.json({ error: "Error fetching balance" }, { status: 500 })
  }
}
