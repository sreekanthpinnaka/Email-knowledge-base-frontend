import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'yellow' | 'red';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer select-none';

    const variants = {
      primary:
        'bg-brand-600 text-white hover:bg-brand-700 active:bg-brand-800 focus:ring-brand-500 shadow-md shadow-brand-500/20 border border-brand-700/20',
      secondary:
        'bg-sunshine-400 text-slate-900 hover:bg-sunshine-500 active:bg-sunshine-600 font-semibold focus:ring-sunshine-400 shadow-sm border border-sunshine-500/30',
      yellow:
        'bg-sunshine-400 text-slate-900 hover:bg-sunshine-500 active:bg-sunshine-600 font-semibold focus:ring-sunshine-400 shadow-sm border border-sunshine-500/30',
      red:
        'bg-coral-600 text-white hover:bg-coral-700 active:bg-coral-800 focus:ring-coral-500 shadow-sm border border-coral-700/20',
      outline:
        'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300 active:bg-slate-100 focus:ring-brand-400 shadow-subtle',
      ghost:
        'text-slate-600 hover:bg-brand-50 hover:text-brand-700 focus:ring-brand-300',
      danger:
        'bg-coral-600 text-white hover:bg-coral-700 active:bg-coral-800 focus:ring-coral-500 shadow-sm',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-xs gap-1.5',
      md: 'px-4 py-2 text-sm gap-2',
      lg: 'px-5 py-2.5 text-base gap-2.5',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin shrink-0" />
        ) : (
          leftIcon && <span className="shrink-0">{leftIcon}</span>
        )}
        <span>{children}</span>
        {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
