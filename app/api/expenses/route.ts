import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Expense from '@/models/Expense';

export async function GET(request: Request) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month');
    const year = searchParams.get('year');

    let query: any = {};
    
    if (month && year) {
      const startDate = new Date(Number(year), Number(month) - 1, 1);
      const endDate = new Date(Number(year), Number(month), 1);
      query.date = { $gte: startDate, $lt: endDate };
    }

    // Sort by date descending (newest first)
    const expenses = await Expense.find(query).sort({ date: -1 });
    return NextResponse.json({ success: true, data: expenses });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch expenses' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const expense = await Expense.create(body);
    return NextResponse.json({ success: true, data: expense }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create expense' }, { status: 400 });
  }
}
