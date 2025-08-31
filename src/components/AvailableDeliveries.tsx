'use client';

import { useState, useEffect, useCallback } from 'react';
import { findAvailableDeliveries, acceptDeliveryMatch } from '../lib/route-matching';
import { updateDelivery } from '../lib/database';

interface Route {
  id: string;
  start_location: string;
  end_location: string;
  schedule: string;
  active: boolean;
}

interface AvailableDelivery {
  delivery: {
    id: string;
    pickup_location: string;
    dropoff_location: string;
    package_size: string;
    status: string;
    created_at: string;
  };
  matches: Array<{
    route: Route;
    score: number;
    extraDistance: number;
    pickupToOrigin: number;
    destinationToDelivery: number;
  }>;
  bestMatch?: {
    route: Route;
    score: number;
    extraDistance: number;
    pickupToOrigin: number;
    destinationToDelivery: number;
  };
}

interface Props {
  sliderId: string;
  onDeliveryAccepted?: (deliveryId: string) => void;
  refreshTrigger?: number;
}

export default function AvailableDeliveries({ sliderId, onDeliveryAccepted, refreshTrigger }: Props) {
  const [deliveries, setDeliveries] = useState<AvailableDelivery[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [localRefreshTrigger, setLocalRefreshTrigger] = useState(0);

  console.log('🚀 AvailableDeliveries component mounted with sliderId:', sliderId);

  const loadAvailableDeliveries = useCallback(async () => {
    try {
      setIsLoading(true);
      console.log('🔄 Loading available deliveries for slider:', sliderId);
      const available = await findAvailableDeliveries(sliderId);
      console.log('📦 Available deliveries loaded:', available);
      setDeliveries(available);
    } catch (err) {
      console.error('❌ Error loading available deliveries:', err);
      setError('Failed to load available deliveries');
    } finally {
      setIsLoading(false);
    }
  }, [sliderId, localRefreshTrigger]);

  useEffect(() => {
    loadAvailableDeliveries();
  }, [loadAvailableDeliveries]);

  // Listen for parent refresh trigger
  useEffect(() => {
    console.log('🔄 === AVAILABLE DELIVERIES REFRESH TRIGGER EFFECT ===');
    console.log('📊 Parent refresh trigger:', refreshTrigger);
    console.log('📊 Local refresh trigger:', localRefreshTrigger);
    
    if (refreshTrigger && refreshTrigger !== localRefreshTrigger) {
      console.log('🔄 Parent triggered refresh, updating local trigger');
      console.log('🔄 Updating local trigger from', localRefreshTrigger, 'to', refreshTrigger);
      setLocalRefreshTrigger(refreshTrigger);
    } else {
      console.log('ℹ️ No refresh needed or triggers are the same');
    }
  }, [refreshTrigger, localRefreshTrigger]);

  const handleAcceptDelivery = async (deliveryId: string, routeId: string) => {
    try {
      console.log('🚀 === ACCEPT DELIVERY START ===');
      console.log('📦 Delivery ID:', deliveryId);
      console.log('🛣️ Route ID:', routeId);
      console.log('👤 Current slider ID:', sliderId);
      
      console.log('🔄 Calling acceptDeliveryMatch...');
      await acceptDeliveryMatch(deliveryId, routeId);
      console.log('✅ acceptDeliveryMatch completed successfully');
      
      // Call the callback to notify parent component
      if (onDeliveryAccepted) {
        console.log('📞 Calling onDeliveryAccepted callback with delivery ID:', deliveryId);
        onDeliveryAccepted(deliveryId);
        console.log('✅ onDeliveryAccepted callback completed');
      } else {
        console.log('⚠️ No onDeliveryAccepted callback provided');
      }
      
      // Add a small delay to ensure database update is committed
      console.log('⏳ Waiting 100ms for database commit...');
      await new Promise(resolve => setTimeout(resolve, 100));
      console.log('✅ Wait completed');
      
      // Trigger a refresh by updating the refresh trigger
      console.log('🔄 Updating local refresh trigger...');
      setLocalRefreshTrigger((prev: number) => {
        const newValue = prev + 1;
        console.log('🔄 Local refresh trigger updated from', prev, 'to', newValue);
        return newValue;
      });
      
      console.log('✅ === ACCEPT DELIVERY COMPLETED ===');
    } catch (err) {
      console.error('❌ === ACCEPT DELIVERY FAILED ===');
      console.error('❌ Error details:', err);
      console.error('❌ Error message:', err instanceof Error ? err.message : 'Unknown error');
      console.error('❌ Error stack:', err instanceof Error ? err.stack : 'No stack trace');
    }
  };

  const handleUpdateStatus = async (deliveryId: string, newStatus: 'assigned' | 'in-transit' | 'delivered') => {
    try {
      await updateDelivery(deliveryId, { status: newStatus });
      // Reload available deliveries
      await loadAvailableDeliveries();
    } catch (err) {
      console.error('Failed to update delivery status:', err);
    }
  };

  const formatDistance = (meters: number): string => {
    if (meters < 1000) {
      return `${Math.round(meters)}m`;
    }
    return `${(meters / 1000).toFixed(1)}km`;
  };

  const formatScore = (score: number): string => {
    // Lower score is better (less detour)
    if (score < 5000) return 'Excellent';
    if (score < 15000) return 'Good';
    if (score < 30000) return 'Fair';
    return 'Poor';
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h3 className="text-xl font-semibold mb-4">Available Deliveries</h3>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Finding delivery opportunities...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h3 className="text-xl font-semibold mb-4">Available Deliveries</h3>
        <div className="text-center py-8 text-red-600">
          <p>{error}</p>
          <button 
            onClick={loadAvailableDeliveries}
            className="mt-2 text-indigo-600 hover:text-indigo-700 underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (deliveries.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h3 className="text-xl font-semibold mb-4">Available Deliveries</h3>
        <div className="text-center py-8 text-gray-500">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <p className="text-lg font-medium mb-2">No deliveries available</p>
          <p className="text-sm">Check back later for new delivery opportunities</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <h3 className="text-xl font-semibold mb-4">Available Deliveries</h3>
      <p className="text-gray-600 mb-6">
        These deliveries match your routes. Accept the ones that work best for you.
      </p>
      
      <div className="space-y-4">
        {deliveries.map((item) => (
          <div key={item.delivery.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="font-medium text-lg">
                  {item.delivery.pickup_location} → {item.delivery.dropoff_location}
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  Package: {item.delivery.package_size} • Created: {new Date(item.delivery.created_at).toLocaleDateString()}
                </div>
                <div className="flex items-center space-x-3 mb-3">
                  <span className={`px-2 py-1 rounded text-xs font-medium border ${
                    item.delivery.status === 'pending' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                    item.delivery.status === 'assigned' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                    item.delivery.status === 'in-transit' ? 'bg-purple-100 text-purple-800 border-purple-200' :
                    item.delivery.status === 'delivered' ? 'bg-green-100 text-green-800 border-green-200' :
                    'bg-gray-100 text-gray-800 border-gray-200'
                  }`}>
                    {item.delivery.status === 'pending' ? 'Pending' :
                     item.delivery.status === 'assigned' ? 'Assigned to Driver' :
                     item.delivery.status === 'in-transit' ? 'In Transit' :
                     item.delivery.status === 'delivered' ? 'Delivered' : 'Unknown'}
                  </span>
                </div>
                
                {item.bestMatch && (
                  <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-green-800">Best Route Match</span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        formatScore(item.bestMatch.score) === 'Excellent' ? 'bg-green-100 text-green-800' :
                        formatScore(item.bestMatch.score) === 'Good' ? 'bg-blue-100 text-blue-800' :
                        formatScore(item.bestMatch.score) === 'Fair' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {formatScore(item.bestMatch.score)} Match
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-xs text-green-700">
                      <div>
                        <span className="font-medium">Extra Distance:</span> {formatDistance(item.bestMatch.extraDistance)}
                      </div>
                      <div>
                        <span className="font-medium">Route:</span> {item.bestMatch.route.start_location} → {item.bestMatch.route.end_location}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="ml-4 flex flex-col space-y-2">
                <button
                  onClick={() => item.bestMatch && handleAcceptDelivery(item.delivery.id, item.bestMatch.route.id)}
                  disabled={!item.bestMatch}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    item.bestMatch 
                      ? 'bg-green-600 text-white hover:bg-green-700' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {item.bestMatch ? 'Accept Delivery' : 'No Route Match'}
                </button>
                
                {/* Status Update Buttons - only show if delivery is assigned to this slider */}
                {item.delivery.status === 'assigned' && (
                  <button
                    onClick={() => handleUpdateStatus(item.delivery.id, 'in-transit')}
                    className="bg-purple-500 text-white px-3 py-1 rounded text-sm hover:bg-purple-600 transition"
                  >
                    Start Transit
                  </button>
                )}
                {item.delivery.status === 'in-transit' && (
                  <button
                    onClick={() => handleUpdateStatus(item.delivery.id, 'delivered')}
                    className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 transition"
                  >
                    Mark Delivered
                  </button>
                )}
              </div>
            </div>
            
            {/* Show all route matches */}
            {item.matches.length > 1 && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="text-sm font-medium text-gray-700 mb-2">All Route Matches:</div>
                <div className="space-y-2">
                  {item.matches.map((match, index) => (
                    <div key={match.route.id} className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-3">
                        <span className={`w-2 h-2 rounded-full ${
                          index === 0 ? 'bg-green-500' : 'bg-gray-300'
                        }`}></span>
                        <span className="text-gray-600">
                          {match.route.start_location} → {match.route.end_location}
                        </span>
                      </div>
                      <div className="text-gray-500">
                        +{formatDistance(match.extraDistance)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
