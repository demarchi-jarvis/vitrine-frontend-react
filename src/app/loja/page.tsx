import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import { LojaContent } from './LojaContent';

export default function LojaPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-terracotta-600" />
        </div>
      }
    >
      <LojaContent />
    </Suspense>
  );
}
