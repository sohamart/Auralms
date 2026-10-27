import React from 'react';

export const ProgressBar = ({
  percentage = 0,
  label,
  showPercentage = true,
  size = 'md',
  className = '',
}) => {
  const clamped = Math.min(100, Math.max(0, Math.round(percentage)));
  const isComplete = clamped === 100;

  const heightClasses = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3',
  };

  return (
    <div className={`w-full flex flex-col gap-1.5 ${className}`}>
      {(label || showPercentage) && (
        <div className="flex justify-between items-center text-xs">
          {label && <span className="text-slate-600 font-medium">{label}</span>}
          {showPercentage && (
            <span
              className={`tabular-nums font-semibold ml-auto ${
                isComplete ? 'text-emerald-600' : 'text-brand-600'
              }`}
            >
              {clamped}%
            </span>
          )}
        </div>
      )}
      <div
        className={`w-full bg-slate-200/80 rounded-full overflow-hidden ${heightClasses[size]}`}
      >
        <div
          className={`h-full transition-all duration-500 ease-out rounded-full ${
            isComplete
              ? 'bg-emerald-600'
              : 'bg-brand-600'
          }`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
};
