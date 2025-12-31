"use client"

import { AppLayout } from "@/components/app-layout"
import { HomeScreen } from "@/components/home-screen"
import { Web3AuthLogin } from "@/components/web3auth-login"
import { NetworkGuard } from "@/components/network-guard"
import { useWeb3Auth } from "@/components/web3auth-provider"

export default function Page() {
  const { isConnected, isLoading } = useWeb3Auth()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!isConnected) {
    return <Web3AuthLogin />
  }

  return (
    <NetworkGuard>
      <AppLayout hideBottomNav>
        <HomeScreen />
      </AppLayout>
    </NetworkGuard>
  )
}
