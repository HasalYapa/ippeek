import React from 'react';

interface AdBannerProps {
  type: 'header' | 'sidebar' | 'inline' | 'sticky';
}

const AdBanner: React.FC<AdBannerProps> = ({ type }) => {
  // Different styles based on ad type
  const getAdStyles = () => {
    switch (type) {
      case 'header':
        return 'w-full h-16 md:h-24 bg-gray-200 mb-6';
      case 'sidebar':
        return 'hidden lg:block w-full h-96 bg-gray-200';
      case 'inline':
        return 'w-full h-16 md:h-20 bg-gray-200 my-6';
      case 'sticky':
        return 'w-full h-16 bg-gray-200 fixed bottom-0 left-0 right-0';
      default:
        return 'w-full h-16 bg-gray-200';
    }
  };

  return (
    <div className={`${getAdStyles()} rounded flex items-center justify-center`}>
      <p className="text-gray-500 text-sm">Advertisement</p>
    </div>
  );
};

export default AdBanner;
