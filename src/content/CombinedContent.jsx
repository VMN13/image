import React, { useState, useEffect } from "react";
import images from '../data/images'; 
import Pagination from "../components/Pagination";
import LazyImage from "../components/LazyImage";
import { useTheme } from "../components/ThemeContext";
import ImageModal from "../components/ImagbeModal";
import ImageZoom from "../components/ImageZoom";
import PhotoCounter from "../components/PhotoCounter";
import SearchComponent from "../components/SearchComponent";
import "../styles/Content.css";
import CountUp from "react-countup";



const CombinedContent = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');  // Состояние для поиска
  const [showFavorites, setShowFavorites] = useState(false);  // Состояние для отображения избранных
  const [showDislikes, setShowDislikes] = useState(false);  // Состояние для отображения отложенных
  const [favorites, setFavorites] = useState([]); // Состояние для избранных
  const [dislikes, setDislikes] = useState([]);  // Состояние для отложенных
  const [modalImage, setModalImage] = useState(null); // Состояние для модального окна
  const [isModalOpen, setIsModalOpen] = useState(false);  // Состояние для модального окна
  const [currentSection, setCurrentSection] = useState('all');  // Состояние для раздела
  const [zoomLevel, setZoomLevel] = useState('normal'); // Состояние для уровня масштабирования
  const [showActionButtons, setShowActionButtons] = useState({});  // Состояние для отображения кнопок действий
  const [actionTimeouts, setActionTimeouts] = useState({});  // Состояние для таймаутов действий
  const itemsPerPage = 9;  // Количество элементов на странице

  const user = true; // Пользователь авторизован
  const { isDarkMode } = useTheme();  // Получаем тему из контекста


useEffect(() => {
  console.log(`CombinedContent: searchTerm changed to:`, searchTerm);

}, [searchTerm]);




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

  // Функция для добавления/удаления из отложенных
  const toggleDislike = (id) => {
    const newDislikes = dislikes.includes(id)
      ? dislikes.filter(dislikeId => dislikeId !== id)
      : [...dislikes, id];
    setDislikes(newDislikes);
    localStorage.setItem('dislikes', JSON.stringify(newDislikes));
  };

  const toggleActionButtons = (id) => {
    const isOpen = showActionButtons[id];
    if (isOpen) {
      // Если открыто, закрываем и очищаем таймаут
      setShowActionButtons(prev => ({ ...prev, [id]: false }));
      if (actionTimeouts[id]) {
        clearTimeout(actionTimeouts[id]);
        setActionTimeouts(prev => ({ ...prev, [id]: null }));
      }
    } else {
      // Если закрыто, открываем и устанавливаем таймаут на 5 секунд
      setShowActionButtons(prev => ({ ...prev, [id]: true }));
      const timeoutId = setTimeout(() => {
        setShowActionButtons(prev => ({ ...prev, [id]: false }));
        setActionTimeouts(prev => ({ ...prev, [id]: null }));
      }, 5000); // 5 секунд
      setActionTimeouts(prev => ({ ...prev, [id]: timeoutId }));
    }
  };
  // Функция для проверки, является ли изображение избранным
  const isFavorite = (id) => favorites.includes(id);
  const isDisliked = (id) => dislikes.includes(id);

  // Функция для получения только избранных изображений
  const getFavoriteImages = (images) => images.filter(image => favorites.includes(image.id));

  // Фильтрация изображений (исправленный порядок)
  let filteredImages = images;
  console.log('Initial images count:', images.length);

  // 1. Фильтрация по разделу
  if (currentSection !== 'all') {
    filteredImages = filteredImages.filter(image => image.category === currentSection);
    console.log(`After section filter (${currentSection}):`, filteredImages.length);
    console.log('Sample after section:', filteredImages[0]);
  }

  // 2. Фильтрация по поиску (по описанию alt)
  if (searchTerm) {
    filteredImages = filteredImages.filter(image =>
      image.alt.toLowerCase().includes(searchTerm.toLowerCase())
    );
    console.log('After search filter:', filteredImages.length);
  }

  // 3. Фильтрация по dislikes
  if (!showDislikes) {
    filteredImages = filteredImages.filter(image => !dislikes.includes(image.id));
  }
  if (showDislikes) {
    filteredImages = filteredImages.filter(image => dislikes.includes(image.id));
  }
  console.log('After dislikes filter:', filteredImages.length);

  // 4. Фильтрация по избранным
  if (showFavorites) {
    filteredImages = getFavoriteImages(filteredImages);
    
  }


  // Пагинация
  const totalPages = Math.ceil(filteredImages.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentImages = filteredImages.slice(startIndex, endIndex);

  // Сброс страницы при новом поиске, переключении режима или раздела
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, showFavorites, showDislikes, currentSection]);

  // Обработчик изменения страницы
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 102, behavior: 'smooth' });
    }
  };


  // Функция для открытия модального окна
  const openModal = (image) => {
    setModalImage(image);
    setIsModalOpen(true);
  };

  // Функция для закрытия модального окна
  const closeModal = () => {
    setModalImage(null);
    setIsModalOpen(false);
  };

  // Обработчик изменения раздела
  const handleSectionChange = (section) => {
    setCurrentSection(section);
    setCurrentPage(1); // Сброс страницы
  };

  // Функция для получения заголовка раздела
  const getSectionTitle = () => {
    switch (currentSection) {
      case 'nature': return 'Природа';
      case 'cities': return 'Города';
      case 'animals': return 'Животные';
      case 'tech': return 'Технологии';
      case 'food': return 'Еда';
      default: return 'Все разделы';
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

  // Функция шаринга URL изображения
  const shareImageUrl = async (url, alt) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Изображение из галереи',
          text: `Посмотри на изображение "${alt}" в галерее!`,
          url: url,
        });
      } catch (err) {
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
    <>
    
    <div className={`Content ${isDarkMode ? 'dark' : 'light'}`}>
      <div className="controls-wrapper">
        <PhotoCounter /> 
        <SearchComponent // компонент поиска
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm}  
          images={images} 
          isDarkMode={isDarkMode}/>
        <div className="search">
        
          <select  
            className={`section-select ${isDarkMode ? 'dark' : 'light'}`}
            value={currentSection}
            onChange={(e) => handleSectionChange(e.target.value)}  
          >
            <option value="all">Все разделы</option>
            <option value="nature">Природа</option>
            <option value="cities">Города</option>
            <option value="animals">Животные</option>
            <option value="tech">Технологии</option>
            <option value="food">Еда</option>
          </select>
        </div>
        <div className="buttons-favorites">  
          <button className={`Favorites ${isDarkMode ? 'dark' : 'light'}`} onClick={() => setShowFavorites(!showFavorites)}>
            {showFavorites ? 'Показать все' : 'Избранные'}
          </button> 
          <button className={`Dislikes ${isDarkMode ? 'dark' : 'light'}`} onClick={() => setShowDislikes(!showDislikes)}>
            {showDislikes ? 'Показать все' : 'Дизы'}
          </button>
        </div>
      </div>
      <div className="content">
        <div className="section">
        </div>
        <Pagination currentPage={currentPage}  onPageChange={handlePageChange} />
        <div className="Main">
          {currentImages.length > 0 ? (
            currentImages.map((image) => (
              <div className="first_block" key={image.id}>
                <div className={`internal_content ${zoomLevel === 'zoomed' ? 'zoomed' : ''}`}>
                  <LazyImage src={image.url} alt={image.alt}
                    className={zoomLevel === 'zoomed' ? 'zoomed' : ''}  // fade-in добавится в LazyImage
                    onClick={() => openModal(image)} />
                    
                  <div className="buttons-container">
                    <button className='action-button-expanded' onClick={() => toggleActionButtons(image.id)}>➦
                      {showActionButtons[image.id] && (
                        <div className="action-buttons-expanded">
                          <button className="copy-button" onClick={() => copyImageUrl(image.url)}>
                      Copy!
                    </button>
                      <button className="share-button" onClick={() => shareImageUrl(image.url, image.alt)}>
                      Share!
                    </button>
                        </div>
                      )}
                    </button>
                  
                    <ImageZoom onZoomChange={setZoomLevel} />
                    <button className="favorite-button" onClick={() => toggleFavorite(image.id)}>
                      {isFavorite(image.id) ? '❤️' : '🤍'}
                    </button>
                    <button className="dislike-button" onClick={() => toggleDislike(image.id)}>
                      {isDisliked(image.id) ? '❌' : '❌ '}
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
          <Pagination currentPage={currentPage} onPageChange={handlePageChange} />
        )}
        <div className="page-info">
          <p>Страница {currentPage} из {totalPages} (Найдено: {filteredImages.length})</p>
        </div>
      </div>
      <ImageModal
        isOpen={isModalOpen}
        onClose={closeModal}
        openModal={openModal}
        image={modalImage}
        shareImageUrl={shareImageUrl}
      />
    </div>
    </>
  );
};

export default CombinedContent;