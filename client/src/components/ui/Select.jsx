import React, { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

export const Select = forwardRef(function Select(
  {
    label,
    error,
    helperText,
    icon: Icon,
    children,
    className = '',
    id,
    ...props
  },
  ref
) {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full flex flex-col space-y-1.5">
      {label && (
        <label
          htmlFor={selectId}
          className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider"
        >
          {label}
        </label>
      )}

      <div className="relative rounded-xl shadow-sm">
        {Icon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
            <Icon className="w-4 h-4" />
          </div>
        )}

        <select
          ref={ref}
          id={selectId}
          className={`
            w-full rounded-xl py-2.5 text-sm transition-all duration-200 appearance-none
            bg-white/80 dark:bg-slate-900/60 
            text-slate-900 dark:text-slate-100
            border border-slate-200 dark:border-slate-800
            focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500
            ${Icon ? 'pl-10' : 'pl-4'}
            pr-10
            ${error ? 'border-rose-500 focus:ring-rose-500/40 focus:border-rose-500' : ''}
            ${className}
          `}
          {...props}
        >
          {children}
        </select>

        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400">
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>

      {error && (
        <p className="text-xs text-rose-500 flex items-center gap-1 font-medium mt-1">
          <span>{error}</span>
        </p>
      )}

      {helperText && !error && (
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
          {helperText}
        </p>
      )}
    </div>
  );
});

export default Select;
