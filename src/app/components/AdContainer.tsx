'use client';

import React, { useEffect, useRef } from 'react';

interface AdContainerProps {
  type?: string;
  className?: string;
}

/**
 * Component that renders the Adstera ad container
 */
const AdContainer: React.FC<AdContainerProps> = ({ 
  type = 'default',
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const containerId = `container-771dd5361e5be79e2bc2d814d8c8a8f0`;

  useEffect(() => {
    // Only run on the client side
    if (typeof window === 'undefined') {
      return;
    }

    // Load the ad script
    const script = document.createElement('script');
    script.async = true;
    script.setAttribute('data-cfasync', 'false');
    script.src = '//pl26388675.profitableratecpm.com/771dd5361e5be79e2bc2d814d8c8a8f0/invoke.js';
    
    // Add the script to the container
    if (containerRef.current) {
      // Clear any existing content first
      containerRef.current.innerHTML = '';
      containerRef.current.appendChild(script);
    }
  }, []);

  return (
    <div className={`ad-container ${className}`}>
      <div id={containerId} ref={containerRef} className="w-full overflow-hidden"></div>
    </div>
  );
};

export default AdContainer;
