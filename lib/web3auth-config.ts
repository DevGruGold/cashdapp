import { Web3AuthNoModal } from "@web3auth/no-modal"
import { OpenloginAdapter } from "@web3auth/openlogin-adapter"
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider"
import { CHAIN_NAMESPACES, WEB3AUTH_NETWORK } from "@web3auth/base"

const clientId = process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID!

const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: "0xaa36a7", // Sepolia testnet
  rpcTarget: process.env.NEXT_PUBLIC_ETH_RPC_URL!,
  displayName: "Ethereum Sepolia Testnet",
  blockExplorerUrl: "https://sepolia.etherscan.io/",
  ticker: "ETH",
  tickerName: "Ethereum",
  logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
}

const privateKeyProvider = new EthereumPrivateKeyProvider({
  config: { chainConfig },
})

const web3auth = new Web3AuthNoModal({
  clientId,
  web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
  privateKeyProvider,
})

const openloginAdapter = new OpenloginAdapter({
  adapterSettings: {
    uxMode: "popup",
    loginConfig: {
      google: {
        verifier: "google",
        typeOfLogin: "google",
        clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",
      },
      github: {
        verifier: "github",
        typeOfLogin: "github",
        clientId: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID || "",
      },
      discord: {
        verifier: "discord",
        typeOfLogin: "discord",
        clientId: process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID || "",
      },
    },
  },
})

web3auth.configureAdapter(openloginAdapter)

export { web3auth, chainConfig }
