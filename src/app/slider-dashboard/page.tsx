'use client';

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "../../lib/supabase";
import { getUserByEmail, getUserRoutes, createRoute, updateRoute } from "../../lib/database";
import AvailableDeliveries from "../../components/AvailableDeliveries";
import ActiveDeliveries from "../../components/ActiveDeliveries";
import DeliveryHistory from "../../components/DeliveryHistory";

interface Route {
  id: string;
  start_location: string;
  end_location: string;
  schedule: string;
  active: boolean;
}

export default function SliderDashboard() {
  const [userEmail, setUserEmail] = useState('');
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [showAddRoute, setShowAddRoute] = useState(false);
  const [newRoute, setNewRoute] = useState({
    start_location: '',
    end_location: '',
    schedule: ''
  });

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
        
        if (userProfile.role !== 'slider') {
          console.log('User is not a slider, redirecting to appropriate dashboard');
          window.location.href = userProfile.role === 'shipper' ? '/shipper-dashboard' : '/role-select';
          return;
        }

        // User is authenticated and has slider role, load data
        setUserEmail(user.email!);
        await loadRoutes(user.id);
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

  useEffect(() => {
    setIsClient(true);
    checkAuthAndLoadData();
  }, [checkAuthAndLoadData]);

  const loadRoutes = async (userId: string) => {
    try {
      const userRoutes = await getUserRoutes(userId);
      setRoutes(userRoutes || []);
    } catch (error) {
      console.error('Error loading routes:', error);
      setRoutes([]);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  // Add callback function for delivery state management
  const handleDeliveryAccepted = useCallback((deliveryId: string) => {
    console.log('🎯 Delivery accepted in parent:', deliveryId);
    // Force refresh of both components by updating a refresh trigger
    setRefreshTrigger(prev => prev + 1);
  }, []);

  // Add refresh trigger state
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const addRoute = async () => {
    if (!newRoute.start_location.trim() || !newRoute.end_location.trim() || !newRoute.schedule.trim()) {
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const routeData = {
        user_id: user.id,
        start_location: newRoute.start_location,
        end_location: newRoute.end_location,
        schedule: newRoute.schedule,
        active: true
      };

      await createRoute(routeData);
      
      // Reload routes
      await loadRoutes(user.id);
      
      // Reset form
      setNewRoute({ start_location: '', end_location: '', schedule: '' });
      setShowAddRoute(false);
    } catch (error) {
      console.error('Error adding route:', error);
    }
  };

  const toggleRouteStatus = async (routeId: string) => {
    try {
      const route = routes.find(r => r.id === routeId);
      if (!route) return;

      await updateRoute(routeId, { active: !route.active });
      
      // Reload routes
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await loadRoutes(user.id);
      }
    } catch (error) {
      console.error('Error updating route:', error);
    }
  };

  const deleteRoute = async (routeId: string) => {
    try {
      await deleteRoute(routeId);
      
      // Reload routes
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await loadRoutes(user.id);
      }
    } catch (error) {
      console.error('Error deleting route:', error);
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

  const activeRoutes = routes.filter(route => route.active);
  const inactiveRoutes = routes.filter(route => !route.active);

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

      {/* === SLIDER DASHBOARD === */}
      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-extrabold">Slider Dashboard</h2>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">{userEmail}</span>
            </div>
          </div>
          
          {/* Stats Overview */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h4 className="font-semibold mb-2 text-gray-600">Active Routes</h4>
              <p className="text-3xl font-bold text-indigo-600">{activeRoutes.length}</p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h4 className="font-semibold mb-2 text-gray-600">Total Routes</h4>
              <p className="text-3xl font-bold text-indigo-600">{routes.length}</p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h4 className="font-semibold mb-2 text-gray-600">Today&apos;s Earnings</h4>
              <p className="text-3xl font-bold text-indigo-600">$0</p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h4 className="font-semibold mb-2 text-gray-600">Completed Deliveries</h4>
              <p className="text-3xl font-bold text-indigo-600">0</p>
            </div>
          </div>

          {/* Route Management */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">Route Management</h3>
              <button 
                onClick={() => setShowAddRoute(!showAddRoute)}
                className="bg-indigo-600 text-white font-semibold rounded-lg px-4 py-2 hover:bg-indigo-700 transition"
              >
                {showAddRoute ? 'Cancel' : 'Add Route'}
              </button>
            </div>

            {/* Add Route Form */}
            {showAddRoute && (
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Location</label>
                    <input
                      type="text"
                      value={newRoute.start_location}
                      onChange={(e) => setNewRoute({...newRoute, start_location: e.target.value})}
                      placeholder="e.g., San Francisco, CA"
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">End Location</label>
                    <input
                      type="text"
                      value={newRoute.end_location}
                      onChange={(e) => setNewRoute({...newRoute, end_location: e.target.value})}
                      placeholder="e.g., Oakland, CA"
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Schedule</label>
                    <input
                      type="text"
                      value={newRoute.schedule}
                      onChange={(e) => setNewRoute({...newRoute, schedule: e.target.value})}
                      placeholder="e.g., Weekdays 9AM-5PM"
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <button 
                    onClick={addRoute}
                    className="bg-green-600 text-white font-semibold rounded-lg px-6 py-2 hover:bg-green-700 transition"
                  >
                    Add Route
                  </button>
                </div>
              </div>
            )}

            {/* Active Routes */}
            {activeRoutes.length > 0 && (
              <div className="mb-6">
                <h4 className="font-semibold mb-4 text-green-700">Active Routes</h4>
                <div className="space-y-3">
                  {activeRoutes.map(route => (
                    <div key={route.id} className="flex items-center justify-between bg-green-50 rounded-lg p-4 border border-green-200">
                      <div className="flex-1">
                        <div className="font-medium">{route.start_location} → {route.end_location}</div>
                        <div className="text-sm text-gray-600">{route.schedule}</div>
                      </div>
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => toggleRouteStatus(route.id)}
                          className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600 transition"
                        >
                          Pause
                        </button>
                        <button 
                          onClick={() => deleteRoute(route.id)}
                          className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Inactive Routes */}
            {inactiveRoutes.length > 0 && (
              <div>
                <h4 className="font-semibold mb-4 text-gray-700">Inactive Routes</h4>
                <div className="space-y-3">
                  {inactiveRoutes.map(route => (
                    <div key={route.id} className="flex items-center justify-between bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="flex-1">
                        <div className="font-medium">{route.start_location} → {route.end_location}</div>
                        <div className="text-sm text-gray-600">{route.schedule}</div>
                      </div>
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => toggleRouteStatus(route.id)}
                          className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 transition"
                        >
                          Activate
                        </button>
                        <button 
                          onClick={() => deleteRoute(route.id)}
                          className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {routes.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m-6 3l6-3" />
                  </svg>
                </div>
                <p className="text-lg font-medium mb-2">No routes yet</p>
                <p className="text-sm">Add your first route to start receiving delivery opportunities</p>
              </div>
            )}
          </div>

          {/* Available Deliveries */}
          <AvailableDeliveries 
            sliderId={userEmail} 
            onDeliveryAccepted={handleDeliveryAccepted}
            refreshTrigger={refreshTrigger}
          />

          {/* Active Deliveries */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h3 className="text-xl font-semibold mb-6">Active Deliveries</h3>
            <ActiveDeliveries sliderId={userEmail} refreshTrigger={refreshTrigger} />
          </div>

          {/* Delivery History */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h3 className="text-xl font-semibold mb-6">Delivery History</h3>
            <DeliveryHistory sliderId={userEmail} />
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 text-sm text-gray-600">
                  <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                  <span>No recent activity</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-xl font-semibold mb-4">Need Help?</h3>
              <p className="text-gray-600 mb-4">Having trouble with your routes or deliveries? Submit a help ticket and we&apos;ll get back to you within 24 hours.</p>
              <button 
                onClick={() => window.open('mailto:support@slide.com?subject=Slider Support Request', '_blank')}
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