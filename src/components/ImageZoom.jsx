import React, {useState} from "react";
import "../styles/ImageZoom.css";

const ImageZoom = ({ onZoomChange }) => {
  const [zomLevel, setZoomLevel] = useState('normal');


  const handleZoomIn = () => {
    setZoomLevel('zoomed');
    onZoomChange('zoomed');
  };



    const handleZoomOut = () => {
      setZoomLevel('normal');
      onZoomChange('normal');
    };


return (
  <div className="image-zoom-controls">
    <button 
      onClick={handleZoomIn}
      disabled={zomLevel === 'zoomed'}
      className="zoom-button zoom-out"
      title="Увеличить блоки изображений"
      >
      ➕
    </button>
    <button 
      onClick={handleZoomOut}
      disabled={zomLevel === 'normal'}
      className="zoom-button zoom-in"
      title="Уменьшить блоки изображений"
      >
      ➖
    </button>
  </div>
)};



export default ImageZoom;

