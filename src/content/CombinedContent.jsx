import React, { useState, useEffect, useMemo } from "react";
import { observer } from "mobx-react-lite";
import galleryStore from "../stores/GalleryStore";
import images from '../data/images';

import Pagination from "../components/Pagination";
import LazyImage from "../components/LazyImage";
import { useTheme } from "../components/ThemeContext";
import ImageModal from "../components/ImagbeModal";
import ImageZoom from "../components/ImageZoom";
import PhotoCounter from "../components/PhotoCounter";
import SearchComponent from "../components/SearchComponent";
import "../styles/Content.css";
import "../styles/Tablet.css";
import "../styles/Desktop.css";

const CombinedContent = observer(() => {
  
  const [modalImage, setModalImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState('normal'); // Состояние для уровня масштабирования
  const [showActionButtons, setShowActionButtons] = useState({});  // Состояние для отображения кнопок действий
  const [actionTimeouts, setActionTimeouts] = useState({});  // Состояние для таймаутов действий
 
  
  const user = true; // Пользователь авторизован
  const { isDarkMode } = useTheme();  // Получаем тему из контекста





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



const handlePageChange = (page) => {
  if (page >= 1  && galleryStore.totalPages) {
    galleryStore.setCurrentPage(page);
    window.scrollTo({top: 102, behavior: "smooth"})
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
        <SearchComponent 
          searchTerm={galleryStore.searchTerm} 
          setSearchTerm={galleryStore.setSearchTerm}  
          images={images} 
          isDarkMode={isDarkMode}/>
        <div className="search">
        
          <select  
            className={`section-select ${isDarkMode ? 'dark' : 'light'}`}
            value={galleryStore.currentSection}
            onChange={(e) => galleryStore.setCurrentSection(e.target.value)}  
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
          <button
    className={`All ${isDarkMode ? 'dark' : 'light'} ${galleryStore.filterMode === 'all' ? 'active' : ''}`}
    onClick={() => galleryStore.setFilterMode('all')}
  >
    Все
  </button>
          <button className={`Favorites ${isDarkMode ? 'dark' : 'light'} ${galleryStore.filterMode === 'favorites' ? 'active' : ''}`} onClick={() => galleryStore.setFilterMode(galleryStore.filterMode === 'favorites' ? 'all' : 'favorites')}>
            {galleryStore.filterMode === 'favorites' ? 'Показать все' : 'Избранные'}
          </button> 
          <button className={`Dislikes ${isDarkMode ? 'dark' : 'light'} ${galleryStore.filterMode === 'dislikes' ? 'active' : ''}`} onClick={() => galleryStore.setFilterMode(galleryStore.filterMode === 'dislikes' ? 'all' : 'dislikes')}>
            {galleryStore.filterMode === 'dislikes' ?  'Показать все' : 'Дизы'}
          </button>
        </div>
      </div>
      <div className="content">
        <div className="section">
        </div>
        {/* <div className="pagginationOrTitle"> */}
        <Pagination currentPage={galleryStore.currentPage}  onPageChange={handlePageChange} />
       
        {/* </div> */}
        <div className="Main">
          {galleryStore.currentImages.length > 0 ? (
           galleryStore.currentImages.map((image) => (
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
                    <button className="favorite-button" onClick={() => galleryStore.toggleFavorite(image.id)}>
                      {(image.id) ? '❤️' : '🤍'}
                    </button>
                    <button className="dislike-button" onClick={() => galleryStore.toggleDislike(image.id)}>
                      {(image.id) ? '❌' : '❌ '}
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

        {galleryStore.totalPages > 1 && (
          <Pagination currentPage={galleryStore.currentPage} onPageChange={handlePageChange} />
        )}
        <div className="page-info">
          <p>Страница {galleryStore.currentPage} из {galleryStore.totalPages} (Найдено: {galleryStore.filteredImages.length})</p>
        </div>
        <div className="getSectionTitle">
          {galleryStore.getSectionTitle()}
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
});

export default CombinedContent;