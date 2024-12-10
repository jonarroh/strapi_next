'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface PaginationProps {
  currentPage: number;
  pageSize: number;
  totalProducts: number;
}

export default function ProductPagination({
  currentPage,
  pageSize,
  totalProducts
}: PaginationProps) {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);
  const totalPages = Math.ceil(totalProducts / pageSize);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setIsNavigating(true);
      router.push(`/?page=${newPage}`, { scroll: false });

      setTimeout(() => setIsNavigating(false), 500);
    }
  };

  return (
    <div className="flex items-center justify-center space-x-4 mt-4">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1 || isNavigating}
        className={`
          px-4 py-2 rounded 
          ${(currentPage === 1 || isNavigating)
            ? 'bg-gray-300 cursor-not-allowed'
            : 'bg-blue-500 text-white hover:bg-blue-600'}
        `}
      >
        {isNavigating ? 'Loading...' : 'Previous'}
      </button>
      <span className="text-lg">
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages || isNavigating}
        className={`
          px-4 py-2 rounded 
          ${(currentPage === totalPages || isNavigating)
            ? 'bg-gray-300 cursor-not-allowed'
            : 'bg-blue-500 text-white hover:bg-blue-600'}
        `}
      >
        {isNavigating ? 'Loading...' : 'Next'}
      </button>
    </div>
  );
}