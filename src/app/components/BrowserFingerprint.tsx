"use client";

import React, { useEffect, useState } from 'react';
import FingerprintJS from '@fingerprintjs/fingerprintjs';

// Using Record<never, never> to properly define an empty props object
type BrowserFingerprintProps = Record<string, never>;

// Define a more flexible interface to match the FingerprintJS library's structure
interface FingerprintData {
  visitorId: string;
  components: Record<string, any>;
}

const BrowserFingerprint: React.FC<BrowserFingerprintProps> = () => {
  const [fingerprint, setFingerprint] = useState<FingerprintData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Only run on the client side
    if (typeof window === 'undefined') {
      return;
    }

    const generateFingerprint = async () => {
      try {
        setIsLoading(true);

        // Initialize the agent
        const fpPromise = FingerprintJS.load();
        const fp = await fpPromise;

        // Get the visitor identifier
        const result = await fp.get();

        setFingerprint({
          visitorId: result.visitorId,
          components: result.components
        });
      } catch (err) {
        console.error('Error generating fingerprint:', err);
        setError('Failed to generate browser fingerprint');
      } finally {
        setIsLoading(false);
      }
    };

    generateFingerprint();
  }, []);

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  // Format component values for display
  const formatValue = (component: any): string => {
    // Handle null or undefined
    if (component === null || component === undefined) return 'N/A';

    // Handle FingerprintJS component structure
    if (component.value !== undefined) {
      const value = component.value;
      if (value === null || value === undefined) return 'N/A';
      if (typeof value === 'boolean') return value ? 'Yes' : 'No';
      if (typeof value === 'object') return JSON.stringify(value);
      return String(value);
    }

    // Handle error case
    if (component.error) return `Error: ${component.error}`;

    // Fallback for other structures
    if (typeof component === 'object') return JSON.stringify(component);
    return String(component);
  };

  // Get a subset of interesting components to display
  const getInterestingComponents = () => {
    if (!fingerprint?.components) return [];

    const interestingKeys = [
      'userAgent',
      'webdriver',
      'language',
      'colorDepth',
      'deviceMemory',
      'hardwareConcurrency',
      'screenResolution',
      'timezone',
      'platform',
      'plugins',
      'canvas',
      'touchSupport',
      'fonts'
    ];

    return interestingKeys.filter(key => key in fingerprint.components);
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 w-full">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Browser Fingerprint</h2>

      <p className="text-gray-600 mb-4">
        Your browser has a unique fingerprint that can be used to identify you across websites.
      </p>

      {isLoading ? (
        <div className="flex items-center justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Generating fingerprint...</span>
        </div>
      ) : error ? (
        <div className="p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      ) : fingerprint ? (
        <div>
          <div className="bg-gray-100 p-4 rounded-md mb-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div>
                <p className="text-gray-700 font-medium">Your Fingerprint ID:</p>
                <p className="font-mono text-blue-600 break-all">{fingerprint.visitorId}</p>
              </div>
              <button
                onClick={toggleDetails}
                className="mt-2 md:mt-0 text-blue-600 hover:text-blue-800 font-medium"
              >
                {showDetails ? 'Hide Details' : 'Show Details'}
              </button>
            </div>
          </div>

          {showDetails && (
            <div className="mt-4">
              <h3 className="font-medium text-gray-700 mb-2">Fingerprint Components:</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Component</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {getInterestingComponents().map((key) => (
                      <tr key={key}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{key}</td>
                        <td className="px-6 py-4 text-sm text-gray-500 max-w-md truncate">
                          {formatValue(fingerprint.components[key])}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default BrowserFingerprint;
