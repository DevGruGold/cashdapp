import { Card } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownLeft } from "lucide-react";

const transactions = [
  {
    id: 1,
    type: "send",
    address: "0x1234...5678",
    amount: "-0.5 ETH",
    date: "2024-02-20",
    status: "completed"
  },
  {
    id: 2,
    type: "receive",
    address: "0x8765...4321",
    amount: "+1.2 ETH",
    date: "2024-02-19",
    status: "completed"
  },
  {
    id: 3,
    type: "send",
    address: "0x9876...1234",
    amount: "-0.3 ETH",
    date: "2024-02-18",
    status: "completed"
  }
];

export const TransactionHistory = () => {
  return (
    <Card className="p-8 bg-cashdapp-gray rounded-2xl animate-slide-up">
      <h2 className="text-2xl font-bold mb-6">Recent Transactions</h2>
      <div className="space-y-4">
        {transactions.map((tx) => (
          <div key={tx.id} className="flex items-center justify-between p-5 bg-cashdapp-light-gray rounded-xl hover:bg-cashdapp-hover-gray transition-colors cursor-pointer">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-full ${tx.type === 'send' ? 'bg-red-500/20' : 'bg-green-500/20'}`}>
                {tx.type === 'send' ? (
                  <ArrowUpRight className="w-6 h-6 text-red-500" />
                ) : (
                  <ArrowDownLeft className="w-6 h-6 text-green-500" />
                )}
              </div>
              <div>
                <p className="font-semibold text-lg">{tx.type === 'send' ? 'Sent' : 'Received'}</p>
                <p className="text-sm text-gray-400">{tx.address}</p>
              </div>
            </div>
            <div className="text-right">
              <p className={`font-semibold text-lg ${tx.type === 'send' ? 'text-red-500' : 'text-green-500'}`}>
                {tx.amount}
              </p>
              <p className="text-sm text-gray-400">{tx.date}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};