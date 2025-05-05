"use client"

import { Button } from "@/components/ui/button"
import { Wallet } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface FallbackWalletButtonProps {
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive"
  size?: "default" | "sm" | "lg" | "icon"
}

export function FallbackWalletButton({ variant = "default", size = "default" }: FallbackWalletButtonProps) {
  const { toast } = useToast()

  const handleClick = () => {
    toast({
      title: "Wallet Connection",
      description: "Please install MetaMask or another Web3 wallet to connect",
    })
  }

  return (
    <Button variant={variant} size={size} onClick={handleClick}>
      <Wallet className="h-4 w-4 mr-2" />
      Connect Wallet
    </Button>
  )
}
