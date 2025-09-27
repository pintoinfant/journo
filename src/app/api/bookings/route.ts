import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const guestId = searchParams.get('guestId');
    const hostId = searchParams.get('hostId');

    let bookings;
    if (guestId) {
      bookings = await DatabaseService.getBookingsByGuest(guestId);
    } else if (hostId) {
      bookings = await DatabaseService.getBookingsByHost(hostId);
    } else {
      return NextResponse.json({ error: 'Missing guestId or hostId' }, { status: 400 });
    }

    return NextResponse.json({ bookings });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const bookingId = await DatabaseService.createBooking(body);
    
    return NextResponse.json({ bookingId }, { status: 201 });
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { bookingId, status } = body;
    
    await DatabaseService.updateBookingStatus(bookingId, status);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating booking:', error);
    return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 });
  }
}
