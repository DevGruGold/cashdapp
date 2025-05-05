"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useUser, type Transaction } from "@/components/user-provider"
import { Badge } from "@/components/ui/badge"
import { ArrowUpRight, ArrowDownLeft, CreditCard, Wallet, Check, X } from "lucide-react"
import { useLanguage } from "./language-provider"

export function ActivityScreen() {
  const { transactions, currentUser, acceptRequest, rejectRequest } = useUser()
  const [filter, setFilter] = useState<string | null>(null)
  const { t } = useLanguage()

  // Filter transactions based on selected filter
  const filteredTransactions = filter ? transactions.filter((t) => t.type === filter) : transactions

  // Format date to a readable string
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Get icon based on transaction type
  const getTransactionIcon = (transaction: Transaction) => {
    switch (transaction.type) {
      case "payment":
        return <CreditCard className="h-4 w-4" />
      case "transfer":
        return transaction.fromUserId === currentUser?.id ? (
          <ArrowUpRight className="h-4 w-4" />
        ) : (
          <ArrowDownLeft className="h-4 w-4" />
        )
      case "deposit":
        return <ArrowDownLeft className="h-4 w-4 text-green-500" />
      case "withdrawal":
        return <ArrowUpRight className="h-4 w-4 text-red-500" />
      case "tokenization":
        return <Wallet className="h-4 w-4" />
      default:
        return <CreditCard className="h-4 w-4" />
    }
  }

  // Get status badge based on transaction status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="outline" className="bg-green-500/10 text-green-500">
            Completed
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500">
            Pending
          </Badge>
        )
      case "failed":
        return (
          <Badge variant="outline" className="bg-red-500/10 text-red-500">
            Failed
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <div className="flex flex-col min-h-screen p-4 space-y-4 pb-20">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{t("nav.activity")}</h1>
      </div>

      <div className="flex overflow-x-auto pb-2 space-x-2">
        <Button variant={filter === null ? "default" : "outline"} size="sm" onClick={() => setFilter(null)}>
          All
        </Button>
        <Button variant={filter === "transfer" ? "default" : "outline"} size="sm" onClick={() => setFilter("transfer")}>
          Transfers
        </Button>
        <Button variant={filter === "deposit" ? "default" : "outline"} size="sm" onClick={() => setFilter("deposit")}>
          Deposits
        </Button>
        <Button
          variant={filter === "withdrawal" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("withdrawal")}
        >
          Withdrawals
        </Button>
        <Button
          variant={filter === "tokenization" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("tokenization")}
        >
          Tokenization
        </Button>
      </div>

      <div className="space-y-4">
        {filteredTransactions.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center text-muted-foreground">No transactions found.</CardContent>
          </Card>
        ) : (
          filteredTransactions.map((transaction) => (
            <Card key={transaction.id}>
              <CardHeader className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 bg-primary/10 rounded-full">{getTransactionIcon(transaction)}</div>
                    <div>
                      <CardTitle className="text-base">{transaction.description}</CardTitle>
                      <CardDescription>{formatDate(transaction.date)}</CardDescription>
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className={`font-medium ${transaction.fromUserId === currentUser?.id ? "text-red-500" : "text-green-500"}`}
                    >
                      {transaction.fromUserId === currentUser?.id ? "-" : "+"}${transaction.amount.toFixed(2)}
                    </div>
                    <div>{getStatusBadge(transaction.status)}</div>
                  </div>
                </div>
              </CardHeader>
              {transaction.status === "pending" && transaction.fromUserId === currentUser?.id && (
                <CardContent className="pt-0 pb-4 px-4">
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" size="sm" onClick={() => rejectRequest(transaction.id)} className="h-8">
                      <X className="h-4 w-4 mr-1" />
                      {t("common.cancel")}
                    </Button>
                    <Button size="sm" onClick={() => acceptRequest(transaction.id)} className="h-8">
                      <Check className="h-4 w-4 mr-1" />
                      {t("common.confirm")}
                    </Button>
                  </div>
                </CardContent>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
