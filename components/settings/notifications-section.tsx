"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Bell, DollarSign, ShieldAlert, Mail, MessageSquare, Smartphone } from "lucide-react"

export function NotificationsSection() {
  const { toast } = useToast()
  const [notifications, setNotifications] = useState({
    all: true,
    payments: true,
    security: true,
    marketing: false,
    app: true,
    sms: false,
    email: true,
    push: true,
  })

  const handleToggle = (key: keyof typeof notifications) => {
    // Special handling for 'all' toggle
    if (key === "all") {
      const newValue = !notifications.all
      setNotifications({
        ...notifications,
        all: newValue,
        payments: newValue,
        security: newValue,
        marketing: newValue,
        app: newValue,
        sms: newValue,
        email: newValue,
        push: newValue,
      })

      toast({
        title: newValue ? "All Notifications Enabled" : "All Notifications Disabled",
        description: newValue ? "You will receive all notifications" : "You will not receive any notifications",
      })
      return
    }

    // For other toggles
    const newValue = !notifications[key]
    setNotifications({
      ...notifications,
      [key]: newValue,
      // If any notification type is disabled, 'all' should be false
      all:
        key === "all"
          ? newValue
          : newValue &&
            Object.entries(notifications)
              .filter(([k]) => k !== "all" && k !== key)
              .every(([_, v]) => v),
    })

    toast({
      title: `${key.charAt(0).toUpperCase() + key.slice(1)} Notifications ${newValue ? "Enabled" : "Disabled"}`,
      description: `You will ${newValue ? "now" : "no longer"} receive ${key} notifications`,
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>Manage how you receive notifications</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Notification Types</h3>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center">
                <Bell className="h-4 w-4 mr-2 text-muted-foreground" />
                <Label htmlFor="notify-all">All Notifications</Label>
              </div>
              <p className="text-sm text-muted-foreground">Enable or disable all notifications</p>
            </div>
            <Switch id="notify-all" checked={notifications.all} onCheckedChange={() => handleToggle("all")} />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center">
                <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                <Label htmlFor="notify-payments">Payment Notifications</Label>
              </div>
              <p className="text-sm text-muted-foreground">Receive notifications about payments and transfers</p>
            </div>
            <Switch
              id="notify-payments"
              checked={notifications.payments}
              onCheckedChange={() => handleToggle("payments")}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center">
                <ShieldAlert className="h-4 w-4 mr-2 text-muted-foreground" />
                <Label htmlFor="notify-security">Security Alerts</Label>
              </div>
              <p className="text-sm text-muted-foreground">Receive notifications about security events</p>
            </div>
            <Switch
              id="notify-security"
              checked={notifications.security}
              onCheckedChange={() => handleToggle("security")}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                <Label htmlFor="notify-marketing">Marketing</Label>
              </div>
              <p className="text-sm text-muted-foreground">Receive marketing and promotional emails</p>
            </div>
            <Switch
              id="notify-marketing"
              checked={notifications.marketing}
              onCheckedChange={() => handleToggle("marketing")}
            />
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t">
          <h3 className="text-lg font-medium">Notification Channels</h3>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center">
                <Smartphone className="h-4 w-4 mr-2 text-muted-foreground" />
                <Label htmlFor="notify-app">In-App Notifications</Label>
              </div>
              <p className="text-sm text-muted-foreground">Receive notifications within the app</p>
            </div>
            <Switch id="notify-app" checked={notifications.app} onCheckedChange={() => handleToggle("app")} />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center">
                <MessageSquare className="h-4 w-4 mr-2 text-muted-foreground" />
                <Label htmlFor="notify-sms">SMS Notifications</Label>
              </div>
              <p className="text-sm text-muted-foreground">Receive notifications via text message</p>
            </div>
            <Switch id="notify-sms" checked={notifications.sms} onCheckedChange={() => handleToggle("sms")} />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                <Label htmlFor="notify-email">Email Notifications</Label>
              </div>
              <p className="text-sm text-muted-foreground">Receive notifications via email</p>
            </div>
            <Switch id="notify-email" checked={notifications.email} onCheckedChange={() => handleToggle("email")} />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center">
                <Bell className="h-4 w-4 mr-2 text-muted-foreground" />
                <Label htmlFor="notify-push">Push Notifications</Label>
              </div>
              <p className="text-sm text-muted-foreground">Receive push notifications on your device</p>
            </div>
            <Switch id="notify-push" checked={notifications.push} onCheckedChange={() => handleToggle("push")} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
