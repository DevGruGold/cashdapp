import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react';
import { WagmiConfig } from 'wagmi';
import { arbitrum, mainnet } from 'viem/chains';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { useEffect, useState } from 'react';
import Index from "./pages/Index";
import BuyCrypto from "./pages/BuyCrypto";
import Bridge from "./pages/Bridge";
import Auth from "./pages/Auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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

// RequireAuth component to protect routes
const RequireAuth = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // First check - initialization
        const { data: { session: initialSession }, error: initialError } = await supabase.auth.getSession();
        
        if (initialError) {
          toast.error("Error checking authentication status");
          return;
        }

        if (initialSession) {
          setIsAuthenticated(true);
        }

        // Second check - verify session
        const { data: { session: verifiedSession }, error: verifyError } = await supabase.auth.getSession();
        
        if (verifyError) {
          toast.error("Error verifying session");
          return;
        }

        setIsAuthenticated(!!verifiedSession);
        setIsInitialized(true);
      } catch (error) {
        console.error("Auth initialization error:", error);
        toast.error("Error initializing authentication");
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (isLoading || !isInitialized) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiConfig config={wagmiConfig}>
        <SessionContextProvider supabaseClient={supabase}>
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
        </SessionContextProvider>
      </WagmiConfig>
    </QueryClientProvider>
  );
};

export default App;