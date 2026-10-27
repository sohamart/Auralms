import React from 'react';

const badgeVariants = {
  default: 'bg-slate-100 text-slate-700 border-slate-200',
  brand: 'bg-brand-50 text-brand-700 border-brand-200',
  accent: 'bg-cyan-50 text-cyan-700 border-cyan-200',
  success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  warning: 'bg-amber-50 text-amber-800 border-amber-200',
  danger: 'bg-rose-50 text-rose-700 border-rose-200',
};

export const Badge = ({ children, variant = 'default', className = '' }) => {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${badgeVariants[variant]} ${className}`}
    >
      {children}
    </span>
  );
};
