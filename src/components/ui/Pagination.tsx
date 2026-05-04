'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePagination } from '@/hooks/usePagination';

interface PaginationProps {
  currentPage: number; // 0-indexed
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const pages = usePagination(totalPages, currentPage);

  if (totalPages <= 1) return null;

  return (
    <nav className="flex items-center gap-2 justify-center" aria-label="Paginação">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0}
        className={cn(
          'p-2 rounded-xl transition-all duration-300',
          'hover:bg-sand-200 disabled:opacity-40 disabled:cursor-not-allowed',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-600',
        )}
        aria-label="Página anterior"
      >
        <ChevronLeft strokeWidth={1.25} className="w-5 h-5" />
      </button>

      {pages.map((page, i) =>
        page === null ? (
          <span key={`ellipsis-${i}`} className="px-2 text-wood-400 text-sm">
            …
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={cn(
              'w-10 h-10 rounded-xl text-sm font-medium transition-all duration-300',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-600',
              page === currentPage
                ? 'bg-terracotta-600 text-sand-50 shadow-sm'
                : 'hover:bg-sand-200 text-wood-700',
            )}
            aria-current={page === currentPage ? 'page' : undefined}
          >
            {page + 1}
          </button>
        ),
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages - 1}
        className={cn(
          'p-2 rounded-xl transition-all duration-300',
          'hover:bg-sand-200 disabled:opacity-40 disabled:cursor-not-allowed',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-600',
        )}
        aria-label="Próxima página"
      >
        <ChevronRight strokeWidth={1.25} className="w-5 h-5" />
      </button>
    </nav>
  );
}
