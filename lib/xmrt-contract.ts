import { ethers } from "ethers"

export const XMRT_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_XMRT_CONTRACT_ADDRESS!

// XMRT Contract ABI - Basic ERC20 functions
export const XMRT_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address owner) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function transferFrom(address from, address to, uint256 amount) returns (bool)",
  "event Transfer(address indexed from, address indexed to, uint256 value)",
  "event Approval(address indexed owner, address indexed spender, uint256 value)",
]

export function getXMRTContract(provider: ethers.providers.Provider | ethers.Signer) {
  return new ethers.Contract(XMRT_CONTRACT_ADDRESS, XMRT_ABI, provider)
}
