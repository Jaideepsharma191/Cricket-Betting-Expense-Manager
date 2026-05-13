import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { Bet } from "@/models/Bet";
import { getUserFromCookies } from "@/lib/auth";

// GET all bets for authenticated user
export async function GET(req: NextRequest) {
  try {
    const user = await getUserFromCookies();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const query: Record<string, unknown> = { userId: user.id };
    if (status && status !== "All") query.status = status;
    if (search) {
      query.$or = [
        { matchName: { $regex: search, $options: "i" } },
        { teamName: { $regex: search, $options: "i" } },
      ];
    }

    const total = await Bet.countDocuments(query);
    const bets = await Bet.find(query)
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return NextResponse.json({
      bets,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("Get bets error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST create a new bet
export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromCookies();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const body = await req.json();
    const { matchName, teamName, amount, odds, status, date, notes } = body;

    if (!matchName || !teamName || !amount || !odds || !date) {
      return NextResponse.json({ error: "Required fields missing" }, { status: 400 });
    }

    let profitOrLoss = 0;
    if (status === "Won") {
      profitOrLoss = amount * odds - amount;
    } else if (status === "Lost") {
      profitOrLoss = -amount;
    }

    const bet = await Bet.create({
      userId: user.id,
      matchName,
      teamName,
      amount,
      odds,
      status: status || "Pending",
      profitOrLoss,
      date: new Date(date),
      notes,
    });

    return NextResponse.json({ message: "Bet created", bet }, { status: 201 });
  } catch (error) {
    console.error("Create bet error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
