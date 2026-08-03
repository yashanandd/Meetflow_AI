import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingSpinner = ({ label = 'Loading...', fullScreen = false }) => {
  if (fullScreen) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0B0F19] text-gray-300 gap-3">
        <Loader2 className="w-10 h-10 text-brand-500 animate-spin" />
        <span className="text-sm font-medium tracking-wide animate-pulse">{label}</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-8 text-gray-400 gap-3">
      <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
      <span className="text-xs font-medium tracking-wider uppercase animate-pulse">{label}</span>
    </div>
  );
};
