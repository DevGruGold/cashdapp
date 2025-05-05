"use client"

import { Card, CardContent } from "@/components/ui/card"
import { ArrowDown, ArrowUp, Clock } from "lucide-react"
import { formatCurrency } from "@/lib/utils"

export interface ColdWalletTransaction {
  id: string
  type: "deposit" | "withdraw"
  amount: number
  date: string
  status: "completed" | "pending" | "failed"
  description: string
}

interface TransactionHistoryProps {
  transactions: ColdWalletTransaction[]
}

export function TransactionHistory({ transactions }: TransactionHistoryProps) {
  if (transactions.length === 0) {
    return (
      <Card>
        <CardContent className="p-4 text-center">
          <p className="text-muted-foreground">No transaction history</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-2">
      {transactions.map((transaction) => (
        <Card key={transaction.id}>
          <CardContent className="p-3 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                {transaction.type === "deposit" ? (
                  <ArrowDown className="h-4 w-4 text-green-500" />
                ) : (
                  <ArrowUp className="h-4 w-4 text-red-500" />
                )}
              </div>
              <div>
                <p className="font-medium">
                  {transaction.type === "deposit" ? "Deposited to" : "Withdrawn from"} Cold Wallet
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date(transaction.date).toLocaleString()} • {transaction.description}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className={`font-medium ${transaction.type === "deposit" ? "text-green-500" : "text-red-500"}`}>
                {transaction.type === "deposit" ? "+" : "-"}
                {formatCurrency(transaction.amount)}
              </p>
              <p className="text-xs">
                {transaction.status === "completed" ? (
                  <span className="text-green-500">Completed</span>
                ) : transaction.status === "pending" ? (
                  <span className="text-yellow-500 flex items-center">
                    <Clock className="h-3 w-3 mr-1" /> Pending
                  </span>
                ) : (
                  <span className="text-red-500">Failed</span>
                )}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
