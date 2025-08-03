'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    feather: {
      replace: () => void;
    };
  }
}

export default function FeatherIcons() {
  useEffect(() => {
    // Initialize Feather Icons after component mounts
    if (typeof window !== 'undefined' && window.feather) {
      window.feather.replace();
    }
  }, []);

  return null;
} 