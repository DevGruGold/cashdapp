import { Bell, Settings, LogOut, Menu } from "lucide-react";
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export const Header = () => {
  const { open } = useWeb3Modal();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Error signing out");
    } else {
      navigate('/auth');
    }
  };

  return (
    <header className="flex justify-between items-center py-4 px-4 md:py-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 md:w-12 md:h-12 bg-cashdapp-green rounded-full flex items-center justify-center hover:bg-cashdapp-accent-green transition-colors cursor-pointer">
          <span className="text-black font-bold text-xl md:text-2xl">$</span>
        </div>
        <h1 className="text-xl md:text-2xl font-bold tracking-tight">CashDapp</h1>
      </div>

      {/* Mobile Menu */}
      <div className="md:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <button className="p-2 hover:bg-cashdapp-hover-gray rounded-full transition-colors">
              <Menu className="w-6 h-6" />
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[80%] bg-cashdapp-gray border-cashdapp-light-gray">
            <div className="flex flex-col gap-4 mt-8">
              <button 
                onClick={() => {
                  open();
                  setIsOpen(false);
                }}
                className="w-full px-4 py-3 bg-cashdapp-green text-black font-semibold rounded-full hover:bg-cashdapp-accent-green transition-colors"
              >
                Connect Wallet
              </button>
              <button 
                className="w-full flex items-center justify-center gap-2 px-4 py-3 hover:bg-cashdapp-hover-gray rounded-full transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <Bell className="w-5 h-5" />
                Notifications
              </button>
              <button 
                className="w-full flex items-center justify-center gap-2 px-4 py-3 hover:bg-cashdapp-hover-gray rounded-full transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <Settings className="w-5 h-5" />
                Settings
              </button>
              <button 
                onClick={() => {
                  handleSignOut();
                  setIsOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 hover:bg-cashdapp-hover-gray rounded-full transition-colors text-red-500"
              >
                <LogOut className="w-5 h-5" />
                Sign Out
              </button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center gap-4">
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