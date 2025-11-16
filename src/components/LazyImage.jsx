import React, { useState, useRef, useEffect} from "react";

const LazyImage = ({ src, alt }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);

  const imgRef = useRef();


  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect(); // Останавливаем наблюдение после загрузки
        }
      },
      { threshold: 0.1 } // Загружаем, когда 10% изображения в viewport
    );
    if (imgRef.current) {
      observer.observe(imgRef.current);
    }
    return () => observer.disconnect();
  }, []);
  const handleLoad = () => {
    setIsLoaded(true);
  };


  return (
    <div ref={imgRef}>
      {!isLoaded && !isInView && <div>Loading...</div>}
      {hasError && <div>Error loading image</div>}
      {isInView && (
        <img
          src={src}
          alt={alt}
          onLoad={handleLoad}
          style={{display: isLoaded ? 'block' : 'none'}}
        />
      )}
</div>
  );
};


export default LazyImage;
