import { NextResponse } from 'next/server';
export async function POST() {
    return NextResponse.json({ message: 'Password successfully reset' }, { status: 200 });
  }
  