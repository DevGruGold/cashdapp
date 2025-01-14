import { Header } from "@/components/Header";
import { Balance } from "@/components/Balance";
import { TransactionHistory } from "@/components/TransactionHistory";
import { TapToPay } from "@/components/TapToPay";
import { SecureCircle } from "@/components/SecureCircle";

const Index = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto max-w-5xl">
        <Header />
        <main className="px-4 py-4 md:py-6 space-y-4 md:space-y-6">
          <Balance />
          <TapToPay />
          <SecureCircle />
          <TransactionHistory />
        </main>
      </div>
    </div>
  );
};

export default Index;