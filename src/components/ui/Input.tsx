import { cn } from '@/lib/utils';
import { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s/g, '-');
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-wood-800">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full px-4 py-3 rounded-xl text-sm text-wood-900 placeholder:text-wood-400',
            'bg-sand-100 border border-sand-200',
            'focus:outline-none focus:border-terracotta-600 focus:ring-2 focus:ring-terracotta-600/20',
            'transition-all duration-300',
            error && 'border-red-400 focus:border-red-500 focus:ring-red-500/20',
            className,
          )}
          {...props}
        />
        {error && <p className="text-red-600 text-xs">{error}</p>}
        {hint && !error && <p className="text-wood-400 text-xs">{hint}</p>}
      </div>
    );
  },
);
Input.displayName = 'Input';
