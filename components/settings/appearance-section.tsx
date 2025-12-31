"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useTheme as useNextTheme } from "next-themes"
import { useToast } from "@/hooks/use-toast"
import { Moon, Sun, Monitor, Palette } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useLanguage } from "../language-provider"

export function AppearanceSection() {
  const { theme, setTheme } = useNextTheme()
  const { toast } = useToast()
  const { t } = useLanguage()
  const [mounted, setMounted] = useState(false)
  const [reduceMotion, setReduceMotion] = useState(false)
  const [highContrast, setHighContrast] = useState(false)

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  const handleThemeChange = (value: string) => {
    setTheme(value)

    toast({
      title: t("settings.themeUpdated"),
      description: t("settings.themeSetTo", {
        theme: value === "system" ? t("settings.systemDefault") : t(`settings.${value}Theme`),
      }),
    })
  }

  const handleToggleReduceMotion = () => {
    setReduceMotion(!reduceMotion)

    toast({
      title: !reduceMotion ? t("settings.reducedMotionEnabled") : t("settings.reducedMotionDisabled"),
      description: !reduceMotion ? t("settings.animationsMinimized") : t("settings.animationsShown"),
    })
  }

  const handleToggleHighContrast = () => {
    setHighContrast(!highContrast)

    toast({
      title: !highContrast ? t("settings.highContrastEnabled") : t("settings.highContrastDisabled"),
      description: !highContrast ? t("settings.highContrastEnabledDesc") : t("settings.highContrastDisabledDesc"),
    })
  }

  if (!mounted) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("settings.appearance")}</CardTitle>
        <CardDescription>{t("settings.appearanceDesc")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">{t("settings.theme")}</h3>

          <RadioGroup
            value={theme}
            onValueChange={handleThemeChange}
            className="grid grid-cols-3 gap-4"
            defaultValue={theme || "system"}
          >
            <div>
              <RadioGroupItem value="light" id="theme-light" className="sr-only peer" />
              <Label
                htmlFor="theme-light"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <Sun className="mb-3 h-6 w-6" />
                {t("settings.light")}
              </Label>
            </div>

            <div>
              <RadioGroupItem value="dark" id="theme-dark" className="sr-only peer" />
              <Label
                htmlFor="theme-dark"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <Moon className="mb-3 h-6 w-6" />
                {t("settings.dark")}
              </Label>
            </div>

            <div>
              <RadioGroupItem value="system" id="theme-system" className="sr-only peer" />
              <Label
                htmlFor="theme-system"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <Monitor className="mb-3 h-6 w-6" />
                {t("settings.system")}
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-4 pt-4 border-t">
          <h3 className="text-lg font-medium">{t("settings.accessibility")}</h3>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center">
                <Palette className="h-4 w-4 mr-2 text-muted-foreground" />
                <Label htmlFor="high-contrast">{t("settings.highContrast")}</Label>
              </div>
              <p className="text-sm text-muted-foreground">{t("settings.highContrastDesc")}</p>
            </div>
            <Switch id="high-contrast" checked={highContrast} onCheckedChange={handleToggleHighContrast} />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center">
                <Moon className="h-4 w-4 mr-2 text-muted-foreground" />
                <Label htmlFor="reduce-motion">{t("settings.reduceMotion")}</Label>
              </div>
              <p className="text-sm text-muted-foreground">{t("settings.reduceMotionDesc")}</p>
            </div>
            <Switch id="reduce-motion" checked={reduceMotion} onCheckedChange={handleToggleReduceMotion} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
