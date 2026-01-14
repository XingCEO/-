import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET all bookings
export async function GET() {
  try {
    const bookings = await prisma.booking.findMany({
      include: { service: true },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}
