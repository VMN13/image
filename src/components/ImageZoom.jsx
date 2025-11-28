import React from "react";
import galleryStore from "../stores/GalleryStore";
import "../styles/ImageZoom.css";

const ImageZoom = () => {

  const handleZoomIn = () => {
    galleryStore.setZoomLevel('zoomed');
  };



    const handleZoomOut = () => {
      galleryStore.setZoomLevel('normal');
    };


return (
  <div className="image-zoom-controls">
    <button 
      onClick={handleZoomIn}
      disabled={galleryStore.zoomLevel === 'zoomed'}
      className="zoom-button zoom-out"
      title="Увеличить блоки изображений"
      >
      ➕
    </button>
    <button 
      onClick={handleZoomOut}
      disabled={galleryStore.zoomLevel === 'normal'}
      className="zoom-button zoom-in"
      title="Уменьшить блоки изображений"
      >
      ➖
    </button>
  </div>
)};

export default ImageZoom;

