import { useState, useEffect } from 'react';

const useFavorites = () => {
  const [favorites, setFavorites] = useState([]);

  // Загрузка избранных из localStorage при монтировании
  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
    setFavorites(savedFavorites);
  }, []);

  // Функция для добавления/удаления из избранных
  const toggleFavorite = (id) => {
    const newFavorites = favorites.includes(id)
      ? favorites.filter(favId => favId !== id)
      : [...favorites, id];
    setFavorites(newFavorites);
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
  };

  // Функция для проверки, является ли изображение избранным
  const isFavorite = (id) => favorites.includes(id);

  // Функция для получения только избранных изображений
  const getFavoriteImages = (images) => images.filter(image => favorites.includes(image.id));

  return {
    favorites,
    toggleFavorite,
    isFavorite,
    getFavoriteImages,
  };
};

export default useFavorites;