'use client';

import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { createUser, getUserByEmail, testDatabaseAccess } from "../../lib/database";

export default function Auth() {
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setIsClient(true);
    // Check if user is already logged in via Supabase
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Check if user has a role set
        try {
          const userProfile = await getUserByEmail(user.email!);
          if (userProfile.role) {
            window.location.href = userProfile.role === 'slider' ? '/slider-dashboard' : '/shipper-dashboard';
          } else {
            window.location.href = '/role-select';
          }
        } catch (error) {
          // User doesn't exist in our database yet
          window.location.href = '/role-select';
        }
      }
    };
    checkUser();
  }, []);

  const toggleMode = () => {
    setAuthMode(authMode === 'login' ? 'signup' : 'login');
    setError('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  const validateForm = () => {
    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields');
      return false;
    }
    
    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return false;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    
    if (authMode === 'signup' && password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    
    return true;
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      if (authMode === 'signup') {
        // Sign up with Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email,
          password,
        });

        if (authError) {
          if (authError.message.includes('already registered')) {
            setError('An account already exists with this email. Please log in.');
          } else {
            setError(authError.message);
          }
          setIsLoading(false);
          return;
        }

        if (authData.user) {
          // Create user profile in our database
          try {
            // Wait for the session to be established
            let session = null;
            let attempts = 0;
            
            while (!session && attempts < 10) {
              await new Promise(resolve => setTimeout(resolve, 500));
              const { data: { session: currentSession } } = await supabase.auth.getSession();
              session = currentSession;
              attempts++;
              console.log(`Session check attempt ${attempts}:`, session ? 'Found' : 'Not found');
            }
            
            if (!session) {
              throw new Error('Session not established after signup');
            }
            
            console.log('Session established, creating user profile...');
            await createUser(authData.user.email!);
            // Redirect to role selection
            window.location.href = '/role-select';
          } catch (dbError) {
            console.error('Database error:', dbError);
            // If profile creation fails, we still have the auth user
            // Let them try to log in
            setError('Account created but profile setup failed. Please try logging in.');
            setIsLoading(false);
          }
        }
      } else {
        // Sign in with Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (authError) {
          setError('Invalid email or password. Please try again.');
          setIsLoading(false);
          return;
        }

        if (authData.user) {
          // Check user role and redirect accordingly
          try {
            const userProfile = await getUserByEmail(authData.user.email!);
            if (userProfile.role) {
              window.location.href = userProfile.role === 'slider' ? '/slider-dashboard' : '/shipper-dashboard';
            } else {
              window.location.href = '/role-select';
            }
          } catch (dbError) {
            // User might not have a profile yet, create one
            try {
              await createUser(authData.user.email!);
              window.location.href = '/role-select';
            } catch (createError) {
              setError('User profile not found. Please contact support.');
              setIsLoading(false);
            }
          }
        }
      }
    } catch (err) {
      console.error('Auth error:', err);
      setError('Something went wrong. Please try again.');
      setIsLoading(false);
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
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}
          
          <form onSubmit={handleAuth}>
            <label className="block mb-4">
              <span className="text-sm font-medium text-gray-700">Email</span>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
                className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition" 
                placeholder="Enter your email"
              />
            </label>
            
            <label className="block mb-4">
              <span className="text-sm font-medium text-gray-700">Password</span>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
                className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition" 
                placeholder="Enter your password"
              />
            </label>
            
            {authMode === 'signup' && (
              <label className="block mb-6">
                <span className="text-sm font-medium text-gray-700">Confirm Password</span>
                <input 
                  type="password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required 
                  className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition" 
                  placeholder="Confirm your password"
                />
              </label>
            )}
            
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-indigo-600 text-white font-semibold rounded-lg py-3 hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed transition"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {authMode === 'login' ? 'Signing in...' : 'Creating account...'}
                </span>
              ) : (
                authMode === 'login' ? 'Log in' : 'Sign up'
              )}
            </button>
            
            <p 
              className="text-sm text-center mt-6 text-gray-600"
            >
              {authMode === 'login' ? "Don't have an account? " : "Already have an account? "}
              <button
                type="button"
                onClick={toggleMode}
                className="text-indigo-600 hover:text-indigo-700 font-medium"
              >
                {authMode === 'login' ? 'Sign up' : 'Log in'}
              </button>
            </p>
            
            {/* Debug button - remove this in production */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={async () => {
                  console.log('Testing database access...');
                  const result = await testDatabaseAccess();
                  console.log('Test result:', result);
                }}
                className="w-full text-xs text-gray-500 hover:text-gray-700 py-2"
              >
                🐛 Debug: Test Database Access
              </button>
            </div>
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