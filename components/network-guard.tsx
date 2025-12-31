"use client"

import type { ReactNode } from "react"
import { useWeb3Auth } from "./web3auth-provider"
import { TestnetBanner } from "./testnet-banner"
import { WalletInfo } from "./wallet-info"

interface NetworkGuardProps {
  children: ReactNode
}

export function NetworkGuard({ children }: NetworkGuardProps) {
  const { isConnected, isCorrectNetwork, isLoading } = useWeb3Auth()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!isConnected) {
    return children
  }

  return (
    <div className="space-y-4">
      <TestnetBanner />
      {!isCorrectNetwork ? (
        <div className="container mx-auto p-4">
          <WalletInfo />
        </div>
      ) : (
        <>
          <div className="container mx-auto px-4">
            <WalletInfo />
          </div>
          {children}
        </>
      )}
    </div>
  )
}
