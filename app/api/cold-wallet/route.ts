import { NextResponse } from "next/server"

// Simple in-memory store for demo purposes
// In a real app, this would be a database
const pendingTransfers: {
  id: string
  fromUserId: string
  toUserId: string
  amount: number
  deviceId: string
  status: "pending" | "completed" | "failed"
  createdAt: string
}[] = []

export const runtime = "edge"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("userId")

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 })
  }

  // Get pending transfers for this user
  const userTransfers = pendingTransfers.filter(
    (transfer) => transfer.toUserId === userId && transfer.status === "pending",
  )

  return NextResponse.json({ transfers: userTransfers })
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const { fromUserId, toUserId, amount, deviceId, action } = data

    if (action === "create") {
      if (!fromUserId || !toUserId || !amount || !deviceId) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
      }

      const transferId = `transfer-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`

      // Create a new pending transfer
      const newTransfer = {
        id: transferId,
        fromUserId,
        toUserId,
        amount,
        deviceId,
        status: "pending" as const,
        createdAt: new Date().toISOString(),
      }

      pendingTransfers.push(newTransfer)

      return NextResponse.json({ success: true, transferId })
    } else if (action === "complete") {
      const { transferId } = data

      if (!transferId) {
        return NextResponse.json({ error: "Transfer ID is required" }, { status: 400 })
      }

      // Find and update the transfer
      const transferIndex = pendingTransfers.findIndex((t) => t.id === transferId)

      if (transferIndex === -1) {
        return NextResponse.json({ error: "Transfer not found" }, { status: 404 })
      }

      pendingTransfers[transferIndex].status = "completed"

      return NextResponse.json({ success: true })
    } else if (action === "cancel") {
      const { transferId } = data

      if (!transferId) {
        return NextResponse.json({ error: "Transfer ID is required" }, { status: 400 })
      }

      // Find and update the transfer
      const transferIndex = pendingTransfers.findIndex((t) => t.id === transferId)

      if (transferIndex === -1) {
        return NextResponse.json({ error: "Transfer not found" }, { status: 404 })
      }

      pendingTransfers[transferIndex].status = "failed"

      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("Error processing request:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
