"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowDownRight, ArrowUpRight, Plus } from "lucide-react";

export default function TransactionsPage() {
  const transactions = [
    { id: 1, type: "Deposit", amount: 5000, date: "2026-05-10", status: "Completed" },
    { id: 2, type: "Withdrawal", amount: 1500, date: "2026-05-08", status: "Completed" },
    { id: 3, type: "Deposit", amount: 2000, date: "2026-05-05", status: "Completed" },
    { id: 4, type: "Withdrawal", amount: 3000, date: "2026-05-01", status: "Pending" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Expense Tracking</h2>
          <p className="text-zinc-400">Manage your deposits and withdrawals.</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Transaction
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-gradient-to-br from-card to-card/50 border-emerald-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Total Deposited</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-500">₹12,500.00</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-card to-card/50 border-rose-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Total Withdrawn</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-rose-500">₹4,500.00</div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gradient-to-br from-card to-card/50">
        <CardHeader>
          <CardTitle className="text-white">Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-border">
            <table className="w-full text-sm text-left text-zinc-300">
              <thead className="text-xs text-zinc-400 uppercase bg-secondary/50">
                <tr>
                  <th className="px-6 py-3">Type</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx.id} className="border-b border-border hover:bg-secondary/20">
                    <td className="px-6 py-4 flex items-center gap-2">
                      {tx.type === "Deposit" ? (
                        <div className="p-1 rounded-full bg-emerald-500/20 text-emerald-500">
                          <ArrowDownRight className="w-4 h-4" />
                        </div>
                      ) : (
                        <div className="p-1 rounded-full bg-rose-500/20 text-rose-500">
                          <ArrowUpRight className="w-4 h-4" />
                        </div>
                      )}
                      <span className="font-medium text-white">{tx.type}</span>
                    </td>
                    <td className="px-6 py-4">{tx.date}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        tx.status === "Completed" ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"
                      }`}>
                        {tx.status}
                      </span>
                    </td>
                    <td className={`px-6 py-4 text-right font-medium ${
                      tx.type === "Deposit" ? "text-emerald-500" : "text-white"
                    }`}>
                      {tx.type === "Deposit" ? "+" : "-"}₹{tx.amount.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
