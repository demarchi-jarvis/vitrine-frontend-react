import { cn } from '@/lib/utils';
import { forwardRef } from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { Label } from './label';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  success?: boolean;
  required?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, success, required, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <Label htmlFor={inputId} required={required}>
            {label}
          </Label>
        )}
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'field-base',
              error && 'border-red-400 focus:!border-red-500 focus:!ring-red-500/20 pr-10',
              success && !error && 'border-green-400 focus:!border-green-500 focus:!ring-green-500/20 pr-10',
              className,
            )}
            aria-invalid={!!error}
            aria-describedby={
              error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
            }
            {...props}
          />
          {error && (
            <AlertCircle
              className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-500 pointer-events-none"
              strokeWidth={2}
            />
          )}
          {success && !error && (
            <CheckCircle
              className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500 pointer-events-none"
              strokeWidth={2}
            />
          )}
        </div>
        {error && (
          <p
            id={`${inputId}-error`}
            role="alert"
            className="text-red-500 dark:text-red-400 text-xs flex items-center gap-1"
          >
            <AlertCircle className="w-3 h-3" strokeWidth={2} />
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={`${inputId}-hint`} className="text-muted-foreground text-xs">
            {hint}
          </p>
        )}
      </div>
    );
  },
);
Input.displayName = 'Input';
