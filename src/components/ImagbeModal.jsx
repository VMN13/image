import React, { useEffect } from 'react';
import '../styles/ImageModal.css'; // CSS для модала

const ImageModal = ({ isOpen, onClose, image }) => {
  // Закрытие по ESC и управление blur/скроллом
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden'; // Запрещаем скролл фона
      document.body.classList.add('modal-open'); // Добавляем класс для blur
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto'; // Восстанавливаем скролл
      document.body.classList.remove('modal-open'); // Убираем класс
    };
  }, [isOpen, onClose]);

  if (!isOpen || !image) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <img
          src={image.url}
          alt={image.alt}
          className="modal-image"
        />
        <button className="close-button" onClick={onClose}>×</button>
      </div>
    </div>
  );
};

export default ImageModal;