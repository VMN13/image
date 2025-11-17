import { useTheme } from "../components/ThemeContext";
import "../styles/Header.css";
const Header = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  return (
    <div className={`Header ${isDarkMode ? "dark" : "light"}`}>
      <div className="header">
        <h1>Image Gallery</h1>
      
        <button className={`Mode ${isDarkMode ? "light" : "dark"}`} onClick={toggleTheme}>
          {isDarkMode ? "Light Mode" : "Dark Mode"}
        </button>
        
      </div>
      
    </div>
  );
};

export default Header;
