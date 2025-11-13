import React from "react";

const Pagination = ({currentPage, totalPages, onPageChange }) => {

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
    <div>
      <button onClick={goToPrevious} disabled={currentPage === 1}>Previous</button>
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

      <button onClick={goToNext} disabled={currentPage === totalPages}>Next</button>
    </div>
  )
}

export default Pagination;
