# Google Maps API Setup Guide

## Overview
This application now uses Google Maps API for accurate distance calculations between locations. The API calls are made server-side to avoid CORS issues and protect your API key.

## Setup Steps

### 1. Get Google Maps API Key
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - **Distance Matrix API** - for calculating distances between locations
   - **Geocoding API** - for converting addresses to coordinates (optional)
   - **Directions API** - for route planning (optional)

### 2. Create API Key
1. In the Google Cloud Console, go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "API Key"
3. Copy the generated API key

### 3. Restrict API Key (Recommended)
1. Click on the created API key
2. Under "Application restrictions", select "HTTP referrers (web sites)"
3. Add your domain(s): `https://yourdomain.com/*`
4. Under "API restrictions", select "Restrict key" and choose only the APIs you enabled
5. Click "Save"

### 4. Environment Variables
1. Copy `.env.example` to `.env.local`
2. Add your Google Maps API key:
   ```bash
   GOOGLE_MAPS_API_KEY=your_actual_api_key_here
   ```
3. **Important**: Do NOT add `NEXT_PUBLIC_` prefix to this variable
4. The API key should only be accessible server-side

### 5. Deploy to Production
- **Vercel**: Add `GOOGLE_MAPS_API_KEY` to your project's environment variables
- **Other platforms**: Add the environment variable according to your hosting provider's instructions

## API Endpoints

### Single Distance Calculation
```
POST /api/distance
{
  "origins": "San Francisco, CA",
  "destinations": "Oakland, CA"
}
```

### Batch Distance Calculation
```
POST /api/distance/batch
{
  "calculations": [
    {
      "id": "calc1",
      "origins": "San Francisco, CA",
      "destinations": "Oakland, CA"
    },
    {
      "id": "calc2", 
      "origins": "Oakland, CA",
      "destinations": "San Jose, CA"
    }
  ]
}
```

## Fallback System
If the Google Maps API fails, the system automatically falls back to:
1. **Haversine formula** - for known city coordinates
2. **Default distances** - for unknown locations

## Cost Considerations
- Google Maps API has usage limits and costs
- Distance Matrix API: $5 per 1000 requests
- Consider implementing caching for frequently requested routes
- Monitor usage in Google Cloud Console

## Security Notes
- API key is never exposed to the frontend
- All requests go through your Next.js API routes
- Implement rate limiting if needed
- Consider IP restrictions for additional security

## Testing
1. Start your development server: `npm run dev`
2. Check the console for API call logs
3. Verify distances are calculated correctly
4. Test fallback behavior by temporarily disabling the API key
