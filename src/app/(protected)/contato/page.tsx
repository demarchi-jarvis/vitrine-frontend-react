import { Suspense } from 'react';
import { ContatoContent } from './ContatoContent';
import { Loader2 } from 'lucide-react';

export default function ContatoPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen pt-32 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-terracotta-600" />
        </div>
      }
    >
      <ContatoContent />
    </Suspense>
  );
}
