"use client";

import React, { useState } from 'react';
import { VPNDetectionResult } from '../api/vpn-detect/route';

interface VPNDetectorProps {
  ip: string;
}

const VPNDetector: React.FC<VPNDetectorProps> = ({ ip }) => {
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState<VPNDetectionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const detectVPN = async () => {
    if (!ip) return;

    try {
      setIsChecking(true);
      setError(null);

      const response = await fetch(`/api/vpn-detect?ip=${ip}`);

      if (!response.ok) {
        throw new Error('Failed to detect VPN');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error('Error detecting VPN:', err);
      setError('Failed to detect VPN. Please try again later.');
    } finally {
      setIsChecking(false);
    }
  };

  // Get risk level based on score
  const getRiskLevel = (score: number) => {
    if (score >= 70) return { level: 'High', color: 'text-red-600' };
    if (score >= 40) return { level: 'Medium', color: 'text-yellow-600' };
    return { level: 'Low', color: 'text-green-600' };
  };

  // Toggle debug information
  const [showDebug, setShowDebug] = useState(false);

  const toggleDebug = () => {
    setShowDebug(!showDebug);
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 w-full">
      <h2 className="text-xl font-bold text-gray-800 mb-4">VPN Detection</h2>

      <p className="text-gray-600 mb-4">
        Check if this IP address is using a VPN, proxy, or other anonymizing service.
      </p>

      <button
        onClick={detectVPN}
        disabled={isChecking}
        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors disabled:bg-blue-400"
      >
        {isChecking ? 'Checking...' : 'Detect VPN'}
      </button>

      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {result && (
        <div className="mt-4">
          <div className="p-4 bg-gray-100 rounded-md">
            <p className="font-medium text-gray-800 mb-2">{result.message}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
              <div>
                <p className="text-gray-600">Fraud Score:</p>
                <div className="flex items-center mt-1">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className={`h-2.5 rounded-full ${
                        result.fraudScore >= 70 ? 'bg-red-600' :
                        result.fraudScore >= 40 ? 'bg-yellow-500' :
                        'bg-green-500'
                      }`}
                      style={{ width: `${result.fraudScore}%` }}
                    ></div>
                  </div>
                  <span className={`ml-2 font-medium ${getRiskLevel(result.fraudScore).color}`}>
                    {result.fraudScore}% ({getRiskLevel(result.fraudScore).level})
                  </span>
                </div>

                {result.isp && (
                  <div className="mt-2">
                    <p className="text-gray-600">ISP:</p>
                    <p className="text-gray-800">{result.isp}</p>
                  </div>
                )}

                {result.host && (
                  <div className="mt-2">
                    <p className="text-gray-600">Host:</p>
                    <p className="text-gray-800">{result.host}</p>
                  </div>
                )}

                {result.country && (
                  <div className="mt-2">
                    <p className="text-gray-600">Location:</p>
                    <p className="text-gray-800">
                      {result.city && `${result.city}, `}
                      {result.region && `${result.region}, `}
                      {result.country}
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center">
                  <div className={`w-4 h-4 rounded-full mr-2 ${result.isVpn ? 'bg-red-500' : 'bg-gray-300'}`}></div>
                  <span className="text-gray-700">VPN: {result.isVpn ? 'Detected' : 'Not Detected'}</span>
                </div>
                <div className="flex items-center">
                  <div className={`w-4 h-4 rounded-full mr-2 ${result.isProxy ? 'bg-red-500' : 'bg-gray-300'}`}></div>
                  <span className="text-gray-700">Proxy: {result.isProxy ? 'Detected' : 'Not Detected'}</span>
                </div>
                <div className="flex items-center">
                  <div className={`w-4 h-4 rounded-full mr-2 ${result.isTor ? 'bg-red-500' : 'bg-gray-300'}`}></div>
                  <span className="text-gray-700">Tor: {result.isTor ? 'Detected' : 'Not Detected'}</span>
                </div>
                <div className="flex items-center">
                  <div className={`w-4 h-4 rounded-full mr-2 ${result.isBot ? 'bg-yellow-500' : 'bg-gray-300'}`}></div>
                  <span className="text-gray-700">Bot: {result.isBot ? 'Detected' : 'Not Detected'}</span>
                </div>
                <div className="flex items-center">
                  <div className={`w-4 h-4 rounded-full mr-2 ${result.isCrawler ? 'bg-yellow-500' : 'bg-gray-300'}`}></div>
                  <span className="text-gray-700">Crawler: {result.isCrawler ? 'Detected' : 'Not Detected'}</span>
                </div>
                <div className="flex items-center">
                  <div className={`w-4 h-4 rounded-full mr-2 ${result.mobile ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                  <span className="text-gray-700">Mobile: {result.mobile ? 'Yes' : 'No'}</span>
                </div>
              </div>
            </div>

            {/* Debug button */}
            <div className="mt-4 pt-2 border-t border-gray-200">
              <button
                onClick={toggleDebug}
                className="text-sm text-blue-500 hover:text-blue-700 focus:outline-none"
              >
                {showDebug ? 'Hide Debug Info' : 'Show Debug Info'}
              </button>

              {/* Debug information */}
              {showDebug && result.debug && (
                <div className="mt-2 p-3 bg-gray-50 rounded text-xs font-mono">
                  <h3 className="font-bold mb-1">Debug Information:</h3>
                  <p><span className="font-semibold">Source:</span> {result.debug.source}</p>

                  {result.debug.error && (
                    <p><span className="font-semibold">Error:</span> {result.debug.error}</p>
                  )}

                  <div className="mt-2">
                    <p className="font-semibold">Headers:</p>
                    <ul className="pl-2">
                      {result.debug.headers && Object.entries(result.debug.headers).map(([key, value]) => (
                        <li key={key}><span className="opacity-70">{key}:</span> {value}</li>
                      ))}
                    </ul>
                  </div>

                  {result.debug.rawResponse && (
                    <div className="mt-2">
                      <p className="font-semibold">Raw Response:</p>
                      <pre className="mt-1 p-2 bg-gray-100 rounded overflow-auto max-h-40">
                        {JSON.stringify(result.debug.rawResponse, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VPNDetector;
