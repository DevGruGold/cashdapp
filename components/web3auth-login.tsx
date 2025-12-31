"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, Mail, Chrome, Github, MessageCircle } from "lucide-react"
import { useWeb3Auth } from "./web3auth-provider"
import { useLanguage } from "./language-provider"

export function Web3AuthLogin() {
  const { login, isLoading } = useWeb3Auth()
  const { t } = useLanguage()
  const [loginProvider, setLoginProvider] = useState<string | null>(null)

  const handleLogin = async (provider: string) => {
    setLoginProvider(provider)
    await login(provider)
    setLoginProvider(null)
  }

  const loginOptions = [
    {
      provider: "google",
      label: "Continue with Google",
      icon: Chrome,
      color: "bg-red-500 hover:bg-red-600",
    },
    {
      provider: "github",
      label: "Continue with GitHub",
      icon: Github,
      color: "bg-gray-800 hover:bg-gray-900",
    },
    {
      provider: "discord",
      label: "Continue with Discord",
      icon: MessageCircle,
      color: "bg-indigo-500 hover:bg-indigo-600",
    },
    {
      provider: "email_passwordless",
      label: "Continue with Email",
      icon: Mail,
      color: "bg-blue-500 hover:bg-blue-600",
    },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl text-center">{t("app.name")}</CardTitle>
            <CardDescription className="text-center">Connect your wallet to get started</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {loginOptions.map((option) => {
              const Icon = option.icon
              const isCurrentlyLoading = isLoading && loginProvider === option.provider

              return (
                <Button
                  key={option.provider}
                  onClick={() => handleLogin(option.provider)}
                  disabled={isLoading}
                  className={`w-full text-white ${option.color} transition-colors`}
                >
                  {isCurrentlyLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Icon className="mr-2 h-4 w-4" />
                  )}
                  {isCurrentlyLoading ? "Connecting..." : option.label}
                </Button>
              )
            })}

            <div className="text-xs text-center text-muted-foreground mt-4">
              By connecting, you agree to create a non-custodial wallet secured by Web3Auth. Your private keys are never
              stored on our servers.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
