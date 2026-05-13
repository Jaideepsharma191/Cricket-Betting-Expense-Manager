"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDownIcon, ArrowUpIcon, IndianRupee, TrendingUp, Activity, Loader2 } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [recentBets, setRecentBets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [analyticsRes, betsRes] = await Promise.all([
          fetch("/api/analytics"),
          fetch("/api/bets?limit=5")
        ]);

        if (analyticsRes.ok && betsRes.ok) {
          const analyticsData = await analyticsRes.json();
          const betsData = await betsRes.json();
          
          setData(analyticsData);
          setRecentBets(betsData.bets);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Ensure safe fallbacks
  const summary = data?.summary || { currentBalance: 0, totalProfit: 0, totalLoss: 0, pendingBets: 0 };
  const chartData = data?.chartData || [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-white">Dashboard</h2>
        <p className="text-zinc-400">Welcome back! Here's your betting overview.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-card to-card/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Total Balance</CardTitle>
            <IndianRupee className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">₹{summary.currentBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
            <p className="text-xs text-zinc-400 mt-1 flex items-center">
              Net balance from all settled bets
            </p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-card to-card/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Total Profit</CardTitle>
            <TrendingUp className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">+₹{summary.totalProfit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
            <p className="text-xs text-zinc-400 mt-1">Overall earnings</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-card to-card/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Total Loss</CardTitle>
            <TrendingUp className="h-4 w-4 text-destructive rotate-180" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">-₹{summary.totalLoss.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
            <p className="text-xs text-zinc-400 mt-1">Overall losses</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-card to-card/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Active Bets</CardTitle>
            <Activity className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{summary.pendingBets}</div>
            <p className="text-xs text-zinc-400 mt-1">Pending outcomes</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 bg-gradient-to-br from-card to-card/50">
          <CardHeader>
            <CardTitle className="text-white">Monthly Performance</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[350px] w-full">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value}`} />
                    <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }} />
                    <Bar dataKey="profit" fill="#10b981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="loss" fill="#ef4444" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-zinc-500">
                  No data available yet
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-3 bg-gradient-to-br from-card to-card/50">
          <CardHeader>
            <CardTitle className="text-white">Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {recentBets.length > 0 ? (
                recentBets.map((bet) => (
                  <div key={bet._id} className="flex items-center">
                    <div className="w-9 h-9 rounded-full bg-primary/20 border border-primary flex items-center justify-center mr-4">
                      <Activity className="w-4 h-4 text-primary" />
                    </div>
                    <div className="ml-4 space-y-1 flex-1 min-w-0">
                      <p className="text-sm font-medium leading-none text-white truncate">{bet.matchName}</p>
                      <p className="text-sm text-zinc-400 truncate">Bet on {bet.teamName}</p>
                    </div>
                    <div className={`ml-auto font-medium ${bet.status === "Won" ? "text-accent" : bet.status === "Lost" ? "text-destructive" : "text-primary"}`}>
                      {bet.status === "Won" ? "+" : bet.status === "Lost" ? "-" : ""}₹{bet.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-zinc-500 text-sm text-center py-4">
                  No recent activities found
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
