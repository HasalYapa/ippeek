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
                <p className="text-gray-600">Risk Score:</p>
                <div className="flex items-center mt-1">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className={`h-2.5 rounded-full ${
                        result.riskScore >= 70 ? 'bg-red-600' : 
                        result.riskScore >= 40 ? 'bg-yellow-500' : 
                        'bg-green-500'
                      }`} 
                      style={{ width: `${result.riskScore}%` }}
                    ></div>
                  </div>
                  <span className={`ml-2 font-medium ${getRiskLevel(result.riskScore).color}`}>
                    {result.riskScore}% ({getRiskLevel(result.riskScore).level})
                  </span>
                </div>
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
                  <div className={`w-4 h-4 rounded-full mr-2 ${result.isHosting ? 'bg-yellow-500' : 'bg-gray-300'}`}></div>
                  <span className="text-gray-700">Hosting: {result.isHosting ? 'Detected' : 'Not Detected'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VPNDetector;
