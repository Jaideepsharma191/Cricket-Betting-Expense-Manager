"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowDownRight, ArrowUpRight, Plus, Loader2 } from "lucide-react";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [summary, setSummary] = useState({ totalDeposited: 0, totalWithdrawn: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTransactions() {
      try {
        const res = await fetch("/api/transactions");
        if (res.ok) {
          const data = await res.json();
          setTransactions(data.transactions);
          setSummary(data.summary);
        }
      } catch (error) {
        console.error("Failed to fetch transactions", error);
      } finally {
        setLoading(false);
      }
    }

    fetchTransactions();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

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
            <div className="text-2xl font-bold text-emerald-500">
              ₹{summary.totalDeposited.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-card to-card/50 border-rose-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Total Withdrawn</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-rose-500">
              ₹{summary.totalWithdrawn.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </div>
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
                  <th className="px-6 py-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {transactions.length > 0 ? (
                  transactions.map((tx) => (
                    <tr key={tx._id} className="border-b border-border hover:bg-secondary/20">
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
                      <td className="px-6 py-4">{new Date(tx.date).toLocaleDateString()}</td>
                      <td className={`px-6 py-4 text-right font-medium ${
                        tx.type === "Deposit" ? "text-emerald-500" : "text-white"
                      }`}>
                        {tx.type === "Deposit" ? "+" : "-"}₹{tx.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="px-6 py-8 text-center text-zinc-500">
                      No transactions found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
