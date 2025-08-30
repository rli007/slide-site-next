'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

interface Delivery {
  id: string;
  pickup_location: string;
  dropoff_location: string;
  package_size: string;
  status: string;
  created_at: string;
  updated_at: string;
  route_id?: string;
}

interface Route {
  id: string;
  start_location: string;
  end_location: string;
  schedule: string;
}

interface Props {
  shipperId?: string;
  sliderId?: string;
}

export default function DeliveryHistory({ shipperId, sliderId }: Props) {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const loadDeliveryHistory = useCallback(async () => {
    try {
      setIsLoading(true);
      
      let query = supabase
        .from('deliveries')
        .select(`
          *,
          routes (
            id,
            start_location,
            end_location,
            schedule
          )
        `)
        .eq('status', 'delivered')
        .order('updated_at', { ascending: false });

      // Filter by user type
      if (shipperId) {
        // For shippers, get their delivered deliveries
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('id')
          .eq('email', shipperId)
          .single();
        
        if (userData) {
          query = query.eq('shipper_id', userData.id);
        }
      } else if (sliderId) {
        // For sliders, get deliveries assigned to their routes
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('id')
          .eq('email', sliderId)
          .single();
        
        if (userData) {
          const { data: routes, error: routesError } = await supabase
            .from('routes')
            .select('id')
            .eq('user_id', userData.id);
          
          if (routes && routes.length > 0) {
            const routeIds = routes.map(r => r.id);
            query = query.in('route_id', routeIds);
          }
        }
      }

      const { data: deliveredDeliveries, error: deliveriesError } = await query;

      if (deliveriesError) {
        console.error('Error fetching delivery history:', deliveriesError);
        setError('Failed to load delivery history');
        return;
      }

      setDeliveries(deliveredDeliveries || []);
    } catch (err) {
      console.error('Error loading delivery history:', err);
      setError('Failed to load delivery history');
    } finally {
      setIsLoading(false);
    }
  }, [shipperId, sliderId]);

  useEffect(() => {
    loadDeliveryHistory();
  }, [loadDeliveryHistory]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading delivery history...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-600">
        <p>{error}</p>
        <button 
          onClick={loadDeliveryHistory}
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
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-lg font-medium mb-2">No completed deliveries yet</p>
        <p className="text-sm">Completed deliveries will appear here</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {deliveries.map((delivery) => (
        <div key={delivery.id} className="border border-gray-200 rounded-lg p-4 bg-green-50">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="font-medium text-lg text-green-800">
                {delivery.pickup_location} → {delivery.dropoff_location}
              </div>
              <div className="text-sm text-green-700 mb-2">
                Package: {delivery.package_size} • Completed: {formatDate(delivery.updated_at)}
              </div>
              
              {delivery.routes && (
                <div className="bg-white rounded-lg p-3 border border-green-200">
                  <div className="text-sm font-medium text-green-800 mb-1">Delivered via Route</div>
                  <div className="text-sm text-green-700">
                    {delivery.routes.start_location} → {delivery.routes.end_location}
                  </div>
                  <div className="text-xs text-green-600">{delivery.routes.schedule}</div>
                </div>
              )}
            </div>
            
            <div className="ml-4">
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                Delivered
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
