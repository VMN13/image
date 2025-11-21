import { useTheme } from "../components/ThemeContext";
import { useEffect, useState } from "react";
import PhotoCounter  from "../components/PhotoCounter";
import images from '../data/images'; 
import "../styles/Header.css";
const Header = () => {
  const { isDarkMode, toggleTheme } = useTheme();
 
  
    // Загрузка избранных из localStorage
    


  
  return (
    <div className={`Header ${isDarkMode ? "dark" : "light"}`}>
      <div className="header">
        <h1>Image Gallery</h1>
          <button className={`Mode ${isDarkMode ? "light" : "dark"}`} onClick={toggleTheme}>
          {isDarkMode ? "Light Mode" : "Dark Mode"}
        </button>              <div className="section">
          </div>
        </div>
    </div>
  );
};

export default Header;
