import mongoose, { Document, Model, Schema } from "mongoose";

export interface IBet extends Document {
  userId: mongoose.Types.ObjectId;
  matchName: string;
  teamName: string;
  amount: number;
  odds: number;
  status: "Won" | "Lost" | "Pending";
  profitOrLoss: number;
  date: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const BetSchema = new Schema<IBet>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    matchName: { type: String, required: true },
    teamName: { type: String, required: true },
    amount: { type: Number, required: true },
    odds: { type: Number, required: true },
    status: { type: String, enum: ["Won", "Lost", "Pending"], default: "Pending" },
    profitOrLoss: { type: Number, default: 0 },
    date: { type: Date, required: true },
    notes: { type: String },
  },
  { timestamps: true }
);

export const Bet: Model<IBet> =
  mongoose.models.Bet || mongoose.model<IBet>("Bet", BetSchema);
