import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from '@radix-ui/react-slot';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  [
    'inline-flex items-center justify-center gap-2 font-medium',
    'transition-all duration-300 ease-organic',
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    'dark:focus-visible:ring-offset-wood-900',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100',
    'hover:scale-[1.02] active:scale-[0.98]',
  ],
  {
    variants: {
      variant: {
        primary:
          'bg-primary text-primary-foreground hover:bg-primary-hover shadow-sm hover:shadow-md',
        secondary:
          'bg-wood-900 text-sand-50 hover:bg-wood-800 dark:bg-sand-50 dark:text-wood-900 dark:hover:bg-sand-200',
        outline:
          'border-2 border-foreground text-foreground hover:bg-foreground hover:text-background',
        ghost:
          'text-foreground hover:bg-surface hover:text-foreground',
        danger:
          'bg-red-600 text-white hover:bg-red-700 shadow-sm',
        subtle:
          'bg-surface text-foreground hover:bg-surface-elevated border border-border',
      },
      size: {
        xs:  'px-3 py-1.5 text-xs rounded-lg',
        sm:  'px-4 py-2 text-xs rounded-xl',
        md:  'px-6 py-3 text-sm rounded-2xl',
        lg:  'px-8 py-4 text-base rounded-2xl',
        icon:'p-2 rounded-xl',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  asChild?: boolean;
}

export function Button({
  variant,
  size,
  loading = false,
  disabled,
  asChild = false,
  className,
  children,
  ...props
}: ButtonProps) {
  if (asChild) {
    return (
      <Slot className={cn(buttonVariants({ variant, size }), className)} {...props}>
        {children}
      </Slot>
    );
  }

  return (
    <button
      disabled={disabled || loading}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
}

export { buttonVariants };
