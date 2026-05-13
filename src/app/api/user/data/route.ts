import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { Bet } from "@/models/Bet";
import { Transaction } from "@/models/Transaction";
import { getUserFromCookies } from "@/lib/auth";

export async function DELETE(req: NextRequest) {
  try {
    await dbConnect();
    const user = await getUserFromCookies();
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Delete all user bets and transactions
    if (Bet) await Bet.deleteMany({ userId: user.id });
    if (Transaction) await Transaction.deleteMany({ userId: user.id });

    return NextResponse.json({ message: "All data deleted successfully" });
  } catch (error) {
    console.error("Delete data error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
