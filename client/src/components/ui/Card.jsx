import React from 'react';

export function Card({ children, className = '', hover = true, ...props }) {
  const hoverClass = hover ? 'hover:-translate-y-0.5 hover:shadow-xl dark:hover:shadow-2xl dark:hover:shadow-indigo-950/20' : '';
  return (
    <div
      className={`glass-card rounded-2xl p-6 transition-all duration-300 ${hoverClass} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '', ...props }) {
  return (
    <div className={`flex flex-col space-y-1.5 pb-4 border-b border-slate-100 dark:border-slate-800/60 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className = '', ...props }) {
  return (
    <h3 className={`text-lg font-bold text-slate-900 dark:text-white tracking-tight ${className}`} {...props}>
      {children}
    </h3>
  );
}

export function CardDescription({ children, className = '', ...props }) {
  return (
    <p className={`text-sm text-slate-500 dark:text-slate-400 ${className}`} {...props}>
      {children}
    </p>
  );
}

export function CardContent({ children, className = '', ...props }) {
  return (
    <div className={`pt-4 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className = '', ...props }) {
  return (
    <div className={`pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between ${className}`} {...props}>
      {children}
    </div>
  );
}

export default Card;
