"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AddBetPage() {
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
          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Match Name</label>
                <Input placeholder="e.g. CSK vs MI" className="text-white" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Team Name</label>
                <Input placeholder="e.g. Chennai Super Kings" className="text-white" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Betting Amount (₹)</label>
                <Input type="number" placeholder="1000" className="text-white" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Odds/Rate</label>
                <Input type="number" step="0.01" placeholder="1.85" className="text-white" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Status</label>
                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 text-white">
                  <option value="Pending">Pending</option>
                  <option value="Won">Won</option>
                  <option value="Lost">Lost</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Date</label>
                <Input type="date" className="text-white [color-scheme:dark]" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Notes (Optional)</label>
              <textarea 
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-white"
                placeholder="Any special conditions..."
              />
            </div>
            <div className="pt-4 flex justify-end gap-2">
              <Button variant="outline" type="button">Cancel</Button>
              <Button type="submit">Save Bet Entry</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
