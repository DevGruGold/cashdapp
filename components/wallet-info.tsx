"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Copy, ExternalLink, RefreshCw, LogOut, AlertTriangle } from "lucide-react"
import { useWeb3Auth } from "./web3auth-provider"
import { useToast } from "@/hooks/use-toast"
import { useLanguage } from "./language-provider"

export function WalletInfo() {
  const { address, ethBalance, xmrtBalance, userInfo, isCorrectNetwork, logout, switchToSepolia, refreshBalances } =
    useWeb3Auth()
  const { toast } = useToast()
  const { t } = useLanguage()
  const [isRefreshing, setIsRefreshing] = useState(false)

  const copyAddress = async () => {
    if (address) {
      await navigator.clipboard.writeText(address)
      toast({
        title: "Address Copied",
        description: "Wallet address copied to clipboard",
      })
    }
  }

  const openEtherscan = () => {
    if (address) {
      window.open(`https://sepolia.etherscan.io/address/${address}`, "_blank")
    }
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await refreshBalances()
    setIsRefreshing(false)
    toast({
      title: "Balances Updated",
      description: "Your wallet balances have been refreshed",
    })
  }

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  if (!isCorrectNetwork) {
    return (
      <Card className="border-red-500 bg-red-50 dark:bg-red-950/20">
        <CardHeader>
          <CardTitle className="flex items-center text-red-700 dark:text-red-300">
            <AlertTriangle className="mr-2 h-5 w-5" />
            Wrong Network
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-600 dark:text-red-400 mb-4">
            You're not connected to Sepolia testnet. Please switch networks to continue.
          </p>
          <div className="flex gap-2">
            <Button onClick={switchToSepolia} className="flex-1">
              Switch to Sepolia
            </Button>
            <Button variant="outline" onClick={logout}>
              Disconnect
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Wallet Connected</span>
          <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            Sepolia
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* User Info */}
        {userInfo && (
          <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
            {userInfo.profileImage && (
              <img src={userInfo.profileImage || "/placeholder.svg"} alt="Profile" className="w-10 h-10 rounded-full" />
            )}
            <div>
              <p className="font-medium">{userInfo.name || userInfo.email}</p>
              <p className="text-sm text-muted-foreground">{userInfo.email}</p>
            </div>
          </div>
        )}

        {/* Wallet Address */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Wallet Address</label>
          <div className="flex items-center space-x-2">
            <code className="flex-1 p-2 bg-muted rounded text-sm">
              {address ? formatAddress(address) : "Loading..."}
            </code>
            <Button size="sm" variant="outline" onClick={copyAddress}>
              <Copy className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="outline" onClick={openEtherscan}>
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Balances */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-medium">ETH Balance</label>
            <p className="text-2xl font-bold">{Number.parseFloat(ethBalance).toFixed(4)}</p>
            <p className="text-xs text-muted-foreground">Sepolia ETH</p>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">XMRT Balance</label>
            <p className="text-2xl font-bold">{Number.parseFloat(xmrtBalance).toFixed(2)}</p>
            <p className="text-xs text-muted-foreground">XMRT Tokens</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-4">
          <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing} className="flex-1 bg-transparent">
            {isRefreshing ? (
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            Refresh
          </Button>
          <Button variant="outline" onClick={logout}>
            <LogOut className="mr-2 h-4 w-4" />
            Disconnect
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
