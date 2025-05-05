"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useUser } from "@/components/user-provider"
import { Loader2 } from "lucide-react"
import { useLanguage } from "./language-provider"

interface AddFundsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddFundsDialog({ open, onOpenChange }: AddFundsDialogProps) {
  const { depositFunds, isLoading } = useUser()
  const [amount, setAmount] = useState("")
  const [source, setSource] = useState("bank")
  const [step, setStep] = useState(1)
  const { t } = useLanguage()

  const handleAddFunds = async () => {
    if (!amount) return

    const success = await depositFunds(Number.parseFloat(amount), source === "bank" ? "Bank Account" : "Credit Card")
    if (success) {
      resetForm()
      onOpenChange(false)
    }
  }

  const resetForm = () => {
    setAmount("")
    setSource("bank")
    setStep(1)
  }

  const handleClose = () => {
    resetForm()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("home.addFunds")}</DialogTitle>
          <DialogDescription>Add funds to your account from a bank or card.</DialogDescription>
        </DialogHeader>

        {step === 1 && (
          <>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="amount">Amount ($)</Label>
                <Input
                  id="amount"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label>Source</Label>
                <RadioGroup value={source} onValueChange={setSource}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="bank" id="bank" />
                    <Label htmlFor="bank">Bank Account</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card">Credit Card</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>
                {t("common.cancel")}
              </Button>
              <Button onClick={() => setStep(2)} disabled={!amount || isLoading}>
                {t("common.next")}
              </Button>
            </DialogFooter>
          </>
        )}

        {step === 2 && (
          <>
            <div className="grid gap-4 py-4">
              <div className="text-center space-y-2">
                <p className="text-lg font-medium">
                  Add ${Number.parseFloat(amount).toFixed(2)} from {source === "bank" ? "Bank Account" : "Credit Card"}
                </p>
                <p className="text-sm text-muted-foreground">Funds will be available immediately in your account.</p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setStep(1)} disabled={isLoading}>
                {t("common.back")}
              </Button>
              <Button onClick={handleAddFunds} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  t("common.confirm")
                )}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
