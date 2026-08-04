import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, Home } from 'lucide-react';
import { Button } from '../components/common/Button';

export const NotFound = () => {
  return (
    <div className="min-h-screen bg-[#0B0F19] text-gray-100 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-3xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mb-6">
        <AlertCircle className="w-8 h-8" />
      </div>
      <h1 className="text-6xl font-extrabold text-white tracking-tight mb-2">404</h1>
      <h2 className="text-xl font-bold text-gray-300 mb-3">Page Not Found</h2>
      <p className="text-sm text-gray-400 max-w-md mb-8">
        The page you are looking for doesn't exist or has been moved to another location.
      </p>
      <Link to="/dashboard">
        <Button icon={Home} size="lg">
          Back to Dashboard
        </Button>
      </Link>
    </div>
  );
};
