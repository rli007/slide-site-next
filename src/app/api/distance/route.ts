import { NextRequest, NextResponse } from 'next/server';

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

export async function POST(request: NextRequest) {
  try {
    const { origins, destinations } = await request.json();

    if (!origins || !destinations) {
      return NextResponse.json(
        { error: 'Origins and destinations are required' },
        { status: 400 }
      );
    }

    if (!GOOGLE_MAPS_API_KEY) {
      return NextResponse.json(
        { error: 'Google Maps API key not configured' },
        { status: 500 }
      );
    }

    // Build the Google Maps Distance Matrix API URL
    const url = new URL('https://maps.googleapis.com/maps/api/distancematrix/json');
    url.searchParams.set('origins', origins);
    url.searchParams.set('destinations', destinations);
    url.searchParams.set('key', GOOGLE_MAPS_API_KEY);
    url.searchParams.set('mode', 'driving');
    url.searchParams.set('units', 'metric');

    console.log('🌍 Calling Google Maps API:', url.toString());

    // Make the request to Google Maps API
    const response = await fetch(url.toString());
    const data = await response.json();

    if (data.status !== 'OK') {
      console.error('❌ Google Maps API error:', data);
      return NextResponse.json(
        { error: `Google Maps API error: ${data.status}`, details: data },
        { status: 400 }
      );
    }

    console.log('✅ Google Maps API response:', data);

    // Extract the distance value (in meters)
    const distance = data.rows[0]?.elements[0]?.distance?.value || 0;
    const duration = data.rows[0]?.elements[0]?.duration?.value || 0; // in seconds

    return NextResponse.json({
      distance, // in meters
      duration, // in seconds
      distanceText: data.rows[0]?.elements[0]?.distance?.text,
      durationText: data.rows[0]?.elements[0]?.duration?.text,
      status: data.status
    });

  } catch (error) {
    console.error('❌ Distance calculation error:', error);
    return NextResponse.json(
      { error: 'Failed to calculate distance' },
      { status: 500 }
    );
  }
}
