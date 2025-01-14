import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react';
import { WagmiConfig, useAccount } from 'wagmi';
import { arbitrum, mainnet } from 'viem/chains';
import { useEffect, useState } from 'react';
import Index from "./pages/Index";
import BuyCrypto from "./pages/BuyCrypto";
import Bridge from "./pages/Bridge";
import { toast } from "sonner";

const projectId = '6054bd6688c6860ed806775db1c24f15';
const metadata = {
  name: 'CashDapp',
  description: 'Web3 Financial Application',
  url: 'https://cashdapp.com',
  icons: ['https://avatars.githubusercontent.com/u/37784886']
};

const chains = [mainnet, arbitrum];
const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata });
const queryClient = new QueryClient();

createWeb3Modal({ wagmiConfig, projectId, chains });

const RequireWeb3Auth = ({ children }: { children: React.ReactNode }) => {
  const { isConnected } = useAccount();
  const [isInitialized, setIsInitialized] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeWallet = async () => {
      try {
        if (isConnected) {
          setIsInitialized(true);
          
          setTimeout(() => {
            if (isConnected) {
              setIsVerified(true);
              toast.success("Wallet connected successfully!");
            }
            setIsLoading(false);
          }, 1000);
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Wallet initialization error:", error);
        toast.error("Error connecting wallet");
        setIsLoading(false);
      }
    };

    initializeWallet();
  }, [isConnected]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cashdapp-green"></div>
      </div>
    );
  }

  if (!isInitialized || !isVerified) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WagmiConfig config={wagmiConfig}>
          <div className="min-h-screen bg-black">
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route
                  path="/buy"
                  element={
                    <RequireWeb3Auth>
                      <BuyCrypto />
                    </RequireWeb3Auth>
                  }
                />
                <Route
                  path="/bridge"
                  element={
                    <RequireWeb3Auth>
                      <Bridge />
                    </RequireWeb3Auth>
                  }
                />
              </Routes>
            </BrowserRouter>
          </div>
        </WagmiConfig>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;