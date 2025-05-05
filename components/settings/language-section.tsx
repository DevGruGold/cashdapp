"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useLanguage } from "../language-provider"
import { Globe } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function LanguageSection() {
  const { language, setLanguage, t } = useLanguage()
  const { toast } = useToast()

  const handleLanguageChange = (value: string) => {
    if (value === "en" || value === "es") {
      setLanguage(value)

      toast({
        title: t("settings.language") + " " + t("common.save"),
        description: value === "en" ? t("settings.english") : t("settings.spanish"),
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("settings.language")}</CardTitle>
        <CardDescription>{t("settings.language")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <RadioGroup value={language} onValueChange={handleLanguageChange} className="grid grid-cols-2 gap-4">
          <div>
            <RadioGroupItem value="en" id="language-en" className="sr-only peer" />
            <Label
              htmlFor="language-en"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <Globe className="mb-3 h-6 w-6" />
              {t("settings.english")}
            </Label>
          </div>

          <div>
            <RadioGroupItem value="es" id="language-es" className="sr-only peer" />
            <Label
              htmlFor="language-es"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <Globe className="mb-3 h-6 w-6" />
              {t("settings.spanish")}
            </Label>
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  )
}
