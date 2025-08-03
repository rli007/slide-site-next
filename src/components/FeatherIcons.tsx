'use client';

import { useEffect } from 'react';

export default function FeatherIcons() {
  useEffect(() => {
    // Initialize Feather Icons after component mounts
    if (typeof window !== 'undefined' && (window as any).feather) {
      (window as any).feather.replace();
    }
  }, []);

  return null;
} 