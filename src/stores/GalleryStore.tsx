// GalleryStore.ts
import { makeObservable, observable, action, computed } from 'mobx';
import images from '../data/images';  // Убедитесь, что путь правильный

// Интерфейс для изображения (добавьте поля по необходимости)
interface Image {
  id: string;  // Или number, если ID числовой
  alt: string;
  category: string;
  // url?: string;  // Добавьте, если есть
}

// Типы для фильтров и секций
type FilterMode = 'all' | 'favorites' | 'dislikes';
type Section = 'all' | 'nature' | 'cities' | 'animals' | 'tech' | 'food';
type ZoomLevel = 'normal' | 'zoom1' | 'zoom2';  // Пример, настройте по необходимости

class GalleryStore {
  // Observable свойства с типами
  favorites: string[] = [];
  dislikes: string[] = [];
  filterMode: FilterMode = 'all';
  currentSection: Section = 'all';
  searchTerm: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 9;
  zoomLevels: Record<string, ZoomLevel> = {};  // Ключ: id изображения, значение: уровень зума

  constructor() {
    makeObservable(this, {
      favorites: observable,
      dislikes: observable,
      filterMode: observable,
      currentSection: observable,
      searchTerm: observable,
      currentPage: observable,
      itemsPerPage: observable,
      zoomLevels: observable,
      filteredImages: computed,
      totalPages: computed,
      currentImages: computed,
      setFilterMode: action,
      toggleFavorite: action,
      toggleDislike: action,
      setCurrentSection: action,
      setSearchTerm: action,
      setCurrentPage: action,
      loadFromLocalStorage: action,
      saveToLocalStorage: action,
      setZoomLevel: action,
      setZoomLevelForImage: action,
      clearFavorites: action,
      clearDislikes: action,
    });

    this.loadFromLocalStorage();
  }

  // Методы с типами
  setZoomLevelForImage = (id: string, level: ZoomLevel): void => {
    this.zoomLevels = { ...this.zoomLevels, [id]: level };
  };

  getZoomLevelForImage = (id: string): ZoomLevel => {
    return this.zoomLevels[id] || 'normal';
  };

  loadFromLocalStorage = (): void => {
    try {
      const favoritesData = localStorage.getItem('favorites');
      const dislikesData = localStorage.getItem('dislikes');
      this.favorites = favoritesData ? JSON.parse(favoritesData) : [];
      this.dislikes = dislikesData ? JSON.parse(dislikesData) : [];
    } catch (error) {
      console.error('Error parsing from localStorage:', error);
    }
  };

  saveToLocalStorage = (): void => {
    localStorage.setItem('favorites', JSON.stringify(this.favorites));
    localStorage.setItem('dislikes', JSON.stringify(this.dislikes));
  };

  clearFavorites = (): void => {
    if (confirm('Вы уверены, что хотите очистить избранное?')) {
      this.favorites = [];
      this.saveToLocalStorage();
    } else {
      console.log('Избранное не очищено.');
    }
  };

  clearDislikes = (): void => {
    if (confirm('Вы уверены, что хотите очистить дизлайки?')) {
      this.dislikes = [];
      this.saveToLocalStorage();
    } else {
      console.log('Дизлайки не очищены.');
    }
  };

  setZoomLevel = (level: ZoomLevel): void => {
    // Примечание: Это метод без параметров ID, возможно, для глобального зума. Если нужно, добавьте логику.
    console.log('Setting global zoom level:', level);
  };

  setFilterMode = (mode: FilterMode): void => {
    this.filterMode = mode;
    this.currentPage = 1;
  };

  toggleFavorite = (id: string): void => {
    if (this.favorites.includes(id)) {
      this.favorites = this.favorites.filter(favId => favId !== id);
    } else {
      this.favorites = [...this.favorites, id];
      // Удалить из dislikes, если там есть
      if (this.dislikes.includes(id)) {
        this.dislikes = this.dislikes.filter(dislikeId => dislikeId !== id);
      }
    }
    this.saveToLocalStorage();
  };

  toggleDislike = (id: string): void => {
    if (this.dislikes.includes(id)) {
      this.dislikes = this.dislikes.filter(dislikeId => dislikeId !== id);
    } else {
      this.dislikes = [...this.dislikes, id];
      // Удалить из favorites, если там есть
      if (this.favorites.includes(id)) {
        this.favorites = this.favorites.filter(favId => favId !== id);
      }
    }
    this.saveToLocalStorage();
  };

  setCurrentSection = (section: Section): void => {
    this.currentSection = section;
    this.currentPage = 1;
  };

  setSearchTerm = (term: string): void => {
    console.log('Setting searchTerm:', term);
    this.searchTerm = term;
    this.currentPage = 1;
  };

  // Computed свойства с типами
  get filteredImages(): Image[] {
  
    let imagesFiltered: Image[] = images;
    

    if (this.currentSection !== 'all') {
      imagesFiltered = imagesFiltered.filter(image => image.category === this.currentSection);
    }

    if (this.searchTerm) {
      imagesFiltered = imagesFiltered.filter(image =>
        image.alt.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    if (this.filterMode === 'all') {
      imagesFiltered = imagesFiltered.filter(image => !this.dislikes.includes(image.id));
    } else if (this.filterMode === 'favorites') {
      imagesFiltered = imagesFiltered.filter(image => this.favorites.includes(image.id));
    } else if (this.filterMode === 'dislikes') {
      imagesFiltered = imagesFiltered.filter(image => this.dislikes.includes(image.id));
    }

    console.log('filteredImages: After filters, count:', imagesFiltered.length);
    return imagesFiltered;
  }

  get totalPages(): number {
    return Math.ceil(this.filteredImages.length / this.itemsPerPage);
  }

  get currentImages(): Image[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredImages.slice(start, end);
  }

  setCurrentPage = (page: number): void => {
    this.currentPage = page;
  };

  isFavorite = (id: string): boolean => {
    return this.favorites.includes(id);
  };

  isDisliked = (id: string): boolean => {
    return this.dislikes.includes(id);
  };

  getSectionTitle = (): string => {
    switch (this.currentSection) {
      case 'nature': return 'Природа';
      case 'cities': return 'Города';
      case 'animals': return 'Животные';
      case 'tech': return 'Технологии';
      case 'food': return 'Еда';
      default: return 'Все разделы';
    }
  };
}

const galleryStore = new GalleryStore();
export default galleryStore;