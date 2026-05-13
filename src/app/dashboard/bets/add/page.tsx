"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function AddBetPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    matchName: "",
    teamName: "",
    amount: "",
    odds: "",
    status: "Pending",
    date: new Date().toISOString().split("T")[0],
    notes: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/bets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          amount: Number(formData.amount),
          odds: Number(formData.odds),
        }),
      });

      if (res.ok) {
        router.push("/dashboard");
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || "Failed to add bet");
      }
    } catch (err) {
      console.error("Error submitting bet", err);
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-white">Add New Bet</h2>
        <p className="text-zinc-400">Record a new cricket bet entry.</p>
      </div>

      <Card className="max-w-2xl bg-gradient-to-br from-card to-card/50">
        <CardHeader>
          <CardTitle className="text-white">Bet Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="text-destructive text-sm font-medium">{error}</div>}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Match Name</label>
                <Input 
                  name="matchName"
                  value={formData.matchName}
                  onChange={handleChange}
                  placeholder="e.g. CSK vs MI" 
                  className="text-white" 
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Team Name</label>
                <Input 
                  name="teamName"
                  value={formData.teamName}
                  onChange={handleChange}
                  placeholder="e.g. Chennai Super Kings" 
                  className="text-white" 
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Betting Amount (₹)</label>
                <Input 
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  type="number" 
                  min="0"
                  placeholder="1000" 
                  className="text-white" 
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Odds/Rate</label>
                <Input 
                  name="odds"
                  value={formData.odds}
                  onChange={handleChange}
                  type="number" 
                  step="0.01" 
                  min="1"
                  placeholder="1.85" 
                  className="text-white" 
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Status</label>
                <select 
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 text-white"
                >
                  <option value="Pending">Pending</option>
                  <option value="Won">Won</option>
                  <option value="Lost">Lost</option>
                </select>
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
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Notes (Optional)</label>
              <textarea 
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-white"
                placeholder="Any special conditions..."
              />
            </div>
            <div className="pt-4 flex justify-end gap-2">
              <Button variant="outline" type="button" onClick={() => router.back()}>Cancel</Button>
              <Button type="submit" disabled={loading}>
                {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : "Save Bet Entry"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
