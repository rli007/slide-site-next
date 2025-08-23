'use client';

import Link from "next/link";
import { useState, useEffect } from "react";

export default function RoleSelect() {
  const [isClient, setIsClient] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'slider' | 'shipper' | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const LS_KEY = 'slideUser';

  useEffect(() => {
    setIsClient(true);
    // Redirect if not logged in
    const user = JSON.parse(localStorage.getItem(LS_KEY) || 'null');
    if (!user) {
      window.location.href = '/auth';
    }
  }, []);

  const selectRole = async (role: 'slider' | 'shipper') => {
    setSelectedRole(role);
    setIsLoading(true);
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
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
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold mb-4">Choose Your Role</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Tell us how you want to use Slide. You can always change this later in your settings.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className={`bg-white rounded-2xl shadow-lg p-8 text-center border-2 transition-all duration-200 ${
              selectedRole === 'slider' 
                ? 'border-indigo-500 shadow-indigo-100' 
                : 'border-gray-100 hover:border-indigo-200 hover:shadow-xl'
            }`}>
              <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4">I&apos;m a Driver</h3>
              <p className="text-gray-600 mb-6">
                Deliver packages along your commute and earn money on the miles you already drive. 
                Set your own routes and schedule.
              </p>
              <button 
                onClick={() => selectRole('slider')} 
                disabled={isLoading}
                className={`w-full font-semibold rounded-lg py-3 transition ${
                  isLoading && selectedRole === 'slider'
                    ? 'bg-indigo-400 cursor-not-allowed'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                {isLoading && selectedRole === 'slider' ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Setting up...
                  </span>
                ) : (
                  'Become a Slider'
                )}
              </button>
            </div>
            
            <div className={`bg-white rounded-2xl shadow-lg p-8 text-center border-2 transition-all duration-200 ${
              selectedRole === 'shipper' 
                ? 'border-indigo-500 shadow-indigo-100' 
                : 'border-gray-100 hover:border-indigo-200 hover:shadow-xl'
            }`}>
              <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4">I&apos;m a Shipper</h3>
              <p className="text-gray-600 mb-6">
                Send packages with local drivers for faster, greener, and cheaper delivery. 
                Perfect for businesses and individuals.
              </p>
              <button 
                onClick={() => selectRole('shipper')} 
                disabled={isLoading}
                className={`w-full font-semibold rounded-lg py-3 transition ${
                  isLoading && selectedRole === 'shipper'
                    ? 'bg-indigo-400 cursor-not-allowed'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                {isLoading && selectedRole === 'shipper' ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Setting up...
                  </span>
                ) : (
                  'Become a Shipper'
                )}
              </button>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <p className="text-sm text-gray-500">
              Not sure which to choose? You can always change your role later in your account settings.
            </p>
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