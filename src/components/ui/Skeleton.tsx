import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  rounded?: 'sm' | 'md' | 'lg' | 'full' | '2xl' | '3xl';
}

export function Skeleton({ className, rounded = '2xl' }: SkeletonProps) {
  return (
    <div
      className={cn('skeleton', `rounded-${rounded}`, className)}
      aria-hidden="true"
    />
  );
}

export function ProdutoCardSkeleton() {
  return (
    <div className="rounded-3xl overflow-hidden bg-surface border border-border">
      <Skeleton className="aspect-[4/5] w-full" rounded="3xl" />
      <div className="p-4 space-y-2.5">
        <Skeleton className="h-3 w-1/3" rounded="full" />
        <Skeleton className="h-5 w-3/4" rounded="lg" />
        <div className="flex items-center justify-between pt-1">
          <Skeleton className="h-4 w-1/4" rounded="full" />
          <Skeleton className="h-8 w-8 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export function BentoGridSkeleton() {
  return (
    <div className="grid grid-cols-12 gap-4 auto-rows-[280px]">
      <Skeleton className="col-span-12 md:col-span-7 row-span-2" rounded="3xl" />
      <Skeleton className="col-span-12 md:col-span-5" rounded="3xl" />
      <Skeleton className="col-span-12 md:col-span-5" rounded="3xl" />
      <Skeleton className="col-span-12 md:col-span-4" rounded="3xl" />
      <Skeleton className="col-span-12 md:col-span-4" rounded="3xl" />
      <Skeleton className="col-span-12 md:col-span-4" rounded="3xl" />
    </div>
  );
}
