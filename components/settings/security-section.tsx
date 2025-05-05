"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useUser } from "@/components/user-provider"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Check, Fingerprint, Shield } from "lucide-react"

export function SecuritySection() {
  const { currentUser } = useUser()
  const { toast } = useToast()
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [biometricEnabled, setBiometricEnabled] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleChangePassword = async () => {
    if (!currentPassword) {
      toast({
        title: "Current Password Required",
        description: "Please enter your current password",
        variant: "destructive",
      })
      return
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords Don't Match",
        description: "New password and confirmation must match",
        variant: "destructive",
      })
      return
    }

    if (newPassword.length < 8) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 8 characters long",
        variant: "destructive",
      })
      return
    }

    setSaving(true)
    setSaved(false)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // In a real app, this would update the password
      // For demo purposes, we'll just show a success message
      toast({
        title: "Password Updated",
        description: "Your password has been updated successfully",
      })

      // Clear form
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update your password",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleToggleTwoFactor = () => {
    setTwoFactorEnabled(!twoFactorEnabled)

    toast({
      title: !twoFactorEnabled ? "2FA Enabled" : "2FA Disabled",
      description: !twoFactorEnabled
        ? "Two-factor authentication has been enabled"
        : "Two-factor authentication has been disabled",
    })
  }

  const handleToggleBiometric = () => {
    setBiometricEnabled(!biometricEnabled)

    toast({
      title: !biometricEnabled ? "Biometric Login Enabled" : "Biometric Login Disabled",
      description: !biometricEnabled ? "Biometric login has been enabled" : "Biometric login has been disabled",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Security</CardTitle>
        <CardDescription>Manage your account security settings</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Change Password</h3>

          <div className="space-y-2">
            <Label htmlFor="current-password">Current Password</Label>
            <Input
              id="current-password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="new-password">New Password</Label>
            <Input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm New Password</Label>
            <Input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
            />
          </div>

          <Button onClick={handleChangePassword} disabled={saving} className="w-full">
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : saved ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Updated
              </>
            ) : (
              "Change Password"
            )}
          </Button>
        </div>

        <div className="space-y-4 pt-4 border-t">
          <h3 className="text-lg font-medium">Additional Security</h3>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center">
                <Shield className="h-4 w-4 mr-2 text-muted-foreground" />
                <Label htmlFor="two-factor">Two-Factor Authentication</Label>
              </div>
              <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
            </div>
            <Switch id="two-factor" checked={twoFactorEnabled} onCheckedChange={handleToggleTwoFactor} />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center">
                <Fingerprint className="h-4 w-4 mr-2 text-muted-foreground" />
                <Label htmlFor="biometric">Biometric Login</Label>
              </div>
              <p className="text-sm text-muted-foreground">Use fingerprint or face recognition to log in</p>
            </div>
            <Switch id="biometric" checked={biometricEnabled} onCheckedChange={handleToggleBiometric} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
