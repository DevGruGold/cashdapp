import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react';
import { WagmiConfig } from 'wagmi';
import { arbitrum, mainnet } from 'viem/chains';
import { createClient } from '@supabase/supabase-js';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import Index from "./pages/Index";
import BuyCrypto from "./pages/BuyCrypto";
import Bridge from "./pages/Bridge";
import Auth from "./pages/Auth";
import { supabase } from "@/integrations/supabase/client";

// Project configuration
const projectId = '6054bd6688c6860ed806775db1c24f15';
const metadata = {
  name: 'CashDapp',
  description: 'Web3 Financial Application',
  url: 'https://cashdapp.com',
  icons: ['https://avatars.githubusercontent.com/u/37784886']
};

// Setup chains
const chains = [mainnet, arbitrum];

// Create wagmi config
const wagmiConfig = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
});

// Create React Query client
const queryClient = new QueryClient();

// Initialize web3modal
createWeb3Modal({ wagmiConfig, projectId, chains });

const App = () => {
  return (
    <WagmiConfig config={wagmiConfig}>
      <SessionContextProvider supabaseClient={supabase}>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/auth" element={<Auth />} />
                <Route
                  path="/"
                  element={
                    <RequireAuth>
                      <Index />
                    </RequireAuth>
                  }
                />
                <Route
                  path="/buy"
                  element={
                    <RequireAuth>
                      <BuyCrypto />
                    </RequireAuth>
                  }
                />
                <Route
                  path="/bridge"
                  element={
                    <RequireAuth>
                      <Bridge />
                    </RequireAuth>
                  }
                />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </QueryClientProvider>
      </SessionContextProvider>
    </WagmiConfig>
  );
};

// RequireAuth component to protect routes
const RequireAuth = ({ children }: { children: React.ReactNode }) => {
  const session = supabase.auth.getSession();
  
  if (!session) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

export default App;