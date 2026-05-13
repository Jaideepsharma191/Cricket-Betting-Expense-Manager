import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { Bet } from "@/models/Bet";
import { getUserFromCookies } from "@/lib/auth";

// GET single bet
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUserFromCookies();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const { id } = await params;

    const bet = await Bet.findOne({ _id: id, userId: user.id });
    if (!bet) {
      return NextResponse.json({ error: "Bet not found" }, { status: 404 });
    }

    return NextResponse.json({ bet });
  } catch (error) {
    console.error("Get bet error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PUT update bet
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUserFromCookies();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const { id } = await params;
    const body = await req.json();

    // Recalculate profitOrLoss if status changed
    if (body.status && body.amount && body.odds) {
      if (body.status === "Won") {
        body.profitOrLoss = body.amount * body.odds - body.amount;
      } else if (body.status === "Lost") {
        body.profitOrLoss = -body.amount;
      } else {
        body.profitOrLoss = 0;
      }
    }

    const bet = await Bet.findOneAndUpdate(
      { _id: id, userId: user.id },
      { $set: body },
      { new: true }
    );

    if (!bet) {
      return NextResponse.json({ error: "Bet not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Bet updated", bet });
  } catch (error) {
    console.error("Update bet error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE bet
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUserFromCookies();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const { id } = await params;

    const bet = await Bet.findOneAndDelete({ _id: id, userId: user.id });
    if (!bet) {
      return NextResponse.json({ error: "Bet not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Bet deleted" });
  } catch (error) {
    console.error("Delete bet error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
