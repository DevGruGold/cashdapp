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
import { useUser } from "@/components/user-provider"
import { Loader2 } from "lucide-react"
import { useLanguage } from "./language-provider"

interface RequestMoneyDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function RequestMoneyDialog({ open, onOpenChange }: RequestMoneyDialogProps) {
  const { contacts, requestMoney, isLoading } = useUser()
  const [selectedContact, setSelectedContact] = useState("")
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")
  const [step, setStep] = useState(1)
  const { t } = useLanguage()

  const handleRequest = async () => {
    if (!selectedContact || !amount) return

    const success = await requestMoney(selectedContact, Number.parseFloat(amount), description)
    if (success) {
      resetForm()
      onOpenChange(false)
    }
  }

  const resetForm = () => {
    setSelectedContact("")
    setAmount("")
    setDescription("")
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
          <DialogTitle>{t("home.requestMoney")}</DialogTitle>
          <DialogDescription>Request money from your contacts.</DialogDescription>
        </DialogHeader>

        {step === 1 && (
          <>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="from">From</Label>
                <select
                  id="from"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={selectedContact}
                  onChange={(e) => setSelectedContact(e.target.value)}
                  required
                >
                  <option value="" disabled>
                    Select a contact
                  </option>
                  {contacts.map((contact) => (
                    <option key={contact.id} value={contact.id}>
                      {contact.name} ({contact.email})
                    </option>
                  ))}
                </select>
              </div>
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
                <Label htmlFor="description">Description (Optional)</Label>
                <Input
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What's it for?"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>
                {t("common.cancel")}
              </Button>
              <Button onClick={() => setStep(2)} disabled={!selectedContact || !amount || isLoading}>
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
                  Request ${Number.parseFloat(amount).toFixed(2)} from{" "}
                  {contacts.find((c) => c.id === selectedContact)?.name}
                </p>
                {description && <p className="text-sm text-muted-foreground">For: {description}</p>}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setStep(1)} disabled={isLoading}>
                {t("common.back")}
              </Button>
              <Button onClick={handleRequest} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Requesting...
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
