import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const rideId = searchParams.get('rideId');

    if (!rideId) {
      return NextResponse.json({ error: 'Missing rideId' }, { status: 400 });
    }

    const requests = await DatabaseService.getRideRequestsByRide(rideId);
    return NextResponse.json({ requests });
  } catch (error) {
    console.error('Error fetching ride requests:', error);
    return NextResponse.json({ error: 'Failed to fetch ride requests' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const requestId = await DatabaseService.createRideRequest(body);
    
    return NextResponse.json({ requestId }, { status: 201 });
  } catch (error) {
    console.error('Error creating ride request:', error);
    return NextResponse.json({ error: 'Failed to create ride request' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { requestId, status } = body;
    
    await DatabaseService.updateRideRequestStatus(requestId, status);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating ride request:', error);
    return NextResponse.json({ error: 'Failed to update ride request' }, { status: 500 });
  }
}
