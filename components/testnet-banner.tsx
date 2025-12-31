"use client"

import { AlertTriangle, ExternalLink } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { useLanguage } from "./language-provider"

export function TestnetBanner() {
  const { t } = useLanguage()

  const openFaucet = () => {
    window.open("https://sepoliafaucet.com/", "_blank")
  }

  return (
    <Alert className="border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20 mb-4">
      <AlertTriangle className="h-4 w-4 text-yellow-600" />
      <AlertDescription className="flex items-center justify-between w-full">
        <span className="text-yellow-800 dark:text-yellow-200 font-medium">
          🚨 Testnet Only: No real funds at risk - Sepolia Ethereum Testnet
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={openFaucet}
          className="ml-4 border-yellow-500 text-yellow-700 hover:bg-yellow-100 dark:text-yellow-300 dark:hover:bg-yellow-900/20 bg-transparent"
        >
          Get Test ETH
          <ExternalLink className="ml-1 h-3 w-3" />
        </Button>
      </AlertDescription>
    </Alert>
  )
}
