'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { updateDelivery } from '../lib/database';

interface Route {
  id: string;
  start_location: string;
  end_location: string;
  schedule: string;
  active: boolean;
}

interface ActiveDelivery {
  id: string;
  pickup_location: string;
  dropoff_location: string;
  package_size: string;
  status: 'assigned' | 'in-transit' | 'delivered';
  route_id: string;
  created_at: string;
  updated_at: string;
  route?: Route;
}

interface Props {
  sliderId: string;
  refreshTrigger?: number;
}

export default function ActiveDeliveries({ sliderId, refreshTrigger }: Props) {
  const [deliveries, setDeliveries] = useState<ActiveDelivery[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [localRefreshTrigger, setLocalRefreshTrigger] = useState(0);

  const loadActiveDeliveries = useCallback(async () => {
    try {
      setIsLoading(true);
      console.log('🔄 Loading active deliveries for slider:', sliderId);
      
      // Get deliveries assigned to this slider's routes
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // First get the slider's routes
      const { data: routes, error: routesError } = await supabase
        .from('routes')
        .select('*')
        .eq('user_id', user.id);

      if (routesError || !routes) {
        console.error('Error fetching routes:', routesError);
        return;
      }

      const routeIds = routes.map(r => r.id);
      
      // Get deliveries assigned to these routes
      const { data: activeDeliveries, error: deliveriesError } = await supabase
        .from('deliveries')
        .select(`
          *,
          routes (
            id,
            start_location,
            end_location,
            schedule,
            active
          )
        `)
        .in('route_id', routeIds)
        .neq('status', 'pending')
        .order('created_at', { ascending: false });

      if (deliveriesError) {
        console.error('Error fetching active deliveries:', deliveriesError);
        setError('Failed to load active deliveries');
        return;
      }

      console.log('📦 Active deliveries loaded:', activeDeliveries);
      setDeliveries(activeDeliveries || []);
    } catch (err) {
      console.error('Error loading active deliveries:', err);
      setError('Failed to load active deliveries');
    } finally {
      setIsLoading(false);
    }
  }, [sliderId, localRefreshTrigger]);

  useEffect(() => {
    loadActiveDeliveries();
  }, [loadActiveDeliveries]);

  // Listen for parent refresh trigger
  useEffect(() => {
    if (refreshTrigger && refreshTrigger !== localRefreshTrigger) {
      console.log('🔄 Parent triggered refresh, updating local trigger');
      setLocalRefreshTrigger(refreshTrigger);
    }
  }, [refreshTrigger, localRefreshTrigger]);

  const handleUpdateStatus = async (deliveryId: string, newStatus: 'in-transit' | 'delivered') => {
    try {
      await updateDelivery(deliveryId, { status: newStatus });
      // Reload active deliveries
      await loadActiveDeliveries();
    } catch (err) {
      console.error('Failed to update delivery status:', err);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'assigned': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in-transit': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'assigned': return 'Assigned to Driver';
      case 'in-transit': return 'In Transit';
      case 'delivered': return 'Delivered';
      default: return 'Unknown';
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading active deliveries...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-600">
        <p>{error}</p>
        <button 
          onClick={loadActiveDeliveries}
          className="mt-2 text-indigo-600 hover:text-indigo-700 underline"
        >
          Try again
        </button>
      </div>
    );
  }

  if (deliveries.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>
        <p className="text-lg font-medium mb-2">No active deliveries</p>
        <p className="text-sm">Accept deliveries from the Available Deliveries section above</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {deliveries.map((delivery) => (
        <div key={delivery.id} className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="font-medium text-lg">
                {delivery.pickup_location} → {delivery.dropoff_location}
              </div>
              <div className="text-sm text-gray-600 mb-2">
                Package: {delivery.package_size} • Created: {new Date(delivery.created_at).toLocaleDateString()}
              </div>
              
              {delivery.route && (
                <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                  <div className="text-sm font-medium text-blue-800 mb-1">Assigned Route</div>
                  <div className="text-sm text-blue-700">
                    {delivery.route.start_location} → {delivery.route.end_location}
                  </div>
                  <div className="text-xs text-blue-600">{delivery.route.schedule}</div>
                </div>
              )}
            </div>
            
            <div className="ml-4 flex flex-col space-y-2">
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(delivery.status)}`}>
                {getStatusText(delivery.status)}
              </span>
              
              {/* Status Update Buttons */}
              {delivery.status === 'assigned' && (
                <button
                  onClick={() => handleUpdateStatus(delivery.id, 'in-transit')}
                  className="bg-purple-500 text-white px-3 py-1 rounded text-sm hover:bg-purple-600 transition"
                >
                  Start Transit
                </button>
              )}
              {delivery.status === 'in-transit' && (
                <button
                  onClick={() => handleUpdateStatus(delivery.id, 'delivered')}
                  className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 transition"
                >
                  Mark Delivered
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
