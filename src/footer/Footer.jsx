import React from "react";
import { useTheme } from "../components/ThemeContext";
import '../styles/Footer.css';
const Footer = () => {
  const {isDarkMode} = useTheme();
  return (
    <div className={`Footer ${isDarkMode ? "dark" : "light"}`}>
    <div className="Footer">
      <div className="footer">
      <h1>2025 ©︎<br/> Image Gallery<br/> All rights reserved</h1>
      </div>
    </div>
    </div>
  );
}

export default Footer
