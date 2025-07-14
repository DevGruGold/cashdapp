"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Bell, Menu, X, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useUser } from "./user-provider"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useLanguage } from "./language-provider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { WalletConnectButton } from "./wallet-connect-button"

export function AppHeader() {
  const { currentUser } = useUser()
  const { language, setLanguage, t } = useLanguage()
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const handleLanguageChange = (value: string) => {
    if (value === "en" || value === "es") {
      setLanguage(value)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center gap-2">
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[240px] sm:w-[300px]">
              <div className="flex flex-col gap-4 py-4">
                <div className="flex items-center gap-2">
                  <X className="h-5 w-5 cursor-pointer" onClick={() => setIsMenuOpen(false)} />
                  <span className="text-lg font-semibold">{t("app.name")}</span>
                </div>
                <nav className="flex flex-col gap-2">
                  <Button
                    variant="ghost"
                    className="justify-start"
                    onClick={() => {
                      router.push("/")
                      setIsMenuOpen(false)
                    }}
                  >
                    {t("nav.home")}
                  </Button>
                  <Button
                    variant="ghost"
                    className="justify-start"
                    onClick={() => {
                      router.push("/?tab=activity")
                      setIsMenuOpen(false)
                    }}
                  >
                    {t("nav.activity")}
                  </Button>
                  <Button
                    variant="ghost"
                    className="justify-start"
                    onClick={() => {
                      router.push("/banking")
                      setIsMenuOpen(false)
                    }}
                  >
                    {t("nav.banking")}
                  </Button>
                  <Button
                    variant="ghost"
                    className="justify-start"
                    onClick={() => {
                      router.push("/?tab=terminal")
                      setIsMenuOpen(false)
                    }}
                  >
                    {t("nav.terminal")}
                  </Button>
                  <Button
                    variant="ghost"
                    className="justify-start"
                    onClick={() => {
                      router.push("/?tab=settings")
                      setIsMenuOpen(false)
                    }}
                  >
                    {t("nav.settings")}
                  </Button>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
          <span className="text-lg font-semibold hidden md:inline-block">{t("app.name")}</span>
        </div>

        <div className="flex items-center gap-4">
          {/* Language Selector */}
          <div className="flex items-center">
            <Select value={language} onValueChange={handleLanguageChange}>
              <SelectTrigger className="w-[110px] h-8">
                <Globe className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Español</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <WalletConnectButton variant="outline" size="sm" />

          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
          </Button>
          {currentUser && (
            <Avatar className="h-8 w-8">
              <AvatarImage src={currentUser.avatar || "/placeholder.svg"} alt={currentUser.name} />
              <AvatarFallback>{getInitials(currentUser.name)}</AvatarFallback>
            </Avatar>
          )}
        </div>
      </div>
    </header>
  )
}


