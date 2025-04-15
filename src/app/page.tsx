"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import IPInfoCard from './components/IPInfoCard';
import AdBanner from './components/AdBanner';
import AdScript from './components/AdScript';
import AdContainer from './components/AdContainer';
import { IPInfo } from './api/ip/route';

// Dynamically import components that use browser-specific APIs
const LocationMap = dynamic(() => import('./components/LocationMap'), { ssr: false });
const BlacklistChecker = dynamic(() => import('./components/BlacklistChecker'), { ssr: false });
const NetworkTools = dynamic(() => import('./components/NetworkTools'), { ssr: false });
const BrowserFingerprint = dynamic(() => import('./components/BrowserFingerprint'), { ssr: false });
const VPNDetector = dynamic(() => import('./components/VPNDetector'), { ssr: false });

export default function Home() {
  // Import the ClientOnly component
  const ClientOnly = dynamic(() => import('./components/ClientOnly'), { ssr: false });
  const [ipInfo, setIpInfo] = useState<IPInfo | null>(null);
  const [userAgent, setUserAgent] = useState<string>('');
  const [deviceType, setDeviceType] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // This useEffect will only run on the client side
    const detectDeviceType = () => {
      if (typeof navigator === 'undefined') return 'Desktop';

      const ua = navigator.userAgent;
      if (/mobile/i.test(ua)) return 'Mobile';
      if (/tablet/i.test(ua)) return 'Tablet';
      if (/ipad/i.test(ua)) return 'Tablet';
      return 'Desktop';
    };

    const fetchIPInfo = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/ip');

        if (!response.ok) {
          throw new Error('Failed to fetch IP information');
        }

        const data = await response.json();
        setIpInfo(data);

        // Only set browser-specific information on the client side
        if (typeof navigator !== 'undefined') {
          setUserAgent(navigator.userAgent);
          setDeviceType(detectDeviceType());
        }
      } catch (err) {
        console.error('Error fetching IP info:', err);
        setError('Failed to fetch your IP information');
      } finally {
        setIsLoading(false);
      }
    };

    fetchIPInfo();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 font-[family-name:var(--font-geist-sans)]">
      {/* Header with logo and banner ad */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex flex-col items-center">
          <div className="flex items-center justify-center mb-4">
            <Image src="/logo.svg" alt="IPPeek Logo" width={40} height={40} className="mr-2" />
            <h1 className="text-2xl md:text-3xl font-bold text-blue-600">IPPeek</h1>
          </div>
          <ClientOnly>
            <AdScript />
            <AdContainer type="header" className="w-full h-24" />
          </ClientOnly>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main content area */}
          <div className="lg:w-2/3">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Check Your IP Address</h1>
            <p className="text-gray-600 mb-8">
              IPPeek instantly shows your current IP address, location, ISP information, and device details.
              All the information you need about your internet connection in one place.
            </p>

            {/* IP Information Card */}
            <IPInfoCard
              ipInfo={ipInfo}
              userAgent={userAgent}
              deviceType={deviceType}
              isLoading={isLoading}
              error={error}
            />

            {/* Location Map */}
            {ipInfo && (
              <div className="mt-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">IP Location Map</h2>
                <ClientOnly fallback={<div className="h-64 bg-gray-100 flex items-center justify-center"><p>Loading map...</p></div>}>
                  <LocationMap
                    latitude={ipInfo.latitude}
                    longitude={ipInfo.longitude}
                    city={ipInfo.city}
                    country={ipInfo.country_name}
                  />
                </ClientOnly>
              </div>
            )}

            {/* Inline ad */}
            <ClientOnly>
              <AdContainer type="inline" className="w-full my-6" />
            </ClientOnly>

            {/* Tabs for additional tools */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Advanced IP Tools</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* VPN Detection */}
                {ipInfo && (
                  <ClientOnly fallback={<div className="h-64 bg-gray-100 flex items-center justify-center"><p>Loading VPN detection...</p></div>}>
                    <VPNDetector ip={ipInfo.ip} />
                  </ClientOnly>
                )}

                {/* Blacklist Checker */}
                {ipInfo && (
                  <ClientOnly fallback={<div className="h-64 bg-gray-100 flex items-center justify-center"><p>Loading blacklist checker...</p></div>}>
                    <BlacklistChecker ip={ipInfo.ip} />
                  </ClientOnly>
                )}
              </div>

              <div className="mt-6">
                {/* Network Tools */}
                <ClientOnly fallback={<div className="h-64 bg-gray-100 flex items-center justify-center"><p>Loading network tools...</p></div>}>
                  <NetworkTools defaultTarget={ipInfo?.ip} />
                </ClientOnly>
              </div>

              <div className="mt-6">
                {/* Browser Fingerprint */}
                <ClientOnly fallback={<div className="h-64 bg-gray-100 flex items-center justify-center"><p>Loading browser fingerprint...</p></div>}>
                  <BrowserFingerprint />
                </ClientOnly>
              </div>
            </div>

            {/* Additional information */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Why Check Your IP?</h2>
              <ul className="list-disc pl-5 space-y-2 text-gray-600">
                <li>Verify your VPN is working correctly</li>
                <li>Troubleshoot network connectivity issues</li>
                <li>Confirm your geolocation for region-restricted content</li>
                <li>Check if your ISP is assigning you a new IP address</li>
                <li>Detect if your IP is on spam blacklists</li>
                <li>Analyze your browser fingerprint for privacy concerns</li>
              </ul>
            </div>
          </div>

          {/* Sidebar with ad */}
          <div className="lg:w-1/3">
            <ClientOnly>
              <AdContainer type="sidebar" className="w-full h-96" />
            </ClientOnly>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-sm">© {new Date().getFullYear()} IPPeek. All rights reserved.</p>
            </div>
            <div className="flex space-x-4">
              <a href="#" className="text-sm text-gray-300 hover:text-white">Privacy Policy</a>
              <a href="#" className="text-sm text-gray-300 hover:text-white">Terms of Service</a>
              <a href="#" className="text-sm text-gray-300 hover:text-white">Contact</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Sticky bottom ad for mobile */}
      <div className="lg:hidden">
        <ClientOnly>
          <AdContainer type="sticky" className="w-full h-16 fixed bottom-0 left-0 right-0 z-50" />
        </ClientOnly>
      </div>
    </div>
  );
}
