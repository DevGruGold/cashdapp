"use client"

import { Button } from "@/components/ui/button"
import { useWallet } from "@/components/wallet-provider"
import { Wallet, LogOut } from "lucide-react"
import { formatAddress } from "@/lib/utils"
import { useState, useEffect } from "react"

interface WalletConnectButtonProps {
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive"
  size?: "default" | "sm" | "lg" | "icon"
}

export function WalletConnectButton({ variant = "default", size = "default" }: WalletConnectButtonProps) {
  const { isConnected, address, connect, disconnect } = useWallet()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleClick = () => {
    if (isConnected) {
      disconnect()
    } else {
      connect()
    }
  }

  if (!mounted) {
    return (
      <Button variant={variant} size={size} disabled>
        <Wallet className="h-4 w-4 mr-2" />
        Loading...
      </Button>
    )
  }

  return (
    <Button variant={variant} size={size} onClick={handleClick}>
      {isConnected ? (
        <>
          <LogOut className="h-4 w-4 mr-2" />
          {address && formatAddress(address)}
        </>
      ) : (
        <>
          <Wallet className="h-4 w-4 mr-2" />
          Connect Wallet
        </>
      )}
    </Button>
  )
}
