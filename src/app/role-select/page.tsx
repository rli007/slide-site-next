'use client';

import Link from "next/link";
import { useState, useEffect } from "react";

export default function RoleSelect() {
  const [isClient, setIsClient] = useState(false);
  const LS_KEY = 'slideUser';

  useEffect(() => {
    setIsClient(true);
    // Redirect if not logged in
    const user = JSON.parse(localStorage.getItem(LS_KEY) || 'null');
    if (!user) {
      window.location.href = '/auth';
    }
  }, []);

  const selectRole = (role: 'slider' | 'shipper') => {
    const user = JSON.parse(localStorage.getItem(LS_KEY) || 'null');
    if (user) {
      user.role = role;
      localStorage.setItem(LS_KEY, JSON.stringify(user));
      window.location.href = role === 'slider' ? '/slider-dashboard' : '/shipper-dashboard';
    } else {
      window.location.href = '/auth';
    }
  };

  // Don't render until client-side
  if (!isClient) {
    return null;
  }

  return (
    <>
      {/* === NAVBAR === */}
      <header className="bg-white/70 backdrop-blur-md fixed top-0 inset-x-0 z-50 shadow-sm">
        <div className="max-w-3xl mx-auto flex items-center justify-between p-4">
          <Link href="/" className="text-2xl font-extrabold text-indigo-600">Slide</Link>
          <Link href="/" className="rounded-xl bg-gray-100 px-4 py-1.5 text-sm font-medium hover:bg-gray-200 transition">← Home</Link>
        </div>
      </header>
      <div className="h-16"></div>

      {/* === ROLE SELECTION === */}
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-6 py-20">
          <h2 className="text-3xl font-extrabold text-center mb-12">Choose Your Role</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <i data-feather="truck" className="w-10 h-10 text-indigo-600"></i>
              </div>
              <h3 className="text-xl font-semibold mb-4">I&apos;m a Driver</h3>
              <p className="text-gray-600 mb-6">Deliver packages along your commute and earn money on the miles you already drive.</p>
              <button 
                onClick={() => selectRole('slider')} 
                className="w-full bg-indigo-600 text-white font-semibold rounded-lg py-3 hover:bg-indigo-700 transition"
              >
                Become a Slider
              </button>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <i data-feather="package" className="w-10 h-10 text-indigo-600"></i>
              </div>
              <h3 className="text-xl font-semibold mb-4">I&apos;m a Shipper</h3>
              <p className="text-gray-600 mb-6">Send packages with local drivers for faster, greener, and cheaper delivery.</p>
              <button 
                onClick={() => selectRole('shipper')} 
                className="w-full bg-indigo-600 text-white font-semibold rounded-lg py-3 hover:bg-indigo-700 transition"
              >
                Become a Shipper
              </button>
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