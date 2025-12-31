# CashDapp - Web3 Payment Application

## 🚀 Web3Auth Integration Setup

This application integrates Web3Auth for seamless wallet connection with social logins, connecting exclusively to the Ethereum Sepolia testnet for safe testing.

### 🔧 Environment Variables Setup

Create a `.env.local` file in your project root with the following variables:

\`\`\`bash
# Web3Auth Configuration
NEXT_PUBLIC_WEB3AUTH_CLIENT_ID=your_web3auth_client_id_here
WEB3AUTH_CLIENT_SECRET=your_web3auth_client_secret_here

# Ethereum RPC Configuration
NEXT_PUBLIC_ETH_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
# Alternative: https://eth-sepolia.g.alchemy.com/v2/YOUR_ALCHEMY_KEY

# XMRT Contract Configuration
NEXT_PUBLIC_XMRT_CONTRACT_ADDRESS=0x1234567890123456789012345678901234567890
XMRT_CONTRACT_ABI=path_to_abi_json_or_inline_abi

# Optional: Social Login Client IDs
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
NEXT_PUBLIC_GITHUB_CLIENT_ID=your_github_client_id
NEXT_PUBLIC_DISCORD_CLIENT_ID=your_discord_client_id
\`\`\`

### 🛠️ Web3Auth Dashboard Setup

1. Go to [Web3Auth Dashboard](https://dashboard.web3auth.io/)
2. Create a new project
3. Configure your project settings:
   - **Project Type**: Plug and Play
   - **Product**: PnP No Modal SDK
   - **Platform**: Web
   - **Domain**: `coldcash.vercel.app` (or your domain)

4. Copy your Client ID to `NEXT_PUBLIC_WEB3AUTH_CLIENT_ID`

### 🔗 Social Login Configuration

#### Google OAuth Setup:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create OAuth 2.0 credentials
3. Add your domain to authorized origins
4. Copy Client ID to `NEXT_PUBLIC_GOOGLE_CLIENT_ID`

#### GitHub OAuth Setup:
1. Go to GitHub Settings > Developer settings > OAuth Apps
2. Create a new OAuth App
3. Set Authorization callback URL to your domain
4. Copy Client ID to `NEXT_PUBLIC_GITHUB_CLIENT_ID`

### 🌐 RPC Provider Setup

Choose one of the following:

#### Infura:
1. Sign up at [Infura](https://infura.io/)
2. Create a new project
3. Copy the Sepolia endpoint to `NEXT_PUBLIC_ETH_RPC_URL`

#### Alchemy:
1. Sign up at [Alchemy](https://alchemy.com/)
2. Create a new app on Sepolia
3. Copy the HTTPS endpoint to `NEXT_PUBLIC_ETH_RPC_URL`

### 🪙 XMRT Contract Setup

1. Deploy your XMRT token contract on Sepolia testnet
2. Copy the contract address to `NEXT_PUBLIC_XMRT_CONTRACT_ADDRESS`
3. The ABI is included in the code for standard ERC20 functions

### 🚀 Installation & Running

\`\`\`bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
npm start
\`\`\`

### 🔒 Security Features

- **Non-custodial**: Private keys are managed by Web3Auth, never stored on servers
- **Testnet Only**: Exclusively connects to Sepolia testnet for safe testing
- **Environment Variables**: All sensitive data stored securely in environment variables
- **Network Validation**: Blocks app functionality if not on correct network

### 🎯 Features

- **Social Login**: Google, GitHub, Discord, and email login options
- **Wallet Management**: View ETH and XMRT token balances
- **Network Guard**: Automatic network detection and switching prompts
- **Testnet Banner**: Clear indication that no real funds are at risk
- **Faucet Integration**: Direct link to Sepolia faucet for test ETH
- **Modular Code**: Reusable components for other projects

### 🧪 Testing

1. Connect with any social login method
2. Ensure you're on Sepolia testnet
3. Get test ETH from the faucet link
4. View your wallet address and balances
5. Test XMRT token interactions

### 🔧 Troubleshooting

- **Connection Issues**: Check Web3Auth client ID and network settings
- **Wrong Network**: Use the "Switch to Sepolia" button
- **Balance Issues**: Use the refresh button or check RPC endpoint
- **Login Failures**: Verify social login client IDs and domains

### 📱 Mobile Support

The application is fully responsive and works on mobile devices with Web3Auth's mobile-optimized login flow.
