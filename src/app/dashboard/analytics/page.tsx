"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from "recharts";

export default function AnalyticsPage() {
  const winLossData = [
    { name: "Won", value: 12, color: "#10b981" },
    { name: "Lost", value: 5, color: "#ef4444" },
    { name: "Pending", value: 3, color: "#f59e0b" },
  ];

  const teamPerformance = [
    { team: "CSK", ROI: "+15.2%", bets: 8 },
    { team: "MI", ROI: "-5.4%", bets: 5 },
    { team: "RCB", ROI: "+2.1%", bets: 6 },
    { team: "KKR", ROI: "+8.9%", bets: 4 },
  ];

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
            <div className="rounded-md border border-border">
              <table className="w-full text-sm text-left text-zinc-300">
                <thead className="text-xs text-zinc-400 uppercase bg-secondary/50">
                  <tr>
                    <th className="px-6 py-3">Team</th>
                    <th className="px-6 py-3 text-center">Total Bets</th>
                    <th className="px-6 py-3 text-right">ROI</th>
                  </tr>
                </thead>
                <tbody>
                  {teamPerformance.map((item, idx) => (
                    <tr key={idx} className="border-b border-border hover:bg-secondary/20">
                      <td className="px-6 py-4 font-medium text-white">{item.team}</td>
                      <td className="px-6 py-4 text-center">{item.bets}</td>
                      <td className={`px-6 py-4 text-right font-bold ${
                        item.ROI.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'
                      }`}>
                        {item.ROI}
                      </td>
                    </tr>
                  ))}
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
            <div className="text-3xl font-bold text-emerald-500">+12.5%</div>
            <p className="text-xs text-zinc-400 mt-1">Based on total deposited amount</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-card to-card/50">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-zinc-400">Most Profitable Match</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-white">CSK vs MI (Final)</div>
            <p className="text-sm text-emerald-500 mt-1">+₹5,400.00</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-card to-card/50">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-zinc-400">Biggest Loss</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-white">RCB vs KKR</div>
            <p className="text-sm text-rose-500 mt-1">-₹2,000.00</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
