import React, { useState } from 'react';
import { IPInfo } from '../api/ip/route';

interface IPInfoCardProps {
  ipInfo: IPInfo | null;
  userAgent: string;
  deviceType: string;
  isLoading: boolean;
  error: string | null;
}

const IPInfoCard: React.FC<IPInfoCardProps> = ({
  ipInfo,
  userAgent,
  deviceType,
  isLoading,
  error,
}) => {
  const [showDebug, setShowDebug] = useState(false);

  const toggleDebug = () => {
    setShowDebug(!showDebug);
  };
  if (isLoading) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md mx-auto animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md mx-auto">
        <div className="text-red-500 font-medium">Error: {error}</div>
        <p className="mt-2 text-gray-600">
          Unable to fetch your IP information. Please try again later.
        </p>
      </div>
    );
  }

  if (!ipInfo) {
    return null;
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md mx-auto">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Your IP Information</h2>

      <div className="space-y-3">
        <div>
          <span className="font-medium text-gray-700">IP Address:</span>
          <span className="ml-2 text-gray-600">{ipInfo.ip} ({ipInfo.version})</span>
        </div>

        <div>
          <span className="font-medium text-gray-700">Location:</span>
          <span className="ml-2 text-gray-600">
            {ipInfo.city}, {ipInfo.region}, {ipInfo.country_name}
          </span>
        </div>

        <div>
          <span className="font-medium text-gray-700">ISP:</span>
          <span className="ml-2 text-gray-600">{ipInfo.org}</span>
        </div>

        <div>
          <span className="font-medium text-gray-700">Timezone:</span>
          <span className="ml-2 text-gray-600">{ipInfo.timezone}</span>
        </div>

        <div className="pt-2 border-t border-gray-200">
          <span className="font-medium text-gray-700">Browser/OS:</span>
          <span className="ml-2 text-gray-600">{userAgent}</span>
        </div>

        <div>
          <span className="font-medium text-gray-700">Device Type:</span>
          <span className="ml-2 text-gray-600">{deviceType}</span>
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
        {showDebug && ipInfo.debug && (
          <div className="mt-2 p-3 bg-gray-50 rounded text-xs font-mono">
            <h3 className="font-bold mb-1">Debug Information:</h3>
            <p><span className="font-semibold">Source:</span> {ipInfo.debug.source}</p>

            {ipInfo.debug.error && (
              <p><span className="font-semibold">Error:</span> {ipInfo.debug.error}</p>
            )}

            <div className="mt-2">
              <p className="font-semibold">Headers:</p>
              <ul className="pl-2">
                {Object.entries(ipInfo.debug.headers).map(([key, value]) => (
                  <li key={key}><span className="opacity-70">{key}:</span> {value}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default IPInfoCard;
