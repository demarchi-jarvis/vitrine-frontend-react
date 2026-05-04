import { Suspense } from 'react';
import { BazarContent } from './BazarContent';
import { ProdutoCardSkeleton } from '@/components/ui/Skeleton';

export default function BazarPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen pt-32 pb-20 container mx-auto px-4 sm:px-6">
          <div className="skeleton h-12 w-48 rounded-2xl mb-4" />
          <div className="skeleton h-10 w-full max-w-md rounded-2xl mb-8" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <ProdutoCardSkeleton key={i} />
            ))}
          </div>
        </div>
      }
    >
      <BazarContent />
    </Suspense>
  );
}
