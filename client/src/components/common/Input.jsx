import React from 'react';

export const Input = ({
  label,
  error,
  helperText,
  icon: Icon,
  className = '',
  id,
  type = 'text',
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs font-semibold text-slate-700 tracking-wide"
        >
          {label}
        </label>
      )}
      <div className="relative flex items-center w-full">
        {Icon && (
          <div className="absolute left-3.5 text-slate-400 pointer-events-none">
            <Icon className="w-4 h-4" strokeWidth={1.75} />
          </div>
        )}
        <input
          id={inputId}
          type={type}
          className={`w-full bg-white border text-slate-900 placeholder-slate-400 text-sm rounded-xl py-2.5 transition-colors duration-150 shadow-xs focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-600 ${
            Icon ? 'pl-10 pr-3.5' : 'px-3.5'
          } ${
            error
              ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20 text-rose-900'
              : 'border-slate-300 hover:border-slate-400'
          } ${className}`}
          {...props}
        />
      </div>
      {error && <span className="text-xs text-rose-600 font-medium">{error}</span>}
      {!error && helperText && (
        <span className="text-xs text-slate-500">{helperText}</span>
      )}
    </div>
  );
};
