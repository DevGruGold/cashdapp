import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UsersRound, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface Friend {
  id: string;
  username: string;
  avatar_url: string | null;
}

export const SecureCircle = () => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFriends = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('secure_circle')
        .select(`
          friend_id,
          friend:profiles!secure_circle_friend_id_fkey (
            id,
            username,
            avatar_url
          )
        `)
        .eq('user_id', user.id);

      if (error) {
        toast.error("Failed to load secure circle");
        return;
      }

      setFriends(data.map(d => d.friend));
    };

    fetchFriends();
  }, []);

  const handleDap = (friendId: string) => {
    navigate(`/send?to=${friendId}&type=dap`);
  };

  return (
    <Card className="p-6 bg-cashdapp-gray mt-6">
      <div className="flex items-center gap-2 mb-4">
        <UsersRound className="w-5 h-5 text-cashdapp-green" />
        <h2 className="text-xl font-semibold">Secure Circle</h2>
      </div>

      <div className="space-y-4">
        {friends.length === 0 ? (
          <p className="text-center text-gray-400 py-4">
            No friends in your secure circle yet
          </p>
        ) : (
          friends.map((friend) => (
            <div
              key={friend.id}
              className="flex items-center justify-between p-4 bg-cashdapp-light-gray rounded-lg"
            >
              <div className="flex items-center gap-3">
                {friend.avatar_url ? (
                  <img
                    src={friend.avatar_url}
                    alt={friend.username}
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-cashdapp-green flex items-center justify-center">
                    {friend.username?.[0]?.toUpperCase()}
                  </div>
                )}
                <span className="font-medium">{friend.username}</span>
              </div>
              <Button
                onClick={() => handleDap(friend.id)}
                className="bg-cashdapp-green text-black hover:bg-opacity-90"
              >
                <Send className="w-4 h-4 mr-2" />
                Dap
              </Button>
            </div>
          ))
        )}

        <Button
          onClick={() => navigate("/add-friend")}
          variant="outline"
          className="w-full"
        >
          Add to Circle
        </Button>
      </div>
    </Card>
  );
};