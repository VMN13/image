import React, { useState, useEffect } from "react";
import images from '../data/images';
import Pagination from "../components/Pagination";
import LazyImage from "../components/LazyImage";
import { useTheme } from "../components/ThemeContext";
import "../styles/Content.css";

const Content = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFavorites, setShowFavorites] = useState(false);
  const [favorites, setFavorites] = useState([]); // Локальное состояние для избранных
  const itemsPerPage = 9;
  const user = true; // Проверка на авторизацию
  const { isDarkMode } = useTheme(); // Исправлено на useTheme
  // Загрузка избранных из localStorage
  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
    setFavorites(savedFavorites);
  }, []);

  // Функция для добавления/удаления из избранных
  const toggleFavorite = (id) => {
    const newFavorites = favorites.includes(id)
      ? favorites.filter(favId => favId !== id)
      : [...favorites, id];
    setFavorites(newFavorites);
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
  };

  // Функция для проверки, является ли изображение избранным
  const isFavorite = (id) => favorites.includes(id);

  // Функция для получения только избранных изображений
  const getFavoriteImages = (images) => images.filter(image => favorites.includes(image.id));

  // Отладка: проверьте консоль
  console.log('favorites:', favorites); // Должен быть массив
  console.log('isFavorite function:', isFavorite); // Должна быть функция

  // Фильтрация изображений
  let filteredImages = images.filter(image =>
    image.alt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Если показываем только избранные, дополнительная фильтрация
  if (showFavorites) {
    filteredImages = getFavoriteImages(filteredImages);
  }

  // Пагинация
  const totalPages = Math.ceil(filteredImages.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentImages = filteredImages.slice(startIndex, endIndex);

  // Сброс страницы при новом поиске или переключении режима
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, showFavorites]);

  const handlePageChange = (page) => {
    console.log('dsdsad');
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (!user) return <p>Пожалуйста, войдите в систему.</p>;

  // Функция копирования URL изображения в буфер обмена
  const copyImageUrl = async (url) => {
    try {
      await navigator.clipboard.writeText(url);
      alert('URL изображения скопирован в буфер обмена!');
    } catch (err) {
      console.error('Ошибка копирования:', err);
      alert('Не удалось скопировать. Попробуйте вручную скопировать URL.');
    }
  };



const shareImageUrl = async (url, alt) => {
  if (navigator.share) {
    try {
      await navigator.share({
        title: 'Изображение из галереи',
        text: `Посмотри на изображение "${alt}" в галерее!`,
        url: url,
      });
    }  catch (err) {
      console.log('Ошибка шаринга: ', err);
      alert('Не удалось поделиться. Попробуйте вручную.');
    }
  
} else {
 const subject = encodeURIComponent('Изображение из галереи');
      const body = encodeURIComponent(`Посмотри это изображение: ${alt}\n\nСсылка: ${url}`);
      window.open(`mailto:?subject=${subject}&body=${body}`);
}
  };



  return (
    <div className={`Content ${isDarkMode ? 'dark' : 'light'}`}>
      <div className="content">
        {/* Инпут для поиска */}
        <input
          type="text"
          placeholder="Поиск по описанию (например, 'белый мрамор')..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* Кнопка для переключения режима просмотра */}
        <button className="Favorite"
          onClick={() => setShowFavorites(!showFavorites)}
        >
          {showFavorites ? 'Показать все' : 'Показать избранные'}
        </button>

        <div className="Main">
          {currentImages.length > 0 ? (
            currentImages.map((image) => (
              
              <div className="first_block" key={image.id}>
                
                <div className="internal_content">
                  
                  <LazyImage src={image.url} alt={image.alt} />

                  <div className="buttons-container">
                    <button
                      className="copy-button"
                      onClick={() => copyImageUrl(image.url)}
                    >
                      Copy
                    </button>
                    <button
                      className="favorite-button"
                      onClick={() => toggleFavorite(image.id)}
                    >
                      {isFavorite(image.id) ? '❤️' : '🤍'}
                    </button>
                   
  <button
                      className="share-button"
                      onClick={() => shareImageUrl(image.url, image.alt)}
                    >
                      Share
                    </button>
                    
                  </div>
                  
                </div>
                
              </div>
              
            ))
          ) : (
            <div className="NotFound">
              <p>Изображения не найдены. Попробуйте другой запрос.</p>
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        )}

        <p>Страница {currentPage} из {totalPages} (Найдено: {filteredImages.length})</p>
      </div>
    </div>
  );
};

export default Content;