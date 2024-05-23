import mongoose, { Document, Schema } from 'mongoose';

interface TransactionModel {
  transactionDate: Date;
  description: string;
  debit: number;
  credit: number;
  balance: number;
  category: string;
}

interface TransactionDocument extends Document {
  userId: string;
  transactions: TransactionModel[];
}

const transactionSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  transactions: [
    {
      transactionDate: { type: String, required: true },
      description: { type: String, required: true },
      debit: { type: String },
      credit: { type: String },
      balance: { type: String },
      category: { type: String },
    },
  ],
});

export const TransactionModel = mongoose.model<TransactionDocument>(
  'Transaction',
  transactionSchema,
);
