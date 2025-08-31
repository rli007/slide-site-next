import { NextRequest, NextResponse } from 'next/server';

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

export async function POST(request: NextRequest) {
  try {
    const { calculations } = await request.json();

    if (!calculations || !Array.isArray(calculations)) {
      return NextResponse.json(
        { error: 'Calculations array is required' },
        { status: 400 }
      );
    }

    if (!GOOGLE_MAPS_API_KEY) {
      return NextResponse.json(
        { error: 'Google Maps API key not configured' },
        { status: 500 }
      );
    }

    console.log(`🌍 Processing ${calculations.length} distance calculations`);

    const results = [];

    for (const calc of calculations) {
      const { origins, destinations, id } = calc;
      
      try {
        // Build the Google Maps Distance Matrix API URL
        const url = new URL('https://maps.googleapis.com/maps/api/distancematrix/json');
        url.searchParams.set('origins', origins);
        url.searchParams.set('destinations', destinations);
        url.searchParams.set('key', GOOGLE_MAPS_API_KEY);
        url.searchParams.set('mode', 'driving');
        url.searchParams.set('units', 'metric');

        // Make the request to Google Maps API
        const response = await fetch(url.toString());
        const data = await response.json();

        if (data.status === 'OK') {
          const distance = data.rows[0]?.elements[0]?.distance?.value || 0;
          const duration = data.rows[0]?.elements[0]?.duration?.value || 0;
          
          results.push({
            id,
            success: true,
            distance,
            duration,
            distanceText: data.rows[0]?.elements[0]?.distance?.text,
            durationText: data.rows[0]?.elements[0]?.duration?.text
          });
        } else {
          results.push({
            id,
            success: false,
            error: `Google Maps API error: ${data.status}`,
            distance: 0,
            duration: 0
          });
        }
      } catch (error) {
        results.push({
          id,
          success: false,
          error: 'Request failed',
          distance: 0,
          duration: 0
        });
      }
    }

    console.log(`✅ Processed ${results.length} calculations`);

    return NextResponse.json({
      results,
      totalProcessed: results.length
    });

  } catch (error) {
    console.error('❌ Batch distance calculation error:', error);
    return NextResponse.json(
      { error: 'Failed to process batch distance calculations' },
      { status: 500 }
    );
  }
}
