import React from "react";
import { useTheme } from "./ThemeContext";
  
const Pagination = ({currentPage, totalPages, onPageChange }) => {
const { isDarkMode } = useTheme();
  console.log('Pagination рендерится, currentPage:', currentPage, 'totalPages:', totalPages);

  const goToPrevious = () => {
    console.log('Клик на прерыдущую');
    onPageChange(currentPage - 1);
  }





const goToNext = () => {
  console.log('Клик на следующую');
  onPageChange(currentPage + 1);
}



  return (
    <div className='Pagination'>
      <button className={`Pagination-button ${isDarkMode ? 'dark' : 'light'}`} onClick={goToPrevious} disabled={currentPage === 1}>◀</button>
      
      {Array.from({length: totalPages}, (_, index) => (
        <button key={index + 1}
          onClick={() => {
            console.log('Клик на страницу', index + 1);
            onPageChange(index + 1);
          }}
        >
          {index + 1}
        </button>
      ))}

      <button className={`Pagination-button ${isDarkMode ? 'dark' : 'light'}`} onClick={goToNext} disabled={currentPage === totalPages}>▶</button>
    </div>
  )
}

export default Pagination;
