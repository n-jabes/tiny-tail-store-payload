// app/api/auth/user/route.ts
import { NextResponse } from 'next/server';
import { getUser } from '@/utilities/getUser';

export async function GET() {
  try {
    const { user } = await getUser(); // Fetch user data on the server
    console.log('User from server: ', user)
    return NextResponse.json({ user });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({ user: null }, { status: 500 });
  }
}