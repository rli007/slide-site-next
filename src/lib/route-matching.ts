import { supabase } from './supabase';
import type { Database } from './supabase';

type Route = Database['public']['Tables']['routes']['Row'];
type Delivery = Database['public']['Tables']['deliveries']['Row'];

interface MatchScore {
  route: Route;
  score: number;
  extraDistance: number;
  pickupToOrigin: number;
  destinationToDelivery: number;
}

interface RouteMatch {
  delivery: Delivery;
  matches: MatchScore[];
  bestMatch?: MatchScore;
}

// Google Maps API integration (you'll need to add your API key)
const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

// Calculate distance between two locations using Google Maps API
const getDistanceBetweenLocations = async (origin: string, destination: string): Promise<number> => {
  if (!GOOGLE_MAPS_API_KEY) {
    // Fallback: rough distance calculation (you can improve this)
    return calculateRoughDistance(origin, destination);
  }

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(origin)}&destinations=${encodeURIComponent(destination)}&key=${GOOGLE_MAPS_API_KEY}&mode=driving`
    );
    
    const data = await response.json();
    
    if (data.rows?.[0]?.elements?.[0]?.status === 'OK') {
      return data.rows[0].elements[0].distance.value; // meters
    }
    
    return calculateRoughDistance(origin, destination);
  } catch (error) {
    console.error('Google Maps API error:', error);
    return calculateRoughDistance(origin, destination);
  }
};

// Fallback distance calculation (rough approximation)
const calculateRoughDistance = (origin: string, destination: string): number => {
  // This is a very basic fallback - you can improve this with better geocoding
  const bayAreaCities = {
    'San Francisco': { lat: 37.7749, lng: -122.4194 },
    'Oakland': { lat: 37.8044, lng: -122.2711 },
    'San Jose': { lat: 37.3382, lng: -121.8863 },
    'Berkeley': { lat: 37.8715, lng: -122.2730 },
    'Palo Alto': { lat: 37.4419, lng: -122.1430 },
    'Hayward': { lat: 37.6688, lng: -122.0808 },
    'San Mateo': { lat: 37.4969, lng: -122.3331 }
  };

  const originCoords = findCityCoordinates(origin, bayAreaCities);
  const destCoords = findCityCoordinates(destination, bayAreaCities);

  if (originCoords && destCoords) {
    return calculateHaversineDistance(originCoords, destCoords);
  }

  return 50000; // Default 50km if we can't determine
};

const findCityCoordinates = (location: string, cities: Record<string, { lat: number; lng: number }>) => {
  for (const [city, coords] of Object.entries(cities)) {
    if (location.toLowerCase().includes(city.toLowerCase())) {
      return coords;
    }
  }
  return null;
};

const calculateHaversineDistance = (coord1: { lat: number; lng: number }, coord2: { lat: number; lng: number }): number => {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = coord1.lat * Math.PI / 180;
  const φ2 = coord2.lat * Math.PI / 180;
  const Δφ = (coord2.lat - coord1.lat) * Math.PI / 180;
  const Δλ = (coord2.lng - coord1.lng) * Math.PI / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) *
    Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

// Priority multipliers (from your original algorithm)
const getPriorityMultiplier = (priority: string): number => {
  switch (priority) {
    case 'High Priority': return 0.7;
    case 'Low Priority': return 1.3;
    default: return 1.0;
  }
};

// Calculate match score for a route and delivery
const calculateMatchScore = async (delivery: Delivery, route: Route): Promise<MatchScore> => {
  const pickupToOrigin = await getDistanceBetweenLocations(delivery.pickup_location, route.start_location);
  const destinationToDelivery = await getDistanceBetweenLocations(route.end_location, delivery.dropoff_location);
  
  const totalDetour = pickupToOrigin + destinationToDelivery;
  
  // Priority weighting (you can add priority field to deliveries table)
  const priority = 'Standard'; // Default for now
  const priorityMultiplier = getPriorityMultiplier(priority);
  
  const score = totalDetour * priorityMultiplier;
  
  return {
    route,
    score,
    extraDistance: totalDetour,
    pickupToOrigin,
    destinationToDelivery
  };
};

// Find matching routes for a delivery
export const findMatchingRoutes = async (delivery: Delivery, topN: number = 5): Promise<RouteMatch> => {
  try {
    // Get all active routes
    const { data: routes, error } = await supabase
      .from('routes')
      .select('*')
      .eq('active', true);
    
    if (error || !routes) {
      throw new Error('Failed to fetch routes');
    }

    // Calculate scores for all routes
    const matchScores: MatchScore[] = [];
    
    for (const route of routes) {
      const score = await calculateMatchScore(delivery, route);
      matchScores.push(score);
    }

    // Sort by score (lower is better) and take top N
    const sortedMatches = matchScores
      .sort((a, b) => a.score - b.score)
      .slice(0, topN);

    return {
      delivery,
      matches: sortedMatches,
      bestMatch: sortedMatches[0]
    };
  } catch (error) {
    console.error('Error finding matching routes:', error);
    throw error;
  }
};

// Find all available deliveries for a slider
export const findAvailableDeliveries = async (sliderId: string): Promise<RouteMatch[]> => {
  try {
    // Get slider's routes
    const { data: routes, error: routesError } = await supabase
      .from('routes')
      .select('*')
      .eq('user_id', sliderId)
      .eq('active', true);
    
    if (routesError || !routes) {
      throw new Error('Failed to fetch slider routes');
    }

    // Get all pending deliveries
    const { data: deliveries, error: deliveriesError } = await supabase
      .from('deliveries')
      .select('*')
      .eq('status', 'pending');
    
    if (deliveriesError || !deliveries) {
      throw new Error('Failed to fetch pending deliveries');
    }

    // Find matches for each delivery
    const allMatches: RouteMatch[] = [];
    
    for (const delivery of deliveries) {
      const match = await findMatchingRoutes(delivery, 3); // Top 3 matches
      allMatches.push(match);
    }

    // Sort by best overall score
    return allMatches.sort((a, b) => {
      const aBest = a.bestMatch?.score || Infinity;
      const bBest = b.bestMatch?.score || Infinity;
      return aBest - bBest;
    });
  } catch (error) {
    console.error('Error finding available deliveries:', error);
    throw error;
  }
};

// Accept a delivery match
export const acceptDeliveryMatch = async (deliveryId: string, routeId: string): Promise<void> => {
  try {
    // Update delivery status and assign route
    const { error } = await supabase
      .from('deliveries')
      .update({ 
        status: 'assigned',
        route_id: routeId
      })
      .eq('id', deliveryId);
    
    if (error) throw error;
    
    console.log(`Delivery ${deliveryId} assigned to route ${routeId}`);
  } catch (error) {
    console.error('Error accepting delivery match:', error);
    throw error;
  }
};

// Get delivery details with route information
export const getDeliveryWithRoute = async (deliveryId: string) => {
  try {
    const { data, error } = await supabase
      .from('deliveries')
      .select(`
        *,
        routes (
          id,
          start_location,
          end_location,
          schedule,
          users (email)
        )
      `)
      .eq('id', deliveryId)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching delivery with route:', error);
    throw error;
  }
};
