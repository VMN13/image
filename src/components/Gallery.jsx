import React from "react";
import images from '../data/images';
import UseFavorites from "./UseFavorites";
import UseDislikes from "./UseDislikes";


const Gallery = () => {
  const { toggleFavorite, isFavorite} = UseFavorites();
  const {toggleDislike, isDisliked} = UseDislikes();


  return (
    <div className="gallery">
      {images.map((image) => (
        <div key={image.id} className="image-container">
          <img src={image.url} alt={image.alt} className="image" />
          <div className="overlay">
            <button className="favorite-button" onClick={() => toggleFavorite(image.id)}>
              {isFavorite(image.id) ? '❤️' : '🤍'}
            </button>
            <button className="dislike-button" onClick={() => toggleDislike(image.id)}>
              {isDisliked(image.id) ? '👎' : '👍'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );

}

export default Gallery;