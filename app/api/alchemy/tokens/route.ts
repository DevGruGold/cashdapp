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
    const tokenBalances = await alchemy.core.getTokenBalances(address)

    return NextResponse.json(tokenBalances)
  } catch (error) {
    console.error("Error fetching token balances:", error)
    return NextResponse.json({ error: "Error fetching token balances" }, { status: 500 })
  }
}
