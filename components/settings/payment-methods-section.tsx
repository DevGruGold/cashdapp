"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { CreditCard, Plus, Trash2, BanknoteIcon as Bank, Check, Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface PaymentMethod {
  id: string
  type: "card" | "bank"
  name: string
  last4: string
  expiryMonth?: string
  expiryYear?: string
  isDefault: boolean
}

export function PaymentMethodsSection() {
  const { toast } = useToast()
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: "card-1",
      type: "card",
      name: "Visa ending in 4242",
      last4: "4242",
      expiryMonth: "12",
      expiryYear: "24",
      isDefault: true,
    },
    {
      id: "bank-1",
      type: "bank",
      name: "Chase Bank",
      last4: "6789",
      isDefault: false,
    },
  ])
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [newMethodType, setNewMethodType] = useState<"card" | "bank">("card")
  const [cardNumber, setCardNumber] = useState("")
  const [cardName, setCardName] = useState("")
  const [expiryMonth, setExpiryMonth] = useState("")
  const [expiryYear, setExpiryYear] = useState("")
  const [cvc, setCvc] = useState("")
  const [bankName, setBankName] = useState("")
  const [accountNumber, setAccountNumber] = useState("")
  const [routingNumber, setRoutingNumber] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

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

  const handleAddPaymentMethod = async () => {
    setIsSubmitting(true)

    try {
      // Validate inputs
      if (newMethodType === "card") {
        if (!cardNumber || cardNumber.replace(/\s+/g, "").length < 16) {
          throw new Error("Please enter a valid card number")
        }
        if (!cardName) {
          throw new Error("Please enter the name on card")
        }
        if (!expiryMonth || !expiryYear) {
          throw new Error("Please enter a valid expiry date")
        }
        if (!cvc || cvc.length < 3) {
          throw new Error("Please enter a valid CVC")
        }
      } else {
        if (!bankName) {
          throw new Error("Please enter a bank name")
        }
        if (!accountNumber) {
          throw new Error("Please enter an account number")
        }
        if (!routingNumber) {
          throw new Error("Please enter a routing number")
        }
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Add new payment method
      const newMethod: PaymentMethod =
        newMethodType === "card"
          ? {
              id: `card-${Date.now()}`,
              type: "card",
              name: `${cardName.split(" ")[0]}'s Card ending in ${cardNumber.slice(-4)}`,
              last4: cardNumber.slice(-4),
              expiryMonth,
              expiryYear,
              isDefault: paymentMethods.length === 0,
            }
          : {
              id: `bank-${Date.now()}`,
              type: "bank",
              name: bankName,
              last4: accountNumber.slice(-4),
              isDefault: paymentMethods.length === 0,
            }

      setPaymentMethods([...paymentMethods, newMethod])

      // Reset form
      setCardNumber("")
      setCardName("")
      setExpiryMonth("")
      setExpiryYear("")
      setCvc("")
      setBankName("")
      setAccountNumber("")
      setRoutingNumber("")

      // Close dialog
      setShowAddDialog(false)

      toast({
        title: "Payment Method Added",
        description: `Your ${newMethodType === "card" ? "card" : "bank account"} has been added successfully`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add payment method",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRemovePaymentMethod = (id: string) => {
    const methodToRemove = paymentMethods.find((method) => method.id === id)

    if (methodToRemove?.isDefault) {
      toast({
        title: "Cannot Remove Default",
        description: "You cannot remove your default payment method",
        variant: "destructive",
      })
      return
    }

    setPaymentMethods(paymentMethods.filter((method) => method.id !== id))

    toast({
      title: "Payment Method Removed",
      description: "Your payment method has been removed",
    })
  }

  const handleSetDefault = (id: string) => {
    setPaymentMethods(
      paymentMethods.map((method) => ({
        ...method,
        isDefault: method.id === id,
      })),
    )

    toast({
      title: "Default Updated",
      description: "Your default payment method has been updated",
    })
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Payment Methods</CardTitle>
          <CardDescription>Manage your payment methods</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {paymentMethods.length > 0 ? (
            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className={`p-4 rounded-lg border flex items-center justify-between ${method.isDefault ? "bg-muted/50 border-primary/50" : ""}`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      {method.type === "card" ? (
                        <CreditCard className="h-5 w-5 text-primary" />
                      ) : (
                        <Bank className="h-5 w-5 text-primary" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{method.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {method.type === "card"
                          ? `Expires ${method.expiryMonth}/${method.expiryYear}`
                          : `Account ending in ${method.last4}`}
                        {method.isDefault && <span className="ml-2 text-primary">• Default</span>}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {!method.isDefault && (
                      <Button variant="ghost" size="sm" onClick={() => handleSetDefault(method.id)}>
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemovePaymentMethod(method.id)}
                      disabled={method.isDefault}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              <p>No payment methods added yet</p>
            </div>
          )}

          <Button
            variant="outline"
            className="w-full flex items-center justify-center"
            onClick={() => setShowAddDialog(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Payment Method
          </Button>
        </CardContent>
      </Card>

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Payment Method</DialogTitle>
            <DialogDescription>Add a new payment method to your account</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="payment-type">Payment Type</Label>
              <Select value={newMethodType} onValueChange={(value: "card" | "bank") => setNewMethodType(value)}>
                <SelectTrigger id="payment-type">
                  <SelectValue placeholder="Select payment type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="card">Credit/Debit Card</SelectItem>
                  <SelectItem value="bank">Bank Account</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {newMethodType === "card" ? (
              <>
                <div className="grid gap-2">
                  <Label htmlFor="card-number">Card Number</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <CreditCard className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <Input
                      id="card-number"
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      className="pl-10"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                      maxLength={19}
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="card-name">Name on Card</Label>
                  <Input
                    id="card-name"
                    type="text"
                    placeholder="John Doe"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiry-month">Month</Label>
                    <Select value={expiryMonth} onValueChange={setExpiryMonth}>
                      <SelectTrigger id="expiry-month">
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
                    <Label htmlFor="expiry-year">Year</Label>
                    <Select value={expiryYear} onValueChange={setExpiryYear}>
                      <SelectTrigger id="expiry-year">
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
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="grid gap-2">
                  <Label htmlFor="bank-name">Bank Name</Label>
                  <Input
                    id="bank-name"
                    type="text"
                    placeholder="Bank of America"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="account-number">Account Number</Label>
                  <Input
                    id="account-number"
                    type="text"
                    placeholder="123456789"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ""))}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="routing-number">Routing Number</Label>
                  <Input
                    id="routing-number"
                    type="text"
                    placeholder="987654321"
                    value={routingNumber}
                    onChange={(e) => setRoutingNumber(e.target.value.replace(/\D/g, ""))}
                  />
                </div>
              </>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setShowAddDialog(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="button" onClick={handleAddPaymentMethod} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add Method"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
