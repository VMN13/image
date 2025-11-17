import React, { useState, useRef, useEffect} from "react";

const LazyImage = ({ src, alt, style, onClick, index = 0}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const imgRef = useRef();


  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          setIsVisible(true);
         
        } else {
          setIsInView(false);
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

  const handleError = () => {
    setHasError(true);
  };


  return (
    <div ref={imgRef}>
      {!isLoaded && !isInView && <div>Loading...</div>}
      {hasError && <div>Error loading image</div>}
      {isInView && (
        <img
          src={src}
          alt={alt}
          style={{...style, display: isLoaded ? 'block' : 'none',
            animationDelay: `${index * 0.1}s`
          }}
          onClick={onClick}
          onLoad={handleLoad}
          className={isVisible ? 'fade-in' : ''}
          onError={handleError}
      
        />
      )}
</div>
  );
};


export default LazyImage;
