"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { StripeTerminal } from "@/components/stripe-terminal"
import { UserCircle, Activity, Coins, Settings, BanknoteIcon as Bank, Terminal } from "lucide-react"

interface BuyCryptoFormProps {
  onBack: () => void
}

export function BuyCryptoForm({ onBack }: BuyCryptoFormProps) {
  const [amount, setAmount] = useState("")
  const [crypto, setCrypto] = useState("ETH")
  const [showStripeTerminal, setShowStripeTerminal] = useState(false)
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!amount || Number.parseFloat(amount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount",
        variant: "destructive",
      })
      return
    }

    // Show the Stripe terminal
    setShowStripeTerminal(true)
  }

  if (showStripeTerminal) {
    return <StripeTerminal amount={amount} crypto={crypto} onBack={() => setShowStripeTerminal(false)} />
  }

  return (
    <div className="flex flex-col min-h-screen p-4 pb-20">
      <div className="flex justify-between items-center mb-4">
        <Button variant="ghost" className="w-fit p-0" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Banking
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Buy Cryptocurrency</CardTitle>
          <CardDescription>Purchase crypto with your debit or credit card</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (USD)</Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <span className="text-muted-foreground">$</span>
                </div>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  className="pl-7"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="crypto">Cryptocurrency</Label>
              <Select value={crypto} onValueChange={setCrypto}>
                <SelectTrigger id="crypto">
                  <SelectValue placeholder="Select cryptocurrency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BTC">Bitcoin (BTC)</SelectItem>
                  <SelectItem value="ETH">Ethereum (ETH)</SelectItem>
                  <SelectItem value="SOL">Solana (SOL)</SelectItem>
                  <SelectItem value="MATIC">Polygon (MATIC)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full bg-primary">
              Continue to Payment
            </Button>
          </CardFooter>
        </form>
      </Card>

      {/* Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 h-16 grid grid-cols-6 bg-background border-t">
        <button
          onClick={() => onBack()}
          className="flex flex-col items-center justify-center text-muted-foreground hover:text-foreground"
        >
          <UserCircle className="h-5 w-5" />
          <span className="text-xs">Home</span>
        </button>
        <button
          onClick={() => onBack()}
          className="flex flex-col items-center justify-center text-muted-foreground hover:text-foreground"
        >
          <Activity className="h-5 w-5" />
          <span className="text-xs">Activity</span>
        </button>
        <button className="flex flex-col items-center justify-center text-primary">
          <Bank className="h-5 w-5" />
          <span className="text-xs">Banking</span>
        </button>
        <button
          onClick={() => onBack()}
          className="flex flex-col items-center justify-center text-muted-foreground hover:text-foreground"
        >
          <Terminal className="h-5 w-5" />
          <span className="text-xs">Terminal</span>
        </button>
        <button
          onClick={() => onBack()}
          className="flex flex-col items-center justify-center text-muted-foreground hover:text-foreground"
        >
          <Coins className="h-5 w-5" />
          <span className="text-xs">Assets</span>
        </button>
        <button
          onClick={() => onBack()}
          className="flex flex-col items-center justify-center text-muted-foreground hover:text-foreground"
        >
          <Settings className="h-5 w-5" />
          <span className="text-xs">Settings</span>
        </button>
      </div>
    </div>
  )
}
