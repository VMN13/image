import React from "react";
import { useTheme } from "./ThemeContext";
import '../data/images';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const { isDarkMode } = useTheme();
  console.log('Pagination рендерится, currentPage:', currentPage, 'totalPages:', totalPages);

  const goToPrevious = () => {
    console.log('Клик на предыдущую');
    onPageChange(currentPage - 1);
  };

  const goToNext = () => {
    console.log('Клик на следующую');
    onPageChange(currentPage + 1);
  };

  // Функция для генерации массива страниц с эллипсисами
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5; // Максимум видимых кнопок страниц (не считая prev/next). Можно настроить под мобильные (например, 3).

    if (totalPages <= maxVisible) {
      // Если страниц мало, показываем все
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Логика с эллипсисами
      pages.push(1); // Первая страница всегда

      if (currentPage > 3) {
        pages.push('...'); // Эллипсис перед текущей группой
      }

      // Диапазон вокруг текущей страницы
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push('...'); // Эллипсис после текущей группы
      }

      pages.push(totalPages); // Последняя страница всегда
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
            key={page}
            className={`Pagination-button ${isDarkMode ? 'dark' : 'light'} ${page === currentPage ? 'active' : ''}`}
            onClick={() => {
              console.log('Клик на страницу', page);
              onPageChange(page);
            }}
            disabled={page === currentPage}
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