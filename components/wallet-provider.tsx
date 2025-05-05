"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"

// Define wallet context type
type WalletContextType = {
  isConnected: boolean
  address: string | null
  balance: string
  connect: () => Promise<void>
  disconnect: () => void
  chainId: number | null
  switchChain: (chainId: number) => Promise<void>
}

// Create context with default values
const WalletContext = createContext<WalletContextType>({
  isConnected: false,
  address: null,
  balance: "0.00",
  connect: async () => {},
  disconnect: () => {},
  chainId: null,
  switchChain: async () => {},
})

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [isConnected, setIsConnected] = useState(false)
  const [address, setAddress] = useState<string | null>(null)
  const [balance, setBalance] = useState("0.00")
  const [chainId, setChainId] = useState<number | null>(null)
  const { toast } = useToast()

  // Check if ethereum is available
  const checkEthereumAvailability = () => {
    return typeof window !== "undefined" && window.ethereum !== undefined
  }

  // Connect wallet function
  const connect = async () => {
    if (!checkEthereumAvailability()) {
      toast({
        title: "No Ethereum Provider",
        description: "Please install MetaMask or another Web3 wallet",
        variant: "destructive",
      })
      return
    }

    try {
      // Request accounts
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
      const chainIdHex = await window.ethereum.request({ method: "eth_chainId" })

      if (accounts.length > 0) {
        setAddress(accounts[0])
        setIsConnected(true)
        setChainId(Number.parseInt(chainIdHex, 16))

        // Get balance
        const balanceHex = await window.ethereum.request({
          method: "eth_getBalance",
          params: [accounts[0], "latest"],
        })

        const ethBalance = Number.parseInt(balanceHex, 16) / 1e18
        // Mock conversion to USD
        const ethPriceInUsd = 3000
        const balanceInUsd = ethBalance * ethPriceInUsd
        setBalance(balanceInUsd.toFixed(2))
      }

      toast({
        title: "Wallet Connected",
        description: "Your wallet has been connected successfully",
      })
    } catch (error) {
      console.error("Connection error:", error)
      toast({
        title: "Connection Failed",
        description: "Please try again or continue without a wallet",
        variant: "destructive",
      })
    }
  }

  // Disconnect wallet function
  const disconnect = () => {
    setIsConnected(false)
    setAddress(null)
    setBalance("0.00")
    setChainId(null)

    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected",
    })
  }

  // Switch chain function
  const switchChain = async (newChainId: number) => {
    if (!checkEthereumAvailability() || !isConnected) return

    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${newChainId.toString(16)}` }],
      })

      setChainId(newChainId)

      toast({
        title: "Network Changed",
        description: "Successfully switched to the new network",
      })
    } catch (error) {
      console.error("Network switch error:", error)
      toast({
        title: "Network Switch Failed",
        description: "Failed to switch networks",
        variant: "destructive",
      })
    }
  }

  // Listen for account and chain changes
  useEffect(() => {
    if (checkEthereumAvailability()) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          // User disconnected their wallet
          disconnect()
        } else if (accounts[0] !== address) {
          setAddress(accounts[0])
        }
      }

      const handleChainChanged = (chainIdHex: string) => {
        setChainId(Number.parseInt(chainIdHex, 16))
      }

      window.ethereum.on("accountsChanged", handleAccountsChanged)
      window.ethereum.on("chainChanged", handleChainChanged)

      // Check if already connected
      window.ethereum
        .request({ method: "eth_accounts" })
        .then((accounts: string[]) => {
          if (accounts.length > 0) {
            connect()
          }
        })
        .catch(console.error)

      // Cleanup
      return () => {
        if (window.ethereum.removeListener) {
          window.ethereum.removeListener("accountsChanged", handleAccountsChanged)
          window.ethereum.removeListener("chainChanged", handleChainChanged)
        }
      }
    }
  }, [address])

  return (
    <WalletContext.Provider
      value={{
        isConnected,
        address,
        balance,
        connect,
        disconnect,
        chainId,
        switchChain,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}

export const useWallet = () => useContext(WalletContext)
