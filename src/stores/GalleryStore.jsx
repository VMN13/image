import { makeObservable, observable, action, computed } from 'mobx';
import images from '../data/images';  // Убедитесь, что путь правильный

class GalleryStore {
  favorites = [];
  dislikes = [];
  filterMode = 'all';
  currentSection = 'all';
  searchTerm = '';
  currentPage = 1;
  itemsPerPage = 9;

  constructor() {
    makeObservable(this, {
      favorites: observable,
      dislikes: observable,
      filterMode: observable,
      currentSection: observable,
      searchTerm: observable,
      currentPage: observable,
      itemsPerPage: observable,
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
    });

    this.loadFromLocalStorage();
  }

  // Все методы — стрелочные функции для сохранения this
  loadFromLocalStorage = () => {
    try {
      this.favorites = JSON.parse(localStorage.getItem('favorites')) || [];
      this.dislikes = JSON.parse(localStorage.getItem('dislikes')) || [];
    } catch (error) {
      console.error('Error parsing from localStorage:', error);
    }
  };

  setFilterMode = (mode) => {
    this.filterMode = mode;
    this.currentPage = 1;
  };

  toggleFavorite = (id) => {
    if (this.favorites.includes(id)) {
      this.favorites = this.favorites.filter(favId => favId !== id);
    } else {
      this.favorites = [...this.favorites, id];
    }
    localStorage.setItem('favorites', JSON.stringify(this.favorites));
  };

  toggleDislike = (id) => {
    if (this.dislikes.includes(id)) {
      this.dislikes = this.dislikes.filter(dislikeId => dislikeId !== id);
    } else {
      this.dislikes = [...this.dislikes, id];
    }
    localStorage.setItem('dislikes', JSON.stringify(this.dislikes));
  };

  setCurrentSection = (section) => {
    this.currentSection = section;
    this.currentPage = 1;
  };

  setSearchTerm = (term) => {
    console.log('Setting searchTerm:', term);  // Для отладки
    this.searchTerm = term;
    this.currentPage = 1;
  };

  setCurrentPage = (page) => {
    this.currentPage = page;
  };

  get filteredImages() {
    let imagesFiltered = images;
    console.log('Initial images count:', images.length);

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

    console.log('After mode filter:', imagesFiltered.length);
    return imagesFiltered;
  }

  get totalPages() {
    return Math.ceil(this.filteredImages.length / this.itemsPerPage);
  }

  get currentImages() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredImages.slice(startIndex, endIndex);
  }

  isFavorite = (id) => {
    return this.favorites.includes(id);
  };

  isDisliked = (id) => {
    return this.dislikes.includes(id);
  };

  getSectionTitle = () => {
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