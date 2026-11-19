import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'success' | 'warning' | 'error' | 'brand' | 'blue' | 'red' | 'yellow';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'default',
  size = 'md',
  children,
  ...props
}) => {
  const variants = {
    default: 'bg-white text-slate-700 border-slate-200 shadow-subtle',
    secondary: 'bg-slate-100 text-slate-800 border-slate-200',
    outline: 'bg-transparent text-slate-600 border-slate-300',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-sunshine-50 text-sunshine-800 border-sunshine-200',
    error: 'bg-coral-50 text-coral-700 border-coral-200',
    brand: 'bg-brand-50 text-brand-700 border-brand-200',
    blue: 'bg-brand-50 text-brand-700 border-brand-200',
    red: 'bg-coral-50 text-coral-700 border-coral-200',
    yellow: 'bg-sunshine-50 text-sunshine-800 border-sunshine-300',
  };

  const sizes = {
    sm: 'text-[11px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full border tracking-wide transition-colors',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
