'use client';

import React, { useEffect, useRef } from 'react';

interface AdBannerProps {
  type: 'header' | 'sidebar' | 'inline' | 'sticky';
}

const AdBanner: React.FC<AdBannerProps> = ({ type }) => {
  const adContainerRef = useRef<HTMLDivElement>(null);

  // Different styles based on ad type
  const getAdStyles = () => {
    switch (type) {
      case 'header':
        return 'w-full md:h-auto bg-gray-100 mb-6 p-2 overflow-hidden';
      case 'sidebar':
        return 'hidden lg:block w-full bg-gray-100 p-2 overflow-hidden';
      case 'inline':
        return 'w-full md:h-auto bg-gray-100 my-6 p-2 overflow-hidden';
      case 'sticky':
        return 'w-full bg-gray-100 fixed bottom-0 left-0 right-0 p-2 z-50 overflow-hidden';
      default:
        return 'w-full bg-gray-100 p-2 overflow-hidden';
    }
  };

  useEffect(() => {
    // Only run on the client side
    if (typeof window === 'undefined') {
      return;
    }

    // Create the script element
    const script = document.createElement('script');
    script.async = true;
    script.setAttribute('data-cfasync', 'false');
    script.src = '//pl26388675.profitableratecpm.com/771dd5361e5be79e2bc2d814d8c8a8f0/invoke.js';

    // Create the container div
    const container = document.createElement('div');
    container.id = `container-771dd5361e5be79e2bc2d814d8c8a8f0-${type}`;

    // Clear any existing content
    if (adContainerRef.current) {
      adContainerRef.current.innerHTML = '';

      // Append the new elements
      adContainerRef.current.appendChild(script);
      adContainerRef.current.appendChild(container);
    }

    // Cleanup function
    return () => {
      if (adContainerRef.current) {
        adContainerRef.current.innerHTML = '';
      }
    };
  }, [type]);

  return (
    <div className={`${getAdStyles()} rounded`} ref={adContainerRef}>
      <p className="text-gray-500 text-sm text-center">Advertisement</p>
    </div>
  );
};

export default AdBanner;
