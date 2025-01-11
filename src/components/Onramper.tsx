import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { ArrowLeftRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const Onramper = () => {
  const { open } = useWeb3Modal();
  const navigate = useNavigate();

  return (
    <Card className="p-6 bg-cashdapp-gray mt-6 animate-fade-in">
      <div className="flex items-center gap-2 mb-4">
        <ArrowLeftRight className="w-5 h-5 text-cashdapp-green" />
        <h2 className="text-xl font-semibold">Buy, Sell & Bridge</h2>
      </div>

      <Tabs defaultValue="buy" className="w-full">
        <TabsList className="w-full bg-cashdapp-light-gray">
          <TabsTrigger value="buy" className="flex-1">
            Buy Crypto
          </TabsTrigger>
          <TabsTrigger value="sell" className="flex-1">
            Sell Crypto
          </TabsTrigger>
          <TabsTrigger value="bridge" className="flex-1">
            Bridge
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="buy" className="mt-4">
          <div className="space-y-4">
            <div className="bg-cashdapp-light-gray rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-2">Select Payment Method</p>
              <div className="grid grid-cols-2 gap-2">
                <button className="bg-cashdapp-gray hover:bg-opacity-80 transition-colors p-3 rounded-lg text-sm font-medium">
                  Credit Card
                </button>
                <button className="bg-cashdapp-gray hover:bg-opacity-80 transition-colors p-3 rounded-lg text-sm font-medium">
                  Bank Transfer
                </button>
              </div>
            </div>
            
            <div className="bg-cashdapp-light-gray rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-2">Select Asset</p>
              <button 
                onClick={() => open({ view: 'Networks' })}
                className="w-full bg-cashdapp-gray hover:bg-opacity-80 transition-colors p-3 rounded-lg text-sm font-medium text-left"
              >
                Choose Token
              </button>
            </div>

            <button 
              onClick={() => navigate('/buy')}
              className="w-full bg-cashdapp-green text-black font-semibold py-3 rounded-lg hover:opacity-90 transition-opacity"
            >
              Continue Purchase
            </button>
          </div>
        </TabsContent>

        <TabsContent value="sell" className="mt-4">
          <div className="space-y-4">
            <div className="bg-cashdapp-light-gray rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-2">Select Asset to Sell</p>
              <button 
                onClick={() => open({ view: 'Networks' })}
                className="w-full bg-cashdapp-gray hover:bg-opacity-80 transition-colors p-3 rounded-lg text-sm font-medium text-left"
              >
                Choose Token
              </button>
            </div>

            <div className="bg-cashdapp-light-gray rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-2">Receive Payment Via</p>
              <div className="grid grid-cols-2 gap-2">
                <button className="bg-cashdapp-gray hover:bg-opacity-80 transition-colors p-3 rounded-lg text-sm font-medium">
                  Bank Transfer
                </button>
                <button className="bg-cashdapp-gray hover:bg-opacity-80 transition-colors p-3 rounded-lg text-sm font-medium">
                  PayPal
                </button>
              </div>
            </div>

            <button 
              onClick={() => navigate('/sell')}
              className="w-full bg-cashdapp-green text-black font-semibold py-3 rounded-lg hover:opacity-90 transition-opacity"
            >
              Continue Sale
            </button>
          </div>
        </TabsContent>

        <TabsContent value="bridge" className="mt-4">
          <div className="space-y-4">
            <div className="bg-cashdapp-light-gray rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-2">From Chain</p>
              <button 
                onClick={() => open({ view: 'Networks' })}
                className="w-full bg-cashdapp-gray hover:bg-opacity-80 transition-colors p-3 rounded-lg text-sm font-medium text-left"
              >
                Select Source Chain
              </button>
            </div>

            <div className="bg-cashdapp-light-gray rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-2">To Chain</p>
              <button 
                onClick={() => open({ view: 'Networks' })}
                className="w-full bg-cashdapp-gray hover:bg-opacity-80 transition-colors p-3 rounded-lg text-sm font-medium text-left"
              >
                Select Destination Chain
              </button>
            </div>

            <button 
              onClick={() => navigate('/bridge')}
              className="w-full bg-cashdapp-green text-black font-semibold py-3 rounded-lg hover:opacity-90 transition-opacity"
            >
              Start Bridge
            </button>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};