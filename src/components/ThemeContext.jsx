/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useContext, useEffect } from'react';
const ThemeContext = createContext();
export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(true);
useEffect(() => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme !== null) {
    setIsDarkMode(savedTheme === 'dark');
  } else {
    setIsDarkMode(true);
    localStorage.setItem('theme', 'dark');
  }
}, []);

const toggleTheme = () => {
  const newTheme = !isDarkMode;
  setIsDarkMode(newTheme);
  localStorage.setItem('theme', newTheme ? 'dark' : 'light');
}

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      <div className={isDarkMode ? 'dark' : 'light'}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);