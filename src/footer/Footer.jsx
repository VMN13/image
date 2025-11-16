import React from "react";
import { useTheme } from "../components/ThemeContext";
import '../styles/Footer.css';
const Footer = () => {
  const {isDarkMode} = useTheme();
  return (
    <div className={isDarkMode ? 'dark' : 'light'}>
    <div className="Footer">
      <div className="footer">
      <h1>Footer</h1>
      </div>
    </div>
    </div>
  );
}

export default Footer
