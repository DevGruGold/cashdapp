import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HandCoins, Send, UsersRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const TapToPay = () => {
  const [isNearby, setIsNearby] = useState(false);
  const navigate = useNavigate();

  const handleTap = () => {
    // In a real app, this would use NFC or similar technology
    toast.info("Scanning for nearby users...");
    setIsNearby(true);
    setTimeout(() => {
      navigate("/send");
    }, 1500);
  };

  return (
    <Card className="p-6 bg-cashdapp-gray mt-6">
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <HandCoins className="w-5 h-5 text-cashdapp-green" />
          <h2 className="text-xl font-semibold">Quick Pay</h2>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button
            onClick={handleTap}
            className="h-24 bg-cashdapp-green hover:bg-opacity-90 text-black flex-col gap-2"
          >
            <HandCoins className="w-6 h-6" />
            Tap to Pay
          </Button>

          <Button
            onClick={() => navigate("/circle")}
            className="h-24 bg-cashdapp-light-gray hover:bg-opacity-90 flex-col gap-2"
          >
            <UsersRound className="w-6 h-6" />
            Secure Circle
          </Button>
        </div>

        <Button
          onClick={() => navigate("/send")}
          variant="outline"
          className="w-full"
        >
          <Send className="w-4 h-4 mr-2" />
          Send to Anyone
        </Button>
      </div>
    </Card>
  );
};