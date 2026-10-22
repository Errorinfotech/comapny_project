import React, { forwardRef } from 'react';

export const Textarea = forwardRef(function Textarea(
  {
    label,
    error,
    helperText,
    className = '',
    id,
    rows = 4,
    ...props
  },
  ref
) {
  const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full flex flex-col space-y-1.5">
      {label && (
        <label
          htmlFor={textareaId}
          className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider"
        >
          {label}
        </label>
      )}

      <textarea
        ref={ref}
        id={textareaId}
        rows={rows}
        className={`
          w-full rounded-xl p-3 text-sm transition-all duration-200
          bg-white/80 dark:bg-slate-900/60 
          text-slate-900 dark:text-slate-100
          placeholder:text-slate-400 dark:placeholder:text-slate-500
          border border-slate-200 dark:border-slate-800
          focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500
          ${error ? 'border-rose-500 focus:ring-rose-500/40 focus:border-rose-500' : ''}
          ${className}
        `}
        {...props}
      />

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

export default Textarea;
