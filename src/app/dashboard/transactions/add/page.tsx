"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function AddTransactionPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    type: "Deposit",
    amount: "",
    date: new Date().toISOString().split("T")[0],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          amount: Number(formData.amount),
        }),
      });

      if (res.ok) {
        router.push("/dashboard/transactions");
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || "Failed to add transaction");
      }
    } catch (err) {
      console.error("Error submitting transaction", err);
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-white">Add Transaction</h2>
        <p className="text-zinc-400">Record a new deposit or withdrawal to your wallet.</p>
      </div>

      <Card className="max-w-2xl bg-gradient-to-br from-card to-card/50">
        <CardHeader>
          <CardTitle className="text-white">Transaction Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="text-destructive text-sm font-medium">{error}</div>}
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Transaction Type</label>
                <select 
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 text-white"
                >
                  <option value="Deposit">Deposit (+)</option>
                  <option value="Withdrawal">Withdrawal (-)</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Amount (₹)</label>
                <Input 
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  type="number" 
                  min="1"
                  placeholder="e.g. 5000" 
                  className="text-white" 
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Date</label>
                <Input 
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  type="date" 
                  className="text-white [color-scheme:dark]" 
                  required
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-2">
              <Button variant="outline" type="button" onClick={() => router.back()}>Cancel</Button>
              <Button type="submit" disabled={loading}>
                {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : "Save Transaction"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
