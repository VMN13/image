import React, { FC, useEffect } from 'react';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  onClick?: () => void;
  webpSrc?: string;
}

const LazyImage: FC<LazyImageProps> = ({src, alt, className, onClick, webpSrc}) => {
  useEffect(() => {
    if (webpSrc) {
      const img = new Image();
      img.src = webpSrc;
    }
  } , [webpSrc]);

  return (
    <picture>
      {webpSrc && <source type="image/webp" srcSet={webpSrc} />}
      <img src={src} 
      alt={alt} 
      className={className} 
      onClick={onClick}
      loading='lazy'
      decoding='async'
      />

    </picture>
  )
}


export default LazyImage;