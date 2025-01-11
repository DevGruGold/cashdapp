import { Bell, Settings, LogOut } from "lucide-react";
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Header = () => {
  const { open } = useWeb3Modal();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Error signing out");
    } else {
      navigate('/auth');
    }
  };

  return (
    <header className="flex justify-between items-center py-6 px-4 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-cashdapp-green rounded-full flex items-center justify-center hover:bg-cashdapp-accent-green transition-colors cursor-pointer">
          <span className="text-black font-bold text-2xl">$</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight">CashDapp</h1>
      </div>
      <div className="flex items-center gap-4">
        <button 
          onClick={() => open()}
          className="px-4 py-2 bg-cashdapp-green text-black font-semibold rounded-full hover:bg-cashdapp-accent-green transition-colors"
        >
          Connect Wallet
        </button>
        <button className="p-2 hover:bg-cashdapp-hover-gray rounded-full transition-colors">
          <Bell className="w-6 h-6" />
        </button>
        <button className="p-2 hover:bg-cashdapp-hover-gray rounded-full transition-colors">
          <Settings className="w-6 h-6" />
        </button>
        <button 
          onClick={handleSignOut}
          className="p-2 hover:bg-cashdapp-hover-gray rounded-full transition-colors text-red-500"
        >
          <LogOut className="w-6 h-6" />
        </button>
      </div>
    </header>
  );
};