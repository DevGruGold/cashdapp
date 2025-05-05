"use client"

import { useState } from "react"
import { useLanguage } from "./language-provider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Globe } from "lucide-react"

export function LanguageToggle() {
  const { language, setLanguage, t } = useLanguage()
  const [isSpanish, setIsSpanish] = useState(language === "es")

  const handleToggle = (checked: boolean) => {
    setIsSpanish(checked)
    setLanguage(checked ? "es" : "en")
  }

  return (
    <div className="flex items-center space-x-2">
      <Globe className="h-4 w-4 text-muted-foreground" />
      <Label htmlFor="language-toggle" className="text-sm cursor-pointer">
        {isSpanish ? t("settings.spanish") : t("settings.english")}
      </Label>
      <Switch id="language-toggle" checked={isSpanish} onCheckedChange={handleToggle} aria-label="Toggle language" />
    </div>
  )
}
