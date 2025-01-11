import { ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { Card } from "@/components/ui/card";

export const Balance = () => {
  return (
    <Card className="p-8 bg-cashdapp-gray rounded-2xl animate-fade-in">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-sm text-gray-400 mb-2">Your Balance</h2>
          <p className="text-5xl font-bold tracking-tight">$1,234.56</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-cashdapp-green text-black font-semibold px-6 py-3 rounded-full hover:bg-cashdapp-accent-green transition-colors">
            <ArrowUpRight className="w-5 h-5" />
            Send
          </button>
          <button className="flex items-center gap-2 bg-white text-black font-semibold px-6 py-3 rounded-full hover:bg-gray-100 transition-colors">
            <ArrowDownLeft className="w-5 h-5" />
            Receive
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-cashdapp-light-gray rounded-xl p-6">
          <p className="text-sm text-gray-400 mb-2">24h Change</p>
          <p className="text-2xl font-semibold text-cashdapp-green">+2.14%</p>
        </div>
        <div className="bg-cashdapp-light-gray rounded-xl p-6">
          <p className="text-sm text-gray-400 mb-2">Portfolio Value</p>
          <p className="text-2xl font-semibold">$5,678.90</p>
        </div>
      </div>
    </Card>
  );
};