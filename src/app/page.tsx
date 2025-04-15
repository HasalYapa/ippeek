"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import IPInfoCard from './components/IPInfoCard';
import AdBanner from './components/AdBanner';
import LocationMap from './components/LocationMap';
import BlacklistChecker from './components/BlacklistChecker';
import NetworkTools from './components/NetworkTools';
import BrowserFingerprint from './components/BrowserFingerprint';
import VPNDetector from './components/VPNDetector';
import { IPInfo } from './api/ip/route';

export default function Home() {
  const [ipInfo, setIpInfo] = useState<IPInfo | null>(null);
  const [userAgent, setUserAgent] = useState<string>('');
  const [deviceType, setDeviceType] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Only run on the client side
    if (typeof window === 'undefined' || typeof navigator === 'undefined') {
      return;
    }

    const detectDeviceType = () => {
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
        setUserAgent(navigator.userAgent);
        setDeviceType(detectDeviceType());
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
          <AdBanner type="header" />
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
                <LocationMap
                  latitude={ipInfo.latitude}
                  longitude={ipInfo.longitude}
                  city={ipInfo.city}
                  country={ipInfo.country_name}
                />
              </div>
            )}

            {/* Inline ad */}
            <AdBanner type="inline" />

            {/* Tabs for additional tools */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Advanced IP Tools</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* VPN Detection */}
                {ipInfo && (
                  <VPNDetector ip={ipInfo.ip} />
                )}

                {/* Blacklist Checker */}
                {ipInfo && (
                  <BlacklistChecker ip={ipInfo.ip} />
                )}
              </div>

              <div className="mt-6">
                {/* Network Tools */}
                <NetworkTools defaultTarget={ipInfo?.ip} />
              </div>

              <div className="mt-6">
                {/* Browser Fingerprint */}
                <BrowserFingerprint />
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
            <AdBanner type="sidebar" />
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
        <AdBanner type="sticky" />
      </div>
    </div>
  );
}
