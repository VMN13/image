import React from "react";
import { useTheme } from "../components/ThemeContext";
import '../styles/Footer.css';
const Footer = () => {
  const {isDarkMode} = useTheme();
  return (
    <div className={`Footer ${isDarkMode ? "dark" : "light"}`}>
    <div className="Footer">
      <div className="footer">
      <h1>  Image Gallery All rights reserved <br/> 2025 ©︎ </h1>
      </div>
    </div>
    </div>
  );
}

export default Footer
