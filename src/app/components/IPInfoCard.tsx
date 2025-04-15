import React from 'react';
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
    </div>
  );
};

export default IPInfoCard;
