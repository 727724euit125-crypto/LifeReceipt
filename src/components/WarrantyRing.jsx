import React from 'react';

export function WarrantyRing({ daysRemaining, totalDays = 730, status }) {
  const percent = Math.min(Math.max((daysRemaining / totalDays) * 100, 0), 100);
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  const getColor = () => {
    if (status === 'PROTECTED') return '#10b981';
    if (status === 'EXPIRING') return '#f59e0b';
    return '#ff4d4d';
  };

  const strokeColor = getColor();

  return (
    <div className="relative w-36 h-36 mx-auto flex items-center justify-center select-none">
      <svg className="w-full h-full transform -rotate-90">
        {/* Background Track */}
        <circle
          cx="72"
          cy="72"
          r={radius}
          stroke="#e5e0d8"
          strokeWidth="10"
          fill="transparent"
          strokeDasharray="6 4"
        />
        {/* Animated Progress Ring */}
        <circle
          cx="72"
          cy="72"
          r={radius}
          stroke={strokeColor}
          strokeWidth="10"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      {/* Center Days Text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="font-heading text-3xl font-bold text-[#2d2d2d] leading-none">
          {daysRemaining}
        </span>
        <span className="font-mono text-[10px] font-bold text-[#2d2d2d]/70 tracking-wider">
          DAYS LEFT
        </span>
      </div>
    </div>
  );
}
