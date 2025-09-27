import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const from = searchParams.get('from') || '';
    const to = searchParams.get('to') || '';
    const date = searchParams.get('date') ? new Date(searchParams.get('date')!) : undefined;

    let rides;
    if (from || to || date) {
      rides = await DatabaseService.searchRides(from, to, date);
    } else {
      rides = await DatabaseService.getRides();
    }

    return NextResponse.json({ rides });
  } catch (error) {
    console.error('Error fetching rides:', error);
    return NextResponse.json({ error: 'Failed to fetch rides' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const rideId = await DatabaseService.createRide(body);
    
    return NextResponse.json({ rideId }, { status: 201 });
  } catch (error) {
    console.error('Error creating ride:', error);
    return NextResponse.json({ error: 'Failed to create ride' }, { status: 500 });
  }
}
