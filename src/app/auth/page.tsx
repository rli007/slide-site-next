'use client';

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Auth() {
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isClient, setIsClient] = useState(false);

  const LS_KEY = 'slideUser';

  useEffect(() => {
    setIsClient(true);
    // Auto-redirect if already logged in
    const user = JSON.parse(localStorage.getItem(LS_KEY) || 'null');
    if (user) {
      if (user.role) {
        window.location.href = user.role === 'slider' ? '/slider-dashboard' : '/shipper-dashboard';
      } else {
        window.location.href = '/role-select';
      }
    }
  }, []);

  const toggleMode = () => {
    setAuthMode(authMode === 'login' ? 'signup' : 'login');
  };

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    
    let user = JSON.parse(localStorage.getItem(LS_KEY) || 'null');

    if (authMode === 'signup') {
      if (user) {
        alert('An account already exists. Please log in.');
        return;
      }
      user = { email, role: null, routes: [], packages: [] };
      localStorage.setItem(LS_KEY, JSON.stringify(user));
      window.location.href = '/role-select';
    } else {
      if (!user || user.email !== email) {
        alert('No account found. Please sign up.');
        return;
      }
      window.location.href = user.role ? 
        (user.role === 'slider' ? '/slider-dashboard' : '/shipper-dashboard') : 
        '/role-select';
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

      {/* === AUTH CARD === */}
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-extrabold text-center mb-6">
            {authMode === 'login' ? 'Log in to Slide' : 'Create your Slide account'}
          </h2>
          <form onSubmit={handleAuth}>
            <label className="block mb-4">
              <span className="text-sm font-medium">Email</span>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
                className="mt-1 w-full rounded-lg border-gray-300 focus:ring-indigo-600" 
              />
            </label>
            <label className="block mb-6">
              <span className="text-sm font-medium">Password</span>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
                className="mt-1 w-full rounded-lg border-gray-300 focus:ring-indigo-600" 
              />
            </label>
            <button 
              type="submit" 
              className="w-full bg-indigo-600 text-white font-semibold rounded-lg py-2 hover:bg-indigo-700 transition"
            >
              {authMode === 'login' ? 'Log in' : 'Sign up'}
            </button>
            <p 
              className="text-xs text-center mt-4 text-indigo-600 cursor-pointer" 
              onClick={toggleMode}
            >
              {authMode === 'login' ? 'Need an account? Sign up' : 'Have an account? Log in'}
            </p>
          </form>
        </div>
      </main>

      {/* === FOOTER === */}
      <footer className="bg-gray-900 text-gray-400 text-xs py-4 text-center">
        © 2025 Slide Logistics, Inc.
      </footer>
    </>
  );
} 