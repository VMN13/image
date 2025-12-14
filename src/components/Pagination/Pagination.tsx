import React from "react";
import type { FC } from "react";
import { useTheme } from "../ThemeContext";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const { isDarkMode } = useTheme();
  
  const goToPrevious = (): void => {
    onPageChange(currentPage - 1);
  };

  const goToNext = (): void => {
    onPageChange(currentPage + 1);
  };

  const getPageNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 3) {
        pages.push('...');
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push('...');
      }

      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className='Pagination'>
      <button 
        className={`Pagination-button ${isDarkMode ? 'dark' : 'light'}`} 
        onClick={goToPrevious} 
        disabled={currentPage === 1}
      >
        ◀
      </button>
      
      {pageNumbers.map((page, index) => {
        if (page === '...') {
          return (
            <span key={`ellipsis-${index}`} className="Pagination-ellipsis">
              ...
            </span>
          );
        }
        return (
          <button 
            key={page as number}
            className={`Pagination-button ${isDarkMode ? 'dark' : 'light'} ${(page as number) === currentPage ? 'active' : ''}`}
            onClick={() => {
              console.log('Клик на страницу', page);
              onPageChange(page as number);
            }}
            disabled={(page as number) === currentPage}
          >
            {page}
          </button>
        );
      })}

      <button 
        className={`Pagination-button ${isDarkMode ? 'dark' : 'light'}`} 
        onClick={goToNext} 
        disabled={currentPage === totalPages}
      >
        ▶
      </button>
    </div>
  );
};

export default Pagination;