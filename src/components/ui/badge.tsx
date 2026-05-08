import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full text-[10px] font-semibold uppercase tracking-wide transition-colors',
  {
    variants: {
      variant: {
        default:   'bg-surface text-foreground border border-border',
        primary:   'bg-primary/15 text-primary border border-primary/20',
        secondary: 'bg-wood-900 text-sand-50 dark:bg-sand-50 dark:text-wood-900',
        terracotta:'bg-terracotta-600 text-sand-50',
        ocre:      'bg-ocre-500 text-sand-50',
        outline:   'border border-border text-foreground bg-transparent',
        success:   'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
        warning:   'bg-ocre-300/30 text-ocre-700 dark:bg-ocre-500/20 dark:text-ocre-300',
        danger:    'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
      },
      size: {
        sm: 'px-2 py-0.5 text-[9px]',
        md: 'px-2.5 py-1',
        lg: 'px-3 py-1.5 text-xs',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  },
);

interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ variant, size, className, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant, size }), className)} {...props} />;
}
