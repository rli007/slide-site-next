'use client';

import Link from "next/link";
import { useState, useEffect } from "react";

export default function SliderDashboard() {
  const [userEmail, setUserEmail] = useState('');
  const [isClient, setIsClient] = useState(false);
  const LS_KEY = 'slideUser';

  useEffect(() => {
    setIsClient(true);
    // Check authentication and load user data
    const user = JSON.parse(localStorage.getItem(LS_KEY) || 'null');
    if (!user) {
      window.location.href = '/auth';
      return;
    }
    
    if (user.role !== 'slider') {
      window.location.href = user.role === 'shipper' ? '/shipper-dashboard' : '/role-select';
      return;
    }

    // Display user email
    setUserEmail(user.email);
  }, []);

  const logout = () => {
    localStorage.removeItem(LS_KEY);
    window.location.href = '/';
  };

  // Don't render until client-side
  if (!isClient) {
    return null;
  }

  return (
    <>
      {/* === NAVBAR === */}
      <header className="bg-white/70 backdrop-blur-md fixed top-0 inset-x-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between p-4">
          <Link href="/" className="text-2xl font-extrabold text-indigo-600">Slide</Link>
          <nav className="hidden md:flex space-x-8 text-sm font-medium">
            <Link href="/slider-info" className="hover:text-indigo-600">For&nbsp;Sliders</Link>
            <Link href="/shipper-info" className="hover:text-indigo-600">For&nbsp;Shippers</Link>
          </nav>
          <button 
            onClick={logout} 
            className="bg-gray-200 px-4 py-2 rounded-lg font-medium hover:bg-gray-300 transition"
          >
            Logout
          </button>
        </div>
      </header>
      <div className="h-16"></div>

      {/* === SLIDER DASHBOARD === */}
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-6 py-20">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-extrabold">Slider Dashboard</h2>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">{userEmail}</span>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h3 className="text-xl font-semibold mb-4">Welcome back, Slider!</h3>
            <p className="text-gray-600 mb-6">Your dashboard is coming soon. Check back for delivery opportunities and earnings tracking.</p>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-indigo-50 rounded-lg p-6">
                <h4 className="font-semibold mb-2">Today&apos;s Earnings</h4>
                <p className="text-2xl font-bold text-indigo-600">$0</p>
              </div>
              <div className="bg-indigo-50 rounded-lg p-6">
                <h4 className="font-semibold mb-2">Available Routes</h4>
                <p className="text-2xl font-bold text-indigo-600">0</p>
              </div>
              <div className="bg-indigo-50 rounded-lg p-6">
                <h4 className="font-semibold mb-2">Completed Deliveries</h4>
                <p className="text-2xl font-bold text-indigo-600">0</p>
              </div>
            </div>
          </div>

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
              <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full bg-indigo-600 text-white font-semibold rounded-lg py-2 hover:bg-indigo-700 transition">Find Routes</button>
                <button className="w-full bg-gray-100 text-gray-700 font-semibold rounded-lg py-2 hover:bg-gray-200 transition">View Earnings</button>
                <button className="w-full bg-gray-100 text-gray-700 font-semibold rounded-lg py-2 hover:bg-gray-200 transition">Update Profile</button>
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