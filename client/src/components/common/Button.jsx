import React from 'react';
import { Loader2 } from 'lucide-react';

const variants = {
  primary:
    'bg-brand-600 hover:bg-brand-700 text-white shadow-xs font-semibold border border-transparent',
  secondary:
    'bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border border-slate-300 shadow-xs font-medium',
  accent:
    'bg-cyan-600 hover:bg-cyan-700 text-white font-semibold shadow-xs border border-transparent',
  outline:
    'bg-transparent hover:bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-300',
  ghost:
    'bg-transparent hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-transparent',
  danger:
    'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 hover:border-rose-300 font-medium',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs rounded-lg gap-1.5 min-h-[36px]',
  md: 'px-4 py-2 text-sm rounded-xl gap-2 min-h-[42px]',
  lg: 'px-6 py-3 text-base rounded-xl gap-2.5 min-h-[48px]',
};

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconRight: IconRight,
  loading = false,
  disabled = false,
  className = '',
  type = 'button',
  onClick,
  ...props
}) => {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`pressable inline-flex items-center justify-center font-medium transition-colors cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin shrink-0" />
      ) : Icon ? (
        <Icon className="w-4 h-4 shrink-0" strokeWidth={1.75} />
      ) : null}
      <span>{children}</span>
      {!loading && IconRight && (
        <IconRight className="w-4 h-4 shrink-0" strokeWidth={1.75} />
      )}
    </button>
  );
};
