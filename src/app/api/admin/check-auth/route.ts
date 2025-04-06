import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  const adminToken = cookies().get('admin_token')?.value;
  
  if (!adminToken) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
  
  // In a real implementation, you would verify the token
  // For this example, we'll just check if it exists
  return NextResponse.json({ authenticated: true }, { status: 200 });
} 