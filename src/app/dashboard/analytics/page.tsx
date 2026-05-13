"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from "recharts";
import { Loader2 } from "lucide-react";

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const res = await fetch("/api/analytics");
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (error) {
        console.error("Failed to fetch analytics", error);
      } finally {
        setLoading(false);
      }
    }

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const summary = data?.summary || {
    totalProfit: 0,
    totalLoss: 0,
    wonBets: 0,
    lostBets: 0,
    pendingBets: 0,
    roi: "0.0",
  };

  const teamPerformance = data?.teamPerformance || [];

  const winLossData = [
    { name: "Won", value: summary.wonBets, color: "#10b981" },
    { name: "Lost", value: summary.lostBets, color: "#ef4444" },
    { name: "Pending", value: summary.pendingBets, color: "#f59e0b" },
  ].filter(d => d.value > 0);

  // Fallback for empty state
  if (winLossData.length === 0) {
    winLossData.push({ name: "No Bets", value: 1, color: "#334155" });
  }

  // Find biggest win and loss
  let biggestWin = { team: "N/A", profit: 0 };
  let biggestLoss = { team: "N/A", profit: 0 };

  if (teamPerformance.length > 0) {
    biggestWin = teamPerformance[0]; // array is sorted by profit descending
    biggestLoss = teamPerformance[teamPerformance.length - 1];
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-white">Reports & Analytics</h2>
        <p className="text-zinc-400">Deep dive into your betting performance.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-1 bg-gradient-to-br from-card to-card/50">
          <CardHeader>
            <CardTitle className="text-white">Win/Loss Ratio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={winLossData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {winLossData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }} />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-2 bg-gradient-to-br from-card to-card/50">
          <CardHeader>
            <CardTitle className="text-white">Best Performing Teams</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border border-border overflow-x-auto">
              <table className="w-full text-sm text-left text-zinc-300 min-w-[500px]">
                <thead className="text-xs text-zinc-400 uppercase bg-secondary/50">
                  <tr>
                    <th className="px-6 py-3">Team</th>
                    <th className="px-6 py-3 text-center">Total Bets</th>
                    <th className="px-6 py-3 text-right">Profit/Loss</th>
                  </tr>
                </thead>
                <tbody>
                  {teamPerformance.length > 0 ? (
                    teamPerformance.map((item: any, idx: number) => (
                      <tr key={idx} className="border-b border-border hover:bg-secondary/20">
                        <td className="px-6 py-4 font-medium text-white">{item.team}</td>
                        <td className="px-6 py-4 text-center">{item.bets}</td>
                        <td className={`px-6 py-4 text-right font-bold ${
                          item.profit >= 0 ? 'text-emerald-500' : 'text-rose-500'
                        }`}>
                          {item.profit >= 0 ? "+" : "-"}₹{Math.abs(item.profit).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="px-6 py-8 text-center text-zinc-500">
                        No team performance data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-gradient-to-br from-card to-card/50">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-zinc-400">Total ROI</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${Number(summary.roi) >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
              {Number(summary.roi) > 0 ? "+" : ""}{summary.roi}%
            </div>
            <p className="text-xs text-zinc-400 mt-1">Based on total deposited amount</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-card to-card/50">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-zinc-400">Most Profitable Team</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-white">{biggestWin.team}</div>
            {biggestWin.team !== "N/A" && (
              <p className="text-sm text-emerald-500 mt-1">+₹{biggestWin.profit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
            )}
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-card to-card/50">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-zinc-400">Biggest Loss Team</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-white">{biggestLoss.profit < 0 ? biggestLoss.team : "N/A"}</div>
            {biggestLoss.profit < 0 && (
              <p className="text-sm text-rose-500 mt-1">-₹{Math.abs(biggestLoss.profit).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
