"use client";

import React, { useState } from 'react';
import { BlacklistCheckResult } from '../api/blacklist/route';

interface BlacklistCheckerProps {
  ip: string;
}

const BlacklistChecker: React.FC<BlacklistCheckerProps> = ({ ip }) => {
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState<BlacklistCheckResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const checkBlacklist = async () => {
    if (!ip) return;
    
    try {
      setIsChecking(true);
      setError(null);
      
      const response = await fetch(`/api/blacklist?ip=${ip}`);
      
      if (!response.ok) {
        throw new Error('Failed to check blacklist');
      }
      
      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error('Error checking blacklist:', err);
      setError('Failed to check blacklist. Please try again later.');
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 w-full">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Blacklist Check</h2>
      
      <p className="text-gray-600 mb-4">
        Check if this IP address is listed on common spam blacklists.
      </p>
      
      <button
        onClick={checkBlacklist}
        disabled={isChecking}
        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors disabled:bg-blue-400"
      >
        {isChecking ? 'Checking...' : 'Check Blacklists'}
      </button>
      
      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      {result && (
        <div className="mt-4">
          <div className={`p-3 rounded-md ${result.isListed ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            <p className="font-medium">{result.message}</p>
          </div>
          
          {result.isListed && result.listedOn.length > 0 && (
            <div className="mt-3">
              <p className="font-medium text-gray-700">Listed on:</p>
              <ul className="list-disc pl-5 mt-1">
                {result.listedOn.map((service, index) => (
                  <li key={index} className="text-gray-600">{service}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BlacklistChecker;
