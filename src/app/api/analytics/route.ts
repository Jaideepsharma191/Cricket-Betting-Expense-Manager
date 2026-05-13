import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { Bet } from "@/models/Bet";
import { Transaction } from "@/models/Transaction";
import { getUserFromCookies } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getUserFromCookies();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    // Total stats
    const bets = await Bet.find({ userId: user.id });

    const totalBetAmount = bets.reduce((sum, b) => sum + b.amount, 0);
    const totalProfit = bets.filter((b) => b.status === "Won").reduce((sum, b) => sum + b.profitOrLoss, 0);
    const totalLoss = bets.filter((b) => b.status === "Lost").reduce((sum, b) => sum + Math.abs(b.profitOrLoss), 0);
    const pendingBets = bets.filter((b) => b.status === "Pending").length;
    const wonBets = bets.filter((b) => b.status === "Won").length;
    const lostBets = bets.filter((b) => b.status === "Lost").length;

    // Win/loss ratio
    const totalResolved = wonBets + lostBets;
    const winRate = totalResolved > 0 ? ((wonBets / totalResolved) * 100).toFixed(1) : "0.0";

    // Total ROI
    const transactions = await Transaction.find({ userId: user.id });
    const totalDeposited = transactions.filter((t) => t.type === "Deposit").reduce((sum, t) => sum + t.amount, 0);
    const totalWithdrawn = transactions.filter((t) => t.type === "Withdrawal").reduce((sum, t) => sum + t.amount, 0);
    const roi = totalDeposited > 0 ? (((totalProfit - totalLoss) / totalDeposited) * 100).toFixed(1) : "0.0";

    // Best performing teams
    const teamMap: Record<string, { profit: number; bets: number }> = {};
    bets.forEach((bet) => {
      if (!teamMap[bet.teamName]) teamMap[bet.teamName] = { profit: 0, bets: 0 };
      teamMap[bet.teamName].profit += bet.profitOrLoss;
      teamMap[bet.teamName].bets += 1;
    });

    const teamPerformance = Object.entries(teamMap)
      .map(([team, data]) => ({ team, ...data }))
      .sort((a, b) => b.profit - a.profit);

    // Monthly data (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyBets = bets.filter((b) => new Date(b.date) >= sixMonthsAgo);
    const monthlyData: Record<string, { profit: number; loss: number }> = {};

    monthlyBets.forEach((bet) => {
      const monthKey = new Date(bet.date).toLocaleString("en-US", { month: "short" });
      if (!monthlyData[monthKey]) monthlyData[monthKey] = { profit: 0, loss: 0 };
      if (bet.profitOrLoss > 0) monthlyData[monthKey].profit += bet.profitOrLoss;
      else monthlyData[monthKey].loss += Math.abs(bet.profitOrLoss);
    });

    const chartData = Object.entries(monthlyData).map(([name, data]) => ({ name, ...data }));

    return NextResponse.json({
      summary: {
        totalBetAmount,
        totalProfit,
        totalLoss,
        currentBalance: totalDeposited - totalWithdrawn + totalProfit - totalLoss,
        pendingBets,
        wonBets,
        lostBets,
        winRate,
        roi,
      },
      teamPerformance,
      chartData,
    });
  } catch (error) {
    console.error("Analytics error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
