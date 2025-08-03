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
    // Dynamically load Feather Icons script
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/feather-icons';
    script.onload = () => {
      if (window.feather) {
        window.feather.replace();
      }
    };
    document.head.appendChild(script);

    return () => {
      // Cleanup
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  return null;
} 