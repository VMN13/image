import React, { useState, useEffect } from "react";
import images from '../data/images';
import Pagination from "../components/Pagination";
import LazyImage from "../components/LazyImage";
import { useTheme } from "../components/ThemeContext";
import ImageModal from "../components/ImagbeModal";
import PhotoCounter from "../components/PhotoCounter";
import "../styles/Content.css";
import CountUp from "react-countup";


const Content = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFavorites, setShowFavorites] = useState(false);
  const [showDislikes, setShowDislikes] = useState(false);
  const [favorites, setFavorites] = useState([]); // Локальное состояние для избранных
  const [dislikes, setDislikes] = useState([]); // Локальное состояние для дизлайков
  const [modalImage, setModalImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const itemsPerPage = 9;
  const user = true; // Проверка на авторизацию
  const { isDarkMode } = useTheme(); // Исправлено на useTheme
  // Загрузка избранных из localStorage
  useEffect(() => {
    try {
    const savedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const savedDislikes = JSON.parse(localStorage.getItem('dislikes')) || [];
    setFavorites(savedFavorites);
    setDislikes(savedDislikes);
    
    } catch (error) {
      console.error('Error parsing favorites from localStorage:', error);
    }
  }, []);


 

  // Функция для добавления/удаления из избранных
  const toggleFavorite = (id) => {
    const newFavorites = favorites.includes(id)
      ? favorites.filter(favId => favId !== id)
      : [...favorites, id];
    setFavorites(newFavorites);
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
  };


  const toggleDislike = (id) => {
    const newDislikes = dislikes.includes(id)
      ? dislikes.filter(dislikeId => dislikeId !== id)
      : [...dislikes, id];
      setDislikes(newDislikes);
      localStorage.setItem('dislikes', JSON.stringify(newDislikes));
  };


  // Функция для проверки, является ли изображение избранным
  const isFavorite = (id) => favorites.includes(id);

  // Функция для получения только избранных изображений
  const getFavoriteImages = (images) => images.filter(image => favorites.includes(image.id));
  const isDisliked = (id) => dislikes.includes(id);
  

  // Фильтрация изображений
  let filteredImages = images.filter(image =>
    image.alt.toLowerCase().includes(searchTerm.toLowerCase())
    
  );

if (!showDislikes) {
    filteredImages = filteredImages.filter(image => !dislikes.includes(image.id));
}

if  (showDislikes) {
    filteredImages = filteredImages.filter(image => dislikes.includes(image.id));

}


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


  const openModal = (image) => {
    setModalImage(image);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setModalImage(null);
    setIsModalOpen(false);
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
         <PhotoCounter />
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
        <button className="Dislike" onClick={() => setShowDislikes(!showDislikes)}>
          {showDislikes ? 'Убрать дизлайки' : 'Показать дизлайки'}
        </button>

        <div className="Main">
          {currentImages.length > 0 ? (
            currentImages.map((image) => (
              
              <div className="first_block" key={image.id}>
                
                <div className="internal_content">
                  
                  <LazyImage src={image.url} alt={image.alt}
                    onClick={() => openModal(image)}
                  />

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
                    <button className="dislike-button"
                      onClick={() => toggleDislike(image.id)}
                    >
                      {isDisliked(image.id) ? '👎' : '👎'}
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
          <Pagination currentPage={currentPage}  onPageChange={handlePageChange} />
        )}

        <p>Страница {currentPage} из {totalPages} (Найдено: {filteredImages.length})</p>
      </div>
      <ImageModal
        isOpen={isModalOpen}
        onClose={closeModal}
        openModal={openModal}
        image={modalImage}
      />
    </div>
  );
};

export default Content;