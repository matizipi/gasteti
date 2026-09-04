import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Expense from '@/models/Expense';

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const { id } = params;

    const deletedExpense = await Expense.findByIdAndDelete(id);

    if (!deletedExpense) {
      return NextResponse.json({ success: false, error: 'Expense not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: {} }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete expense' }, { status: 400 });
  }
}
