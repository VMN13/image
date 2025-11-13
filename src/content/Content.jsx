import React, { useState } from "react";
import images from '../data/images';
import Pagination from "../components/Pagination";
import "../styles/Content.css";

const Content = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentImages = images.slice(startIndex, endIndex);

  const totalPages = Math.ceil(images.length / itemsPerPage);

const handlePageChange = (page) => {  
  console.log('dsdsad');
  if (page >= 1 && page <= totalPages) {
    setCurrentPage(page);
  }
};

  return (
    <div className="Content">
      <h1>Content</h1>
      <div className="Main">
          {currentImages.map((image) => (
        <div className="first_block" key={image.id}>
          <div className="internal_content">
          <img src={image.url} alt={image.alt}  />
          </div>
        </div>
      ))} 
      </div>
      <Pagination  currentPage={currentPage} totalPages={totalPages}  onPageChange={handlePageChange} />
    </div>
  );
};



export default Content;
