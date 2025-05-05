"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useUser } from "@/components/user-provider"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Check, Camera } from "lucide-react"

export function ProfileSection() {
  const { currentUser, isLoading } = useUser()
  const { toast } = useToast()
  const [name, setName] = useState(currentUser?.name || "")
  const [email, setEmail] = useState(currentUser?.email || "")
  const [bio, setBio] = useState("")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSaveProfile = async () => {
    setSaving(true)
    setSaved(false)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // In a real app, this would update the user profile
      // For demo purposes, we'll just show a success message
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully",
      })

      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update your profile",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>Manage your personal information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-4 mb-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center">
              <span className="text-white text-2xl font-bold">{currentUser?.name.charAt(0)}</span>
            </div>
            <Button
              size="icon"
              variant="secondary"
              className="absolute bottom-0 right-0 h-7 w-7 rounded-full"
              onClick={() =>
                toast({
                  title: "Feature Coming Soon",
                  description: "Profile picture upload will be available soon",
                })
              }
            >
              <Camera className="h-4 w-4" />
            </Button>
          </div>
          <div>
            <h3 className="font-medium">{currentUser?.name}</h3>
            <p className="text-sm text-muted-foreground">{currentUser?.email}</p>
            <p className="text-sm text-muted-foreground">
              Balance:{" "}
              {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(currentUser?.balance || 0)}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Your phone number"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Address</Label>
          <Textarea
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Your address"
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell us about yourself"
            rows={3}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSaveProfile} disabled={saving || isLoading} className="w-full">
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : saved ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Saved
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
