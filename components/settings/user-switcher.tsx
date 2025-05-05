"use client"
import { Button } from "@/components/ui/button"
import { useUser } from "@/components/user-provider"
import { useToast } from "@/hooks/use-toast"
import { Users } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function UserSwitcher() {
  const { toast } = useToast()
  const { login } = useUser()

  const handleSwitchUser = async (email: string, password: string) => {
    const success = await login(email, password)

    if (success) {
      toast({
        title: "User Switched",
        description: `You are now logged in as ${email}`,
      })
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Users className="h-4 w-4 mr-2" />
          Switch User
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Demo Users</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleSwitchUser("user1@example.com", "password1")}>
          John Doe (user1@example.com)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleSwitchUser("user2@example.com", "password2")}>
          Jane Smith (user2@example.com)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
