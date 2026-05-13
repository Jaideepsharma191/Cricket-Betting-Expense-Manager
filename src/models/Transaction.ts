import mongoose, { Document, Model, Schema } from "mongoose";

export interface ITransaction extends Document {
  userId: mongoose.Types.ObjectId;
  type: "Deposit" | "Withdrawal";
  amount: number;
  date: Date;
  netEarnings?: number; // Optional tracking of net earnings after this transaction
  createdAt: Date;
  updatedAt: Date;
}

const TransactionSchema = new Schema<ITransaction>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["Deposit", "Withdrawal"], required: true },
    amount: { type: Number, required: true },
    date: { type: Date, required: true },
    netEarnings: { type: Number },
  },
  { timestamps: true }
);

export const Transaction: Model<ITransaction> =
  mongoose.models.Transaction || mongoose.model<ITransaction>("Transaction", TransactionSchema);
