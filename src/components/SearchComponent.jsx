import React, {useRef } from "react";
import CombinedContent from "../content/CombinedContent";



const SearchComponent = ({
  searchTerm,
  setSearchTerm, 
  images,
  isDarkMode
}) => {
  const inputRef = useRef(null);


const getSuggestion = (value) => {
    if (!value || !Array.isArray(images)) return '';
    const lowerValue = value.toLowerCase();
    const matchingSuggestion = images
      .map(img => img.alt.toLowerCase())
      .find(alt => alt.startsWith(lowerValue) && alt !== lowerValue);
    return matchingSuggestion ? matchingSuggestion.slice(value.length) : '';
  };


const handleChange = (e) => {
  setSearchTerm(e.target.value);
} // фукция для обработки изменения в поле поиска


const handleKeyDown = (e) => {
  const suggestion = getSuggestion(searchTerm);
  if ((e.key === 'Tab' || e.key === 'Enter') && suggestion) {
    e.preventDefault();
    setSearchTerm(searchTerm + suggestion);
  }
};

const suggestion = getSuggestion(searchTerm);
const placeholder = suggestion ?  searchTerm + suggestion : "Поиск по описанию...";

  return (
    <div className="search">
      <div className="search-input-container">
        <input ref={inputRef}
          type='text'
          placeholder={placeholder}
          value={searchTerm}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className={`search-input ${isDarkMode ? "dark" : "light"}`
          }
        />
        {suggestion && (
          <span className="search-suggestion">
            {searchTerm}{suggestion}
          </span>
          )}
      </div>
    </div>
  );
};

export default SearchComponent;