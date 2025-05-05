"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useTheme } from "next-themes"
import { useToast } from "@/hooks/use-toast"
import { Moon, Sun, Monitor, Palette } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export function AppearanceSection() {
  const { theme, setTheme } = useTheme()
  const { toast } = useToast()
  const [reduceMotion, setReduceMotion] = useState(false)
  const [highContrast, setHighContrast] = useState(false)

  const handleThemeChange = (value: string) => {
    setTheme(value)

    toast({
      title: "Theme Updated",
      description: `Theme has been set to ${value === "system" ? "system default" : value}`,
    })
  }

  const handleToggleReduceMotion = () => {
    setReduceMotion(!reduceMotion)

    toast({
      title: !reduceMotion ? "Reduced Motion Enabled" : "Reduced Motion Disabled",
      description: !reduceMotion ? "Animations will be minimized" : "Animations will be shown",
    })
  }

  const handleToggleHighContrast = () => {
    setHighContrast(!highContrast)

    toast({
      title: !highContrast ? "High Contrast Enabled" : "High Contrast Disabled",
      description: !highContrast ? "High contrast mode has been enabled" : "High contrast mode has been disabled",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Appearance</CardTitle>
        <CardDescription>Customize how the app looks and feels</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Theme</h3>

          <RadioGroup value={theme} onValueChange={handleThemeChange} className="grid grid-cols-3 gap-4">
            <div>
              <RadioGroupItem value="light" id="theme-light" className="sr-only peer" />
              <Label
                htmlFor="theme-light"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <Sun className="mb-3 h-6 w-6" />
                Light
              </Label>
            </div>

            <div>
              <RadioGroupItem value="dark" id="theme-dark" className="sr-only peer" />
              <Label
                htmlFor="theme-dark"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <Moon className="mb-3 h-6 w-6" />
                Dark
              </Label>
            </div>

            <div>
              <RadioGroupItem value="system" id="theme-system" className="sr-only peer" />
              <Label
                htmlFor="theme-system"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <Monitor className="mb-3 h-6 w-6" />
                System
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-4 pt-4 border-t">
          <h3 className="text-lg font-medium">Accessibility</h3>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center">
                <Palette className="h-4 w-4 mr-2 text-muted-foreground" />
                <Label htmlFor="high-contrast">High Contrast</Label>
              </div>
              <p className="text-sm text-muted-foreground">Increase contrast for better visibility</p>
            </div>
            <Switch id="high-contrast" checked={highContrast} onCheckedChange={handleToggleHighContrast} />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center">
                <Moon className="h-4 w-4 mr-2 text-muted-foreground" />
                <Label htmlFor="reduce-motion">Reduce Motion</Label>
              </div>
              <p className="text-sm text-muted-foreground">Minimize animations and transitions</p>
            </div>
            <Switch id="reduce-motion" checked={reduceMotion} onCheckedChange={handleToggleReduceMotion} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
