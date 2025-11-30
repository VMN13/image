// GalleryStore.js
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
  zoomLevel = 'normal';
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
      saveToLocalStorage: action,
      setZoomLevel: action,
      clearFavorites: action,
      clearDislikes: action,
      
    });

    this.loadFromLocalStorage();
  }

  loadFromLocalStorage = () => {
    try {
      this.favorites = JSON.parse(localStorage.getItem('favorites')) || [];
      this.dislikes = JSON.parse(localStorage.getItem('dislikes')) || [];
    } catch (error) {
      console.error('Error parsing from localStorage:', error);
    }
  };

  saveToLocalStorage = () => {
    localStorage.setItem('favorites', JSON.stringify(this.favorites));
    localStorage.setItem('dislikes', JSON.stringify(this.dislikes));
  };

  clearFavorites = () => {
    this.favorites = [];
    localStorage.setItem('favorites', JSON.stringify(this.favorites));
  };

  clearDislikes = () => {
    this.dislikes = [];
    localStorage.setItem('dislikes', JSON.stringify(this.dislikes));
  };

  // resetFilters = () => {
  //   this.filterMode = 'all';
  //   this.currentSection = 'all';
  //   this.searchTerm = '';
  //   this.currentPage = 1;
  //   };


setZoomLevel = (level) => {
  this.zoomLevel = level;
}


  setFilterMode = (mode) => {
    this.filterMode = mode;
    this.currentPage = 1;
  };

  toggleFavorite = (id) => {
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

  toggleDislike = (id) => {
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

  setCurrentSection = (section) => {
    this.currentSection = section;
    this.currentPage = 1;
  };


  




  setSearchTerm = (term) => {
    console.log('Setting searchTerm:', term);
    this.searchTerm = term;
    this.currentPage = 1;
  };

  get filteredImages() {
    console.log('filteredImages: images from import:', images);
    let imagesFiltered = images;
    console.log('filteredImages: Initial count:', images.length);

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



  get totalPages() {
    return Math.ceil(this.filteredImages.length / this.itemsPerPage);
  }
  // Computed для currentImages (текущие изображения на странице)
  get currentImages() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredImages.slice(start, end);
  }
  setCurrentPage(page) {
    this.currentPage = page;
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