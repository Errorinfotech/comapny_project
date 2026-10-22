import React, { forwardRef } from 'react';

export const Input = forwardRef(function Input(
  {
    label,
    error,
    helperText,
    icon: Icon,
    iconPosition = 'left',
    className = '',
    id,
    type = 'text',
    ...props
  },
  ref
) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full flex flex-col space-y-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider"
        >
          {label}
        </label>
      )}

      <div className="relative rounded-xl shadow-sm">
        {Icon && iconPosition === 'left' && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
            <Icon className="w-4 h-4" />
          </div>
        )}

        <input
          ref={ref}
          id={inputId}
          type={type}
          className={`
            w-full rounded-xl py-2.5 text-sm transition-all duration-200
            bg-white/80 dark:bg-slate-900/60 
            text-slate-900 dark:text-slate-100
            placeholder:text-slate-400 dark:placeholder:text-slate-500
            border border-slate-200 dark:border-slate-800
            focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500
            ${Icon && iconPosition === 'left' ? 'pl-10' : 'pl-4'}
            ${Icon && iconPosition === 'right' ? 'pr-10' : 'pr-4'}
            ${error ? 'border-rose-500 focus:ring-rose-500/40 focus:border-rose-500' : ''}
            ${className}
          `}
          {...props}
        />

        {Icon && iconPosition === 'right' && (
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400">
            <Icon className="w-4 h-4" />
          </div>
        )}
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

export default Input;
