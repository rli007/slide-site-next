# 🚀 Route Matching Setup Guide

## Overview
This guide explains how to set up the route matching functionality that integrates your Python algorithm from `helper.txt` into the Slide website.

## 🔑 Required API Keys

### 1. Google Maps API Key
You'll need a Google Maps API key for:
- Distance calculations between locations
- Route optimization
- Geocoding addresses

**Setup Steps:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable these APIs:
   - Distance Matrix API
   - Geocoding API
   - Directions API
4. Create credentials (API Key)
5. Restrict the API key to your domain for security

### 2. Environment Variables
Create a `.env.local` file in your project root:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Google Maps API
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

## 🗄️ Database Schema Updates

The route matching system requires these database tables:

### Routes Table
```sql
CREATE TABLE routes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  start_location TEXT NOT NULL,
  end_location TEXT NOT NULL,
  schedule TEXT NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Deliveries Table
```sql
CREATE TABLE deliveries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shipper_id UUID REFERENCES auth.users(id),
  pickup_location TEXT NOT NULL,
  dropoff_location TEXT NOT NULL,
  package_size TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  route_id UUID REFERENCES routes(id),
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 🧠 How the Route Matching Works

### 1. Algorithm Integration
The system implements your Python algorithm's logic:

- **Distance Calculation**: Uses Google Maps API (with fallback to Haversine formula)
- **Priority Scoring**: High priority = 0.7x, Low priority = 1.3x, Standard = 1.0x
- **Route Matching**: Finds routes with minimal detour distance

### 2. Matching Process
1. **Shipper creates delivery** → System finds matching routes
2. **Route scoring** → Calculates extra distance for each route
3. **Priority weighting** → Applies priority multipliers
4. **Sorting** → Returns routes ordered by best match

### 3. Fallback System
If Google Maps API fails:
- Uses hardcoded Bay Area city coordinates
- Calculates rough distances using Haversine formula
- Provides reasonable estimates for testing

## 🎯 Features Implemented

### Slider Dashboard
- **Available Deliveries**: Shows deliveries matching slider's routes
- **Match Scoring**: Displays quality of each match (Excellent/Good/Fair/Poor)
- **Accept Deliveries**: One-click acceptance of delivery matches
- **Route Details**: Shows extra distance and route information

### Shipper Dashboard
- **Route Suggestions**: Find best routes before creating delivery
- **Match Preview**: See how well routes match before committing
- **Smart Recommendations**: Prioritizes routes with minimal detour

## 🚀 Usage Examples

### For Sliders
1. Create routes in your dashboard
2. View available deliveries that match your routes
3. Accept deliveries with the best match scores
4. See real-time updates on delivery status

### For Shippers
1. Enter pickup and dropoff locations
2. Click "Find Route Matches" to see suggestions
3. View route quality scores and extra distances
4. Create delivery knowing which routes are available

## 🔧 Customization Options

### Priority Levels
You can add priority fields to deliveries:
```typescript
const getPriorityMultiplier = (priority: string): number => {
  switch (priority) {
    case 'High Priority': return 0.7;
    case 'Low Priority': return 1.3;
    case 'Express': return 0.5;      // Add new priorities
    case 'Economy': return 1.5;      // Add new priorities
    default: return 1.0;
  }
};
```

### Distance Thresholds
Adjust match quality thresholds:
```typescript
const formatScore = (score: number): string => {
  if (score < 3000) return 'Excellent';    // Customize thresholds
  if (score < 10000) return 'Good';
  if (score < 25000) return 'Fair';
  return 'Poor';
};
```

### Location Matching
Improve city coordinate fallback:
```typescript
const bayAreaCities = {
  'San Francisco': { lat: 37.7749, lng: -122.4194 },
  'Oakland': { lat: 37.8044, lng: -122.2711 },
  // Add more cities as needed
};
```

## 🧪 Testing

### Test Data
Create sample routes and deliveries to test matching:

```sql
-- Sample route
INSERT INTO routes (user_id, start_location, end_location, schedule, active)
VALUES ('user-uuid', 'San Francisco, CA', 'Oakland, CA', 'Weekdays 9AM-5PM', true);

-- Sample delivery
INSERT INTO deliveries (shipper_id, pickup_location, dropoff_location, package_size, status)
VALUES ('shipper-uuid', 'Hayward, CA', 'San Mateo, CA', 'Medium (5-15 lbs)', 'pending');
```

### API Testing
Test Google Maps integration:
```typescript
// Test distance calculation
const distance = await getDistanceBetweenLocations('San Francisco, CA', 'Oakland, CA');
console.log('Distance:', distance, 'meters');
```

## 🚨 Common Issues

### 1. Google Maps API Errors
- **Error**: "Google Maps API error"
- **Solution**: Check API key, enable required APIs, check billing

### 2. No Route Matches
- **Error**: "No deliveries available"
- **Solution**: Ensure routes are active, check location formats

### 3. Distance Calculation Issues
- **Error**: Inaccurate distances
- **Solution**: Verify Google Maps API key, check fallback coordinates

## 🔮 Future Enhancements

### Phase 4b: Real-time Updates
- Supabase subscriptions for live delivery updates
- Push notifications for new matches
- Real-time status tracking

### Phase 4c: Advanced Features
- Machine learning for better matching
- Route optimization algorithms
- Multi-stop delivery support
- Driver rating integration

## 📚 Additional Resources

- [Google Maps API Documentation](https://developers.google.com/maps/documentation)
- [Supabase Real-time Subscriptions](https://supabase.com/docs/guides/realtime)
- [Haversine Distance Formula](https://en.wikipedia.org/wiki/Haversine_formula)

---

**Need Help?** Contact the development team or check the GitHub issues for common problems.
