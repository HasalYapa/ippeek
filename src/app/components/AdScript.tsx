'use client';

import { useEffect } from 'react';

interface AdScriptProps {
  id?: string;
}

/**
 * Component to load the Adstera ad network script in the head
 */
const AdScript: React.FC<AdScriptProps> = ({ id = 'adstera-script' }) => {
  useEffect(() => {
    // Only run on the client side
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return;
    }

    // Check if the script already exists
    if (document.getElementById(id)) {
      return;
    }

    // Create the script element
    const script = document.createElement('script');
    script.id = id;
    script.async = true;
    script.setAttribute('data-cfasync', 'false');
    script.src = '//pl26388675.profitableratecpm.com/771dd5361e5be79e2bc2d814d8c8a8f0/invoke.js';
    
    // Add the script to the head
    document.head.appendChild(script);

    // Cleanup function
    return () => {
      // Remove the script when the component unmounts
      const existingScript = document.getElementById(id);
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, [id]);

  // This component doesn't render anything
  return null;
};

export default AdScript;
