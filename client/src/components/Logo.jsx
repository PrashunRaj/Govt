import React from 'react';

const Logo = ({ variant = "default", size = "medium" }) => {
  const sizes = {
    small: { width: 120, height: 36, fontSize: 18 },
    medium: { width: 200, height: 60, fontSize: 24 },
    large: { width: 280, height: 84, fontSize: 32 }
  };

  const currentSize = sizes[size];

  return (
    <svg 
      width={currentSize.width} 
      height={currentSize.height} 
      viewBox={`0 0 ${currentSize.width} ${currentSize.height}`} 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Voice Wave Icon */}
      <circle cx="30" cy="30" r="25" fill="#4F46E5" opacity="0.1"/>
      <path d="M20 30 Q25 20 30 30 Q35 40 40 30" stroke="#4F46E5" strokeWidth="3" fill="none"/>
      <path d="M15 30 Q22.5 15 30 30 Q37.5 45 45 30" stroke="#4F46E5" strokeWidth="2" fill="none" opacity="0.6"/>
      <path d="M10 30 Q20 10 30 30 Q40 50 50 30" stroke="#4F46E5" strokeWidth="1.5" fill="none" opacity="0.4"/>
      
      {/* Text */}
      <text 
        x="65" 
        y={currentSize.height * 0.42} 
        fontFamily="Inter, sans-serif" 
        fontSize={currentSize.fontSize} 
        fontWeight="700" 
        fill="#1F2937"
      >
        Awaaz
      </text>
      <text 
        x="65" 
        y={currentSize.height * 0.7} 
        fontFamily="Inter, sans-serif" 
        fontSize={currentSize.fontSize * 0.4} 
        fontWeight="400" 
        fill="#6B7280"
      >
        Community Voice Platform
      </text>
    </svg>
  );
};

export default Logo;
