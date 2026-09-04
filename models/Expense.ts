import mongoose from 'mongoose';

export interface IExpense extends mongoose.Document {
  amount: number;
  category: string;
  date: Date;
  paidBy: string;
  description: string;
  personalAmount?: number;
  personalFor?: string;
  createdAt: Date;
}

const ExpenseSchema = new mongoose.Schema<IExpense>({
  amount: {
    type: Number,
    required: [true, 'Please provide an amount'],
  },
  category: {
    type: String,
    required: [true, 'Please provide a category'],
  },
  date: {
    type: Date,
    default: Date.now,
  },
  paidBy: {
    type: String,
    required: [true, 'Please provide who paid this expense'],
  },
  description: {
    type: String,
    default: '',
  },
  personalAmount: {
    type: Number,
    default: 0,
  },
  personalFor: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Expense || mongoose.model<IExpense>('Expense', ExpenseSchema);
