// import React from 'react';

interface UBASLogoProps {
  className?: string;
  width?: number;
  height?: number;
  variant?: 'full' | 'icon' | 'text';
}

export const UBASLogo: React.FC<UBASLogoProps> = ({ 
  className = '', 
  width = 200, 
  height = 80,
  variant = 'full'
}) => {
  // UBA-style colors using our official UBA red
  const primaryRed = '#E53935'; // Official UBA red
  const white = '#FFFFFF';
  
  if (variant === 'icon') {
    // Just the triangular symbol
    return (
      <svg
        width={height}
        height={height}
        viewBox="0 0 80 80"
        className={className}
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="80" height="80" fill={primaryRed} rx="8" />
        <g transform="translate(20, 20)">
          {/* Main triangle */}
          <path
            d="M 0 40 L 30 10 L 40 20 L 40 40 Z"
            fill={white}
          />
          {/* Accent triangle */}
          <path
            d="M 30 10 L 40 0 L 40 20 Z"
            fill={white}
            opacity="0.9"
          />
        </g>
      </svg>
    );
  }

  if (variant === 'text') {
    // Just the text without icon
    return (
      <svg
        width={width}
        height={height}
        viewBox="0 0 280 80"
        className={className}
        xmlns="http://www.w3.org/2000/svg"
      >
        <text x="0" y="35" fill={primaryRed} fontSize="32" fontWeight="bold" fontFamily="Arial, sans-serif">
          UBAS
        </text>
        <text x="0" y="55" fill={primaryRed} fontSize="14" fontFamily="Arial, sans-serif">
          Financial Trust
        </text>
      </svg>
    );
  }

  // Full logo with icon and text
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 280 80"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background */}
      <rect width="280" height="80" fill={primaryRed} rx="8" />
      
      {/* Icon Section */}
      <g transform="translate(15, 15)">
        {/* Main triangle */}
        <path
          d="M 0 35 L 25 10 L 35 17 L 35 35 Z"
          fill={white}
        />
        {/* Accent triangle */}
        <path
          d="M 25 10 L 35 2 L 35 17 Z"
          fill={white}
          opacity="0.9"
        />
      </g>
      
      {/* Text Section */}
      <g transform="translate(65, 0)">
        {/* UBAS Text */}
        <text x="0" y="35" fill={white} fontSize="28" fontWeight="bold" fontFamily="Arial, sans-serif">
          UBAS
        </text>
        {/* Subtitle */}
        <text x="0" y="55" fill={white} fontSize="12" fontFamily="Arial, sans-serif" opacity="0.95">
          Financial Trust
        </text>
      </g>
    </svg>
  );
};

// Alternative horizontal layout logo
export const UBASLogoHorizontal: React.FC<UBASLogoProps> = ({ 
  className = '', 
  width = 320, 
  height = 60
}) => {
  const primaryRed = '#E53935';
  const white = '#FFFFFF';
  
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 320 60"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background */}
      <rect width="320" height="60" fill={primaryRed} rx="6" />
      
      {/* Icon Section */}
      <g transform="translate(12, 12)">
        {/* Main triangle */}
        <path
          d="M 0 26 L 20 8 L 28 13 L 28 26 Z"
          fill={white}
        />
        {/* Accent triangle */}
        <path
          d="M 20 8 L 28 2 L 28 13 Z"
          fill={white}
          opacity="0.9"
        />
      </g>
      
      {/* Text Section */}
      <g transform="translate(55, 0)">
        {/* UBAS Text */}
        <text x="0" y="30" fill={white} fontSize="24" fontWeight="bold" fontFamily="Arial, sans-serif">
          UBAS
        </text>
        {/* Subtitle */}
        <text x="0" y="45" fill={white} fontSize="10" fontFamily="Arial, sans-serif" opacity="0.95">
          Financial Trust
        </text>
      </g>
    </svg>
  );
};

// Compact version for smaller spaces
export const UBASLogoCompact: React.FC<UBASLogoProps> = ({ 
  className = '', 
  width = 160, 
  height = 40
}) => {
  const primaryRed = '#E53935';
  const white = '#FFFFFF';
  
  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      {/* Icon */}
      <div 
        className="flex items-center justify-center rounded"
        style={{ 
          backgroundColor: primaryRed, 
          width: height, 
          height: height 
        }}
      >
        <svg
          width={height * 0.6}
          height={height * 0.6}
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M 2 18 L 16 6 L 22 10 L 22 18 Z"
            fill={white}
          />
          <path
            d="M 16 6 L 22 2 L 22 10 Z"
            fill={white}
            opacity="0.9"
          />
        </svg>
      </div>
      
      {/* Text */}
      <div className="flex flex-col">
        <span 
          className="font-bold leading-none"
          style={{ 
            color: primaryRed, 
            fontSize: height * 0.4 
          }}
        >
          UBAS
        </span>
        <span 
          className="text-xs leading-none opacity-80"
          style={{ 
            color: primaryRed, 
            fontSize: height * 0.2 
          }}
        >
          Financial Trust
        </span>
      </div>
    </div>
  );
};

export default UBASLogo;
