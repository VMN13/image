// CombinedContent.js
import React, { useState, useEffect, useRef } from "react";
import { observer } from "mobx-react-lite";
import galleryStore from "../stores/GalleryStore";
import images from '../data/images';
import Header from "../header/Header";
import Pagination from "../components/Pagination";
import LazyImage from "../components/LazyImage";
import { useTheme } from "../components/ThemeContext";
import ImageModal from "../components/ImagbeModal"; 
import PhotoCounter from "../components/PhotoCounter";
import SearchComponent from "../components/SearchComponent";
import AudioPlayer from "../components/AudioPlayer";
import NightModeButton from "../components/NightModeButton";
import '../styles/ImageZoom.css';
import "../styles/Content.css";
import '../styles/New.css';

const CombinedContent = observer(() => {
  const [modalImage, setModalImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSelectFocused, setIsSelectFocused] = useState(false);
  const selectContainerRef = useRef(null);
  const [nightMode, setNightMode] = useState(false);
  const [showActionButtons, setShowActionButtons] = useState({});
  const [actionTimeouts, setActionTimeouts] = useState({});
  const user = true;
  const { isDarkMode } = useTheme();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isSelectFocused && selectContainerRef.current && !selectContainerRef.current.contains(event.target)) {
        setIsSelectFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSelectFocused]);

  const toggleActionButtons = (id) => {
    const isOpen = showActionButtons[id];
    if (isOpen) {
      setShowActionButtons(prev => ({ ...prev, [id]: false }));
      if (actionTimeouts[id]) {
        clearTimeout(actionTimeouts[id]);
        setActionTimeouts(prev => ({ ...prev, [id]: null }));
      }
    } else {
      setShowActionButtons(prev => ({ ...prev, [id]: true }));
      const timeoutId = setTimeout(() => {
        setShowActionButtons(prev => ({ ...prev, [id]: false }));
        setActionTimeouts(prev => ({ ...prev, [id]: null }));
      }, 5000);
      setActionTimeouts(prev => ({ ...prev, [id]: timeoutId }));
    }
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= galleryStore.totalPages) {
      galleryStore.setCurrentPage(page);
      window.scrollTo({ top: 102, behavior: "smooth" });
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
        await navigator.share({ title: 'Изображение из галереи', text: `Посмотри на изображение "${alt}" в галерее!`, url: url });
      } catch (err) {
      
        alert('Не удалось поделиться. Попробуйте вручную.');
      }
    } else {
      const subject = encodeURIComponent('Изображение из галереи');
      const body = encodeURIComponent(`Посмотри это изображение: ${alt}\n\nСсылка: ${url}`);
      window.open(`mailto:?subject=${subject}&body=${body}`);
    }
  };

  const handleClearFilters = () => {
    galleryStore.setFilterMode('all');
    galleryStore.setSearchTerm('');
    galleryStore.setCurrentSection('all');
  };

  return (
    <>
      <div className={`Margin ${isDarkMode ? 'dark' : 'light'}`}>
        
        <div className={`controls-wrapper ${isDarkMode ? 'dark' : 'light'}`} ref={selectContainerRef}>
          <div className="centered-counter">
            <PhotoCounter />
            
          </div>
          <div className="search-and-filter-container">
            <SearchComponent 
              searchTerm={galleryStore.searchTerm} 
              setSearchTerm={galleryStore.setSearchTerm}  
              images={images} 
              isDarkMode={isDarkMode}
            />

            <div className="search">
              <select  
                className={`section-select ${isDarkMode ? 'dark' : 'light'}`}
                value={galleryStore.currentSection}
                onChange={(e) => galleryStore.setCurrentSection(e.target.value)}
                onFocus={() => setIsSelectFocused(true)}
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
              <button 
                className={`Favorites ${isDarkMode ? 'dark' : 'light'} ${galleryStore.filterMode === 'favorites' ? 'active' : ''}`} 
                onClick={() => galleryStore.setFilterMode(galleryStore.filterMode === 'favorites' ? 'all' : 'favorites')}
              >
                {galleryStore.filterMode === 'favorites' ? 'Показать все' : 'Избранные'}
              </button> 
              <button 
                className={`Dislikes ${isDarkMode ? 'dark' : 'light'} ${galleryStore.filterMode === 'dislikes' ? 'active' : ''}`} 
                onClick={() => galleryStore.setFilterMode(galleryStore.filterMode === 'dislikes' ? 'all' : 'dislikes')}
              >
                {galleryStore.filterMode === 'dislikes' ? 'Показать все' : 'Дизы'}
              </button>
            </div>
          </div>
      

        </div>
        
        <div className={`Content ${isDarkMode ? 'dark' : 'light'}` }>
          
          <Pagination currentPage={galleryStore.currentPage} totalPages={galleryStore.totalPages} onPageChange={handlePageChange} />
          
          <div className={`Main ${isDarkMode ? 'dark' : 'light'}`}>
        <NightModeButton nightMode={nightMode} setNightMode={setNightMode} />
            {galleryStore.filterMode === 'favorites' && (
              <div>
                <div className="d">
                  
                </div>
              
                <h2>Избранные</h2>
                <button onClick={() => galleryStore.clearFavorites()}>Сбросить избранные</button>
              </div>
            )}
            {galleryStore.filterMode === 'dislikes' && (
              <div>
                <h2>Дизлайки</h2>
                <button onClick={() => galleryStore.clearDislikes()}>Сбросить дизлайки</button>
              </div>
            )}
            {galleryStore.currentImages.length > 0 ? (
              galleryStore.currentImages.map((image) => (
                <div className="first_block" key={image.id}>
                  <div className={`internal_content ${galleryStore.zoomLevel === 'zoomed' ? 'zoomed' : ''}`}>
                    <LazyImage 
                      src={image.url} 
                      alt={image.alt}
                      className={galleryStore.zoomLevel === 'zoomed' ? 'zoomed' : ''}
                      onClick={() => openModal(image)} 
                    />
                    <div className="buttons-container">
                      <button className='action-button-expanded' onClick={() => toggleActionButtons(image.id)}>➦
                        {showActionButtons[image.id] && (
                          <div className="action-buttons-expanded">
                            <button className="copy-button" onClick={() => copyImageUrl(image.url)}>Copy!</button>
                            <button className="share-button" onClick={() => shareImageUrl(image.url, image.alt)}>Share!</button>
                          </div>
                        )}
                      </button>
                      <button onClick={() => galleryStore.setZoomLevel('zoomed')} disabled={galleryStore.zoomLevel === 'zoomed'} className="zoom-button zoom-in" title="Увеличить">➕</button>
                      <button onClick={() => galleryStore.setZoomLevel('normal')} disabled={galleryStore.zoomLevel === 'normal'} className="zoom-button zoom-out" title="Уменьшить">➖</button>
                      {galleryStore.filterMode !== 'dislikes' && (
                        <button className="favorite-button" onClick={() => galleryStore.toggleFavorite(image.id)}>{galleryStore.isFavorite(image.id) ? '❤️' : '🤍'}</button>
                      )}
                      {galleryStore.filterMode !== 'favorites' && (
                        <button className="dislike-button" onClick={() => galleryStore.toggleDislike(image.id)}>{galleryStore.isDisliked(image.id) ? 'X' : 'X'}</button>
                      )}
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
          <Pagination currentPage={galleryStore.currentPage} totalPages={galleryStore.totalPages} onPageChange={handlePageChange} />
          <div className="page-info"><p>Страница {galleryStore.currentPage} из {galleryStore.totalPages} (Найдено: {galleryStore.filteredImages.length})</p></div>
          <div className="getSectionTitle">{galleryStore.getSectionTitle()}</div>
        </div>
        <ImageModal isOpen={isModalOpen} onClose={closeModal} image={modalImage} shareImageUrl={shareImageUrl} />
        <AudioPlayer />     
      </div>
      
    </>
  );
});

export default CombinedContent;