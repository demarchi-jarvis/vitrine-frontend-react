'use client';

import { useMemo } from 'react';

export function usePagination(totalPages: number, currentPage: number): (number | null)[] {
  return useMemo(() => {
    const visible = new Set<number>();
    if (totalPages > 0) visible.add(0);
    for (let i = -2; i <= 2; i++) {
      const p = currentPage + i;
      if (p >= 0 && p < totalPages) visible.add(p);
    }
    if (totalPages > 1) visible.add(totalPages - 1);

    const sorted = Array.from(visible).sort((a, b) => a - b);
    const result: (number | null)[] = [];
    let last = -1;
    sorted.forEach((p) => {
      if (p > last + 1) result.push(null);
      result.push(p);
      last = p;
    });
    return result;
  }, [totalPages, currentPage]);
}
