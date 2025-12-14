import React from "react";
import type { FC } from "react";
import { observer } from "mobx-react-lite"; // Добавлен observer
import galleryStore from "../../stores/GalleryStore";
import "../styles/ImageZoom.css";

const ImageZoom: FC = observer(() => { // Обернул в observer
  const handleZoomIn = (): void => {
    galleryStore.setZoomLevel('zoomed');
  };

  const handleZoomOut = (): void => {
    galleryStore.setZoomLevel('normal');
  };

  return (
    <div className="image-zoom-controls">
      <button 
        onClick={handleZoomIn}
        disabled={galleryStore.zoomLevel === 'zoomed'}
        className="zoom-button zoom-in" // Исправил класс (было zoom-out, теперь zoom-in для увеличения)
        title="Увеличить блоки изображений"
      >
        ➕
      </button>
      <button 
        onClick={handleZoomOut}
        disabled={galleryStore.zoomLevel === 'normal'}
        className="zoom-button zoom-out" // Исправил класс (было zoom-in, теперь zoom-out для уменьшения)
        title="Уменьшить блоки изображений"
      >
        ➖
      </button>
    </div>
  );
});

export default ImageZoom;