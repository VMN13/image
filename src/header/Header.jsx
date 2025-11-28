import { useTheme } from "../components/ThemeContext";
import galleryStore from "../stores/GalleryStore";
import "../styles/Header.css";
import '../styles/HeaderTablet.css';
import '../styles/HeaderDesktop.css';


const Header = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  const handleShowAllPhotos = () => {
    console.log("Клик по Header сработал! Сбрасываю фильтры...");
    // Используем ФУНКЦИИ (set...) для изменения состояния в store
    galleryStore.setSearchTerm('');
    galleryStore.setCurrentSection('all');
    galleryStore.setFilterMode('all');
    galleryStore.setCurrentPage(1);
    console.log("Фильтры сброшены.");
  };

  const handleThemeToggle = (event) => {
    // Останавливаем всплытие, чтобы клик на кнопку не вызывал handleShowAllPhotos
    event.stopPropagation();
    toggleTheme();
  };
 
  return (
    // Вешаем обработчик клика на весь Header
    <div 
      className={`Header ${isDarkMode ? "dark" : "light"}`} 
      onClick={handleShowAllPhotos}
      style={{ cursor: 'pointer' }} // Добавим курсор-руку для наглядности
    >
      <div className={`header ${isDarkMode ? "dark" : "light"}`}>
        <h1 className="h1">Image Gallery</h1>
        {/* Вешаем отдельный обработчик на кнопку, чтобы предотвратить всплытие */}
        <button className={`Mode ${isDarkMode ? "light" : "dark"}`} onClick={handleThemeToggle}>
          {isDarkMode ? "Light Mode" : "Dark Mode"}
        </button>              
        <div className="section"></div>
      </div>
    </div>
  );
};

export default Header;