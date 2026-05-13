import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { Transaction } from "@/models/Transaction";
import { getUserFromCookies } from "@/lib/auth";

// GET all transactions
export async function GET() {
  try {
    const user = await getUserFromCookies();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const transactions = await Transaction.find({ userId: user.id }).sort({ date: -1 });

    const totalDeposited = transactions
      .filter((t) => t.type === "Deposit")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalWithdrawn = transactions
      .filter((t) => t.type === "Withdrawal")
      .reduce((sum, t) => sum + t.amount, 0);

    return NextResponse.json({
      transactions,
      summary: { totalDeposited, totalWithdrawn, netBalance: totalDeposited - totalWithdrawn },
    });
  } catch (error) {
    console.error("Get transactions error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST create a new transaction
export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromCookies();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const { type, amount, date } = await req.json();

    if (!type || !amount || !date) {
      return NextResponse.json({ error: "Type, amount, and date are required" }, { status: 400 });
    }

    const transaction = await Transaction.create({
      userId: user.id,
      type,
      amount,
      date: new Date(date),
    });

    return NextResponse.json({ message: "Transaction created", transaction }, { status: 201 });
  } catch (error) {
    console.error("Create transaction error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
