"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { ethers } from "ethers"
import { web3auth } from "@/lib/web3auth-config"
import { getXMRTContract } from "@/lib/xmrt-contract"
import { useToast } from "@/hooks/use-toast"

interface Web3AuthContextType {
  isConnected: boolean
  isLoading: boolean
  userInfo: any
  address: string | null
  ethBalance: string
  xmrtBalance: string
  provider: ethers.providers.Web3Provider | null
  isCorrectNetwork: boolean
  login: (loginProvider?: string) => Promise<void>
  logout: () => Promise<void>
  switchToSepolia: () => Promise<void>
  refreshBalances: () => Promise<void>
}

const Web3AuthContext = createContext<Web3AuthContextType>({
  isConnected: false,
  isLoading: true,
  userInfo: null,
  address: null,
  ethBalance: "0",
  xmrtBalance: "0",
  provider: null,
  isCorrectNetwork: false,
  login: async () => {},
  logout: async () => {},
  switchToSepolia: async () => {},
  refreshBalances: async () => {},
})

export function Web3AuthProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [userInfo, setUserInfo] = useState(null)
  const [address, setAddress] = useState<string | null>(null)
  const [ethBalance, setEthBalance] = useState("0")
  const [xmrtBalance, setXmrtBalance] = useState("0")
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null)
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(false)
  const { toast } = useToast()

  const SEPOLIA_CHAIN_ID = "0xaa36a7"

  useEffect(() => {
    const init = async () => {
      try {
        await web3auth.init()
        if (web3auth.connected) {
          await setupProvider()
        }
      } catch (error) {
        console.error("Web3Auth initialization failed:", error)
        toast({
          title: "Initialization Error",
          description: "Failed to initialize Web3Auth. Please refresh the page.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    init()
  }, [])

  const setupProvider = async () => {
    try {
      const web3authProvider = await web3auth.provider
      if (!web3authProvider) return

      const ethersProvider = new ethers.providers.Web3Provider(web3authProvider)
      setProvider(ethersProvider)

      const signer = ethersProvider.getSigner()
      const userAddress = await signer.getAddress()
      setAddress(userAddress)

      const network = await ethersProvider.getNetwork()
      const isOnSepolia = network.chainId === 11155111
      setIsCorrectNetwork(isOnSepolia)

      if (isOnSepolia) {
        await refreshBalances()
      }

      const user = await web3auth.getUserInfo()
      setUserInfo(user)
      setIsConnected(true)

      if (!isOnSepolia) {
        toast({
          title: "Wrong Network",
          description: "Please switch to Sepolia testnet to use the app.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Provider setup failed:", error)
      toast({
        title: "Setup Error",
        description: "Failed to setup wallet provider.",
        variant: "destructive",
      })
    }
  }

  const login = async (loginProvider = "google") => {
    try {
      setIsLoading(true)
      const web3authProvider = await web3auth.connectTo("openlogin", {
        loginProvider,
      })

      if (web3authProvider) {
        await setupProvider()
        toast({
          title: "Connected Successfully",
          description: "Your wallet has been connected!",
        })
      }
    } catch (error) {
      console.error("Login failed:", error)
      toast({
        title: "Login Failed",
        description: "Failed to connect wallet. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      await web3auth.logout()
      setIsConnected(false)
      setUserInfo(null)
      setAddress(null)
      setEthBalance("0")
      setXmrtBalance("0")
      setProvider(null)
      setIsCorrectNetwork(false)

      toast({
        title: "Disconnected",
        description: "Your wallet has been disconnected.",
      })
    } catch (error) {
      console.error("Logout failed:", error)
      toast({
        title: "Logout Error",
        description: "Failed to disconnect wallet.",
        variant: "destructive",
      })
    }
  }

  const switchToSepolia = async () => {
    try {
      if (!provider) return

      await provider.send("wallet_switchEthereumChain", [{ chainId: SEPOLIA_CHAIN_ID }])

      // If switch fails, try to add the network
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        try {
          await provider!.send("wallet_addEthereumChain", [
            {
              chainId: SEPOLIA_CHAIN_ID,
              chainName: "Sepolia Testnet",
              nativeCurrency: {
                name: "ETH",
                symbol: "ETH",
                decimals: 18,
              },
              rpcUrls: [process.env.NEXT_PUBLIC_ETH_RPC_URL],
              blockExplorerUrls: ["https://sepolia.etherscan.io/"],
            },
          ])
        } catch (addError) {
          console.error("Failed to add Sepolia network:", addError)
          toast({
            title: "Network Error",
            description: "Failed to add Sepolia network. Please add it manually.",
            variant: "destructive",
          })
        }
      } else {
        console.error("Failed to switch to Sepolia:", switchError)
        toast({
          title: "Network Switch Failed",
          description: "Failed to switch to Sepolia testnet.",
          variant: "destructive",
        })
      }
    }
  }

  const refreshBalances = async () => {
    if (!provider || !address || !isCorrectNetwork) return

    try {
      // Get ETH balance
      const ethBal = await provider.getBalance(address)
      setEthBalance(ethers.utils.formatEther(ethBal))

      // Get XMRT balance
      const xmrtContract = getXMRTContract(provider)
      const xmrtBal = await xmrtContract.balanceOf(address)
      const decimals = await xmrtContract.decimals()
      setXmrtBalance(ethers.utils.formatUnits(xmrtBal, decimals))
    } catch (error) {
      console.error("Failed to refresh balances:", error)
    }
  }

  return (
    <Web3AuthContext.Provider
      value={{
        isConnected,
        isLoading,
        userInfo,
        address,
        ethBalance,
        xmrtBalance,
        provider,
        isCorrectNetwork,
        login,
        logout,
        switchToSepolia,
        refreshBalances,
      }}
    >
      {children}
    </Web3AuthContext.Provider>
  )
}

export const useWeb3Auth = () => useContext(Web3AuthContext)
