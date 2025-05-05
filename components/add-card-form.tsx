"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, CreditCard } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { UserCircle, Activity, Coins, Settings, BanknoteIcon as Bank, Terminal } from "lucide-react"

interface AddCardFormProps {
  onBack: () => void
}

export function AddCardForm({ onBack }: AddCardFormProps) {
  const [cardNumber, setCardNumber] = useState("")
  const [cardName, setCardName] = useState("")
  const [expiryMonth, setExpiryMonth] = useState("")
  const [expiryYear, setExpiryYear] = useState("")
  const [cvc, setCvc] = useState("")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []

    for (let i = 0; i < match.length; i += 4) {
      parts.push(match.substring(i, i + 4))
    }

    if (parts.length) {
      return parts.join(" ")
    } else {
      return value
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setLoading(true)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Card added",
        description: "Your card has been added successfully",
      })

      onBack()
    } catch (error) {
      console.error("Error adding card:", error)
      toast({
        title: "Failed to add card",
        description: "There was an error adding your card",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
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
          <CardTitle>Add Card</CardTitle>
          <CardDescription>Add a new debit or credit card</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cardNumber">Card Number</Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                </div>
                <Input
                  id="cardNumber"
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  className="pl-10"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                  maxLength={19}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cardName">Name on Card</Label>
              <Input
                id="cardName"
                type="text"
                placeholder="John Doe"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiryMonth">Month</Label>
                <Select value={expiryMonth} onValueChange={setExpiryMonth}>
                  <SelectTrigger id="expiryMonth">
                    <SelectValue placeholder="MM" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 12 }, (_, i) => {
                      const month = i + 1
                      return (
                        <SelectItem key={month} value={month.toString().padStart(2, "0")}>
                          {month.toString().padStart(2, "0")}
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="expiryYear">Year</Label>
                <Select value={expiryYear} onValueChange={setExpiryYear}>
                  <SelectTrigger id="expiryYear">
                    <SelectValue placeholder="YY" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 10 }, (_, i) => {
                      const year = new Date().getFullYear() + i
                      const shortYear = year.toString().slice(-2)
                      return (
                        <SelectItem key={year} value={shortYear}>
                          {shortYear}
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cvc">CVC</Label>
                <Input
                  id="cvc"
                  type="text"
                  placeholder="123"
                  value={cvc}
                  onChange={(e) => setCvc(e.target.value.replace(/\D/g, ""))}
                  maxLength={3}
                  required
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full bg-primary" disabled={loading}>
              {loading ? "Adding Card..." : "Add Card"}
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
