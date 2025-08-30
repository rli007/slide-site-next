'use client';

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "../../lib/supabase";
import { getUserByEmail, getUserDeliveries, createDelivery } from "../../lib/database";
import DeliveryHistory from "../../components/DeliveryHistory";

interface Route {
  id: string;
  start_location: string;
  end_location: string;
  schedule: string;
  active: boolean;
}



interface Delivery {
  id: string;
  pickup_location: string;
  dropoff_location: string;
  package_size: string;
  status: 'pending' | 'assigned' | 'in-transit' | 'delivered';
  created_at: string;
}

export default function ShipperDashboard() {
  const [userEmail, setUserEmail] = useState('');
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [showAddDelivery, setShowAddDelivery] = useState(false);
  const [newDelivery, setNewDelivery] = useState({
    pickupLocation: '',
    dropoffLocation: '',
    packageSize: ''
  });

  useEffect(() => {
    setIsClient(true);
    checkAuthAndLoadData();
  }, []);

  const checkAuthAndLoadData = useCallback(async () => {
    try {
      // Check if user is authenticated
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        console.log('No authenticated user, redirecting to auth');
        window.location.href = '/auth';
        return;
      }

      // Check if user has a role set
      try {
        const userProfile = await getUserByEmail(user.email!);
        
        if (!userProfile.role) {
          console.log('No role set, redirecting to role selection');
          window.location.href = '/role-select';
          return;
        }
        
        if (userProfile.role !== 'shipper') {
          console.log('User is not a shipper, redirecting to appropriate dashboard');
          window.location.href = userProfile.role === 'slider' ? '/slider-dashboard' : '/role-select';
          return;
        }

        // User is authenticated and has shipper role, load data
        setUserEmail(user.email!);
        await loadDeliveries(user.id);
        setIsLoading(false);
        
      } catch (dbError) {
        console.error('Database error:', dbError);
        // If user profile doesn't exist, redirect to role selection
        window.location.href = '/role-select';
        return;
      }
      
    } catch (error) {
      console.error('Auth check error:', error);
      window.location.href = '/auth';
    }
  }, []);

  const loadDeliveries = async (userId: string) => {
    try {
      const userDeliveries = await getUserDeliveries(userId);
      setDeliveries(userDeliveries || []);
    } catch (error) {
      console.error('Error loading deliveries:', error);
      setDeliveries([]);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };



  const addDelivery = async () => {
    if (!newDelivery.pickupLocation.trim() || !newDelivery.dropoffLocation.trim() || !newDelivery.packageSize.trim()) {
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const deliveryData = {
        shipper_id: user.id,
        pickup_location: newDelivery.pickupLocation,
        dropoff_location: newDelivery.dropoffLocation,
        package_size: newDelivery.packageSize,
        status: 'pending' as const
      };

      // Create delivery
      await createDelivery(deliveryData);
      
      // Reload deliveries
      await loadDeliveries(user.id);
      
      // Reset form
      setNewDelivery({ pickupLocation: '', dropoffLocation: '', packageSize: '' });
      setShowAddDelivery(false);
    } catch (error) {
      console.error('Error adding delivery:', error);
    }
  };





  const handleDeleteDelivery = async (deliveryId: string) => {
    try {
      const { deleteDelivery: deleteDeliveryFromDB } = await import('../../lib/database');
      await deleteDeliveryFromDB(deliveryId);
      
      // Reload deliveries
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await loadDeliveries(user.id);
      }
    } catch (error) {
      console.error('Error deleting delivery:', error);
    }
  };

  const getStatusColor = (status: Delivery['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'assigned': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in-transit': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: Delivery['status']) => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'assigned': return 'Assigned to Driver';
      case 'in-transit': return 'In Transit';
      case 'delivered': return 'Delivered';
      default: return 'Unknown';
    }
  };

  // Don't render until client-side and data is loaded
  if (!isClient || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const pendingDeliveries = deliveries.filter(d => d.status === 'pending');
  const activeDeliveries = deliveries.filter(d => d.status !== 'pending' && d.status !== 'delivered');
  const completedDeliveries = deliveries.filter(d => d.status === 'delivered');

  return (
    <>
      {/* === NAVBAR === */}
      <header className="bg-white/70 backdrop-blur-md fixed top-0 inset-x-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between p-4">
          <Link href="/" className="text-2xl font-extrabold text-indigo-600">Slide</Link>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">{userEmail}</span>
            <button 
              onClick={logout} 
              className="bg-gray-200 px-4 py-2 rounded-lg font-medium hover:bg-gray-300 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>
      <div className="h-16"></div>

      {/* === SHIPPER DASHBOARD === */}
      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-extrabold">Shipper Dashboard</h2>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">{userEmail}</span>
            </div>
          </div>
          
          {/* Stats Overview */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h4 className="font-semibold mb-2 text-gray-600">Pending Deliveries</h4>
              <p className="text-3xl font-bold text-yellow-600">{pendingDeliveries.length}</p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h4 className="font-semibold mb-2 text-gray-600">Active Shipments</h4>
              <p className="text-3xl font-bold text-blue-600">{activeDeliveries.length}</p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h4 className="font-semibold mb-2 text-gray-600">Completed</h4>
              <p className="text-3xl font-bold text-green-600">{completedDeliveries.length}</p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h4 className="font-semibold mb-2 text-gray-600">Total Spent</h4>
              <p className="text-3xl font-bold text-indigo-600">$0</p>
            </div>
          </div>

          {/* Delivery Management */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">Delivery Management</h3>
              <button 
                onClick={() => setShowAddDelivery(!showAddDelivery)}
                className="bg-indigo-600 text-white font-semibold rounded-lg px-4 py-2 hover:bg-indigo-700 transition"
              >
                {showAddDelivery ? 'Cancel' : 'Create Delivery'}
              </button>
            </div>

            {/* Add Delivery Form */}
            {showAddDelivery && (
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Pickup Location</label>
                    <input
                      type="text"
                      value={newDelivery.pickupLocation}
                      onChange={(e) => setNewDelivery({...newDelivery, pickupLocation: e.target.value})}
                      placeholder="e.g., 123 Main St, San Francisco"
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Dropoff Location</label>
                    <input
                      type="text"
                      value={newDelivery.dropoffLocation}
                      onChange={(e) => setNewDelivery({...newDelivery, dropoffLocation: e.target.value})}
                      placeholder="e.g., 456 Oak Ave, Oakland"
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Package Size</label>
                    <select
                      value={newDelivery.packageSize}
                      onChange={(e) => setNewDelivery({...newDelivery, packageSize: e.target.value})}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                    >
                      <option value="">Select size</option>
                      <option value="Small (up to 5 lbs)">Small (up to 5 lbs)</option>
                      <option value="Medium (5-15 lbs)">Medium (5-15 lbs)</option>
                      <option value="Large (15-20 lbs)">Large (15-20 lbs)</option>
                    </select>
                  </div>
                </div>
                <div className="mt-4 flex space-x-3">
                  <button 
                    onClick={addDelivery}
                    className="bg-green-600 text-white font-semibold rounded-lg px-6 py-2 hover:bg-green-700 transition"
                  >
                    Create Delivery
                  </button>

                </div>
              </div>
            )}




            {/* Deliveries List */}
            {deliveries.length > 0 ? (
              <div className="space-y-4">
                {deliveries.map(delivery => (
                  <div key={delivery.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex-1">
                        <div className="font-medium">{delivery.pickup_location} → {delivery.dropoff_location}</div>
                        <div className="text-sm text-gray-600">Package: {delivery.package_size} • Created: {new Date(delivery.created_at).toLocaleDateString()}</div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(delivery.status)}`}>
                          {getStatusText(delivery.status)}
                        </span>
                        <button 
                          onClick={() => handleDeleteDelivery(delivery.id)}
                          className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <p className="text-lg font-medium mb-2">No deliveries yet</p>
                <p className="text-sm">Create your first delivery to get started</p>
              </div>
            )}
          </div>

          {/* Delivery History */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h3 className="text-xl font-semibold mb-6">Delivery History</h3>
            <DeliveryHistory shipperId={userEmail} />
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {deliveries.slice(0, 3).map(delivery => (
                  <div key={delivery.id} className="flex items-center space-x-3 text-sm">
                    <div className={`w-2 h-2 rounded-full ${
                      delivery.status === 'delivered' ? 'bg-green-400' :
                      delivery.status === 'in-transit' ? 'bg-purple-400' :
                      delivery.status === 'assigned' ? 'bg-blue-400' : 'bg-yellow-400'
                    }`}></div>
                    <span className="text-gray-600">
                      {delivery.pickup_location} → {delivery.dropoff_location}
                    </span>
                  </div>
                ))}
                {deliveries.length === 0 && (
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                    <span>No recent activity</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-xl font-semibold mb-4">Need Help?</h3>
              <p className="text-gray-600 mb-4">Having trouble with your shipments or deliveries? Submit a help ticket and we&apos;ll get back to you within 24 hours.</p>
              <button 
                onClick={() => window.open('mailto:support@slide.com?subject=Shipper Support Request', '_blank')}
                className="w-full bg-indigo-600 text-white font-semibold rounded-lg py-3 hover:bg-indigo-700 transition"
              >
                Submit Help Ticket
              </button>
              <div className="mt-3 text-center">
                <a 
                  href="mailto:support@slide.com" 
                  className="text-sm text-indigo-600 hover:text-indigo-700"
                >
                  support@slide.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* === FOOTER === */}
      <footer className="bg-gray-900 text-gray-400 text-xs py-4 text-center">
        © 2025 Slide Logistics, Inc.
      </footer>
    </>
  );
} 