import React from'react';
import { useTheme } from './ThemeContext';
import '../styles/ImageModal.css';


const ImageModal = ({ isOpen, onClose, image }) => {
  const {isDarkMode} = useTheme();




  if (!isOpen || !image) return null;
  return (
    <div className={`modal ${isDarkMode ? 'dark' : 'light'}`}>
      <div className='modal-content' onClick={(e) => e.stopPropagation()}>
        <img src={image.url} alt={image.alt} className='modal-image' />
        <button className='close-button' onClick={onClose}>sdasdasx</button>
      </div>
    </div>
  );
};

export default ImageModal;
