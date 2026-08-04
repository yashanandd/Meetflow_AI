import React from 'react';
import { getPriorityBadgeClass, getStatusBadgeClass } from '../../utils/formatters';

export const Badge = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    default: 'bg-gray-800 text-gray-300 border-gray-700',
    brand: 'bg-brand-500/10 text-brand-400 border-brand-500/20',
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    danger: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
};

export const PriorityBadge = ({ priority }) => {
  const badgeClass = getPriorityBadgeClass(priority);
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border uppercase tracking-wider ${badgeClass}`}>
      {priority}
    </span>
  );
};

export const StatusBadge = ({ status }) => {
  const badgeClass = getStatusBadgeClass(status);
  const label = status ? status.replace('_', ' ') : '';
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border uppercase tracking-wider capitalize ${badgeClass}`}>
      {label}
    </span>
  );
};
