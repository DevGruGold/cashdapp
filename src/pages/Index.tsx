import { Header } from "@/components/Header";
import { Balance } from "@/components/Balance";
import { TransactionHistory } from "@/components/TransactionHistory";
import { Onramper } from "@/components/Onramper";

const Index = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto max-w-5xl">
        <Header />
        <main className="px-4 py-6 space-y-6">
          <Balance />
          <Onramper />
          <TransactionHistory />
        </main>
      </div>
    </div>
  );
};

export default Index;