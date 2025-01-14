import { ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { Card } from "@/components/ui/card";

export const Balance = () => {
  return (
    <Card className="p-4 md:p-8 bg-cashdapp-gray rounded-xl md:rounded-2xl animate-fade-in">
      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 md:gap-8 mb-6 md:mb-8">
        <div>
          <h2 className="text-sm text-gray-400 mb-2">Your Balance</h2>
          <p className="text-3xl md:text-5xl font-bold tracking-tight">$1,234.56</p>
        </div>
        <div className="flex gap-2 md:gap-3">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-cashdapp-green text-black font-semibold px-4 md:px-6 py-2 md:py-3 rounded-full hover:bg-cashdapp-accent-green transition-colors">
            <ArrowUpRight className="w-4 h-4 md:w-5 md:h-5" />
            Send
          </button>
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white text-black font-semibold px-4 md:px-6 py-2 md:py-3 rounded-full hover:bg-gray-100 transition-colors">
            <ArrowDownLeft className="w-4 h-4 md:w-5 md:h-5" />
            Receive
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
        <div className="bg-cashdapp-light-gray rounded-lg md:rounded-xl p-4 md:p-6">
          <p className="text-sm text-gray-400 mb-2">24h Change</p>
          <p className="text-xl md:text-2xl font-semibold text-cashdapp-green">+2.14%</p>
        </div>
        <div className="bg-cashdapp-light-gray rounded-lg md:rounded-xl p-4 md:p-6">
          <p className="text-sm text-gray-400 mb-2">Portfolio Value</p>
          <p className="text-xl md:text-2xl font-semibold">$5,678.90</p>
        </div>
      </div>
    </Card>
  );
};