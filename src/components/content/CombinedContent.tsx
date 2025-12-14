// CombinedContent.tsx
import React, { useState, useEffect, useRef } from "react";
import type { FC } from "react";
import { observer } from "mobx-react-lite";
import galleryStore from "../../stores/GalleryStore";
import { useTheme } from "../ThemeContext";
import ImageModal from "../ImageModal/ImageModal"; 
import AudioPlayer from "../AudioPlayer/AudioPlayer";
import GalleryControls from "../GalleryControls/GalleryControls";
import GalleryGrid from "../GalleryGrid/GalleryGrid";
import "../../styles/Content.css";



// Определяем интерфейс для изображения (предполагаем на основе использования в коде)
interface Image {
  id: string;
  url: string;
  alt: string;
  // Добавьте другие поля, если они есть в вашем store или API
}

// Определяем интерфейс для useTheme (предполагаем на основе использования)
interface ThemeContextType {
  isDarkMode: boolean;
}

// Типы для состояний и функций
interface ShowActionButtons {
  [id: string]: boolean;
}

interface ActionTimeouts {
  [id: string]: NodeJS.Timeout | null;
}

const CombinedContent: FC = observer(() => {
  const [modalImage, setModalImage] = useState<Image | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isSelectFocused, setIsSelectFocused] = useState<boolean>(false);
  const selectContainerRef = useRef<HTMLDivElement | null>(null);
  const [nightMode, setNightMode] = useState<boolean>(false);
  const [showActionButtons, setShowActionButtons] = useState<ShowActionButtons>({});
  const [actionTimeouts, setActionTimeouts] = useState<ActionTimeouts>({});
  const user: boolean = true; // Предполагаем, что это будет заменено на реальный тип из аутентификации
  const { isDarkMode }: ThemeContextType = useTheme();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isSelectFocused && selectContainerRef.current && !selectContainerRef.current.contains(event.target as Node)) {
        setIsSelectFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSelectFocused]);

  const toggleActionButtons = (id: string): void => {
    const isOpen: boolean = showActionButtons[id];
    if (isOpen) {
      setShowActionButtons((prev: ShowActionButtons) => ({ ...prev, [id]: false }));
      if (actionTimeouts[id]) {
        clearTimeout(actionTimeouts[id]!);
        setActionTimeouts((prev: ActionTimeouts) => ({ ...prev, [id]: null }));
      }
    } else {
      setShowActionButtons((prev: ShowActionButtons) => ({ ...prev, [id]: true }));
      const timeoutId: NodeJS.Timeout = setTimeout(() => {
        setShowActionButtons((prev: ShowActionButtons) => ({ ...prev, [id]: false }));
        setActionTimeouts((prev: ActionTimeouts) => ({ ...prev, [id]: null }));
      }, 5000);
      setActionTimeouts((prev: ActionTimeouts) => ({ ...prev, [id]: timeoutId }));
    }
  };

  const handlePageChange = (page: number): void => {
    if (page >= 1 && page <= galleryStore.totalPages) {
      galleryStore.setCurrentPage(page);
      window.scrollTo({ top: 102, behavior: "smooth" });
    }
  };

  const openModal = (image: Image): void => {
    setModalImage(image);
    setIsModalOpen(true);
  };

  const closeModal = (): void => {
    setModalImage(null);
    setIsModalOpen(false);
  };

  if (!user) return <p>Пожалуйста, войдите в систему.</p>;

  const copyImageUrl = async (url: string): Promise<void> => {
    try {
      await navigator.clipboard.writeText(url);
      alert('URL изображения скопирован в буфер обмена!');
    } catch (err) {
      console.error('Ошибка копирования:', err);
      alert('Не удалось скопировать. Попробуйте вручную скопировать URL.');
    }
  };

  const shareImageUrl = async (url: string, alt: string): Promise<void> => {
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Изображение из галереи', text: `Посмотри на изображение "${alt}" в галерее!`, url: url });
      } catch (err) {
        alert('Не удалось поделиться. Попробуйте вручную.');
      }
    } else {
      const subject: string = encodeURIComponent('Изображение из галереи');
      const body: string = encodeURIComponent(`Посмотри это изображение: ${alt}\n\nСсылка: ${url}`);
      window.open(`mailto:?subject=${subject}&body=${body}`);
    }
  };

  return (
    <>
      <div className={`Margin ${isDarkMode ? 'dark' : 'light'}`}>
        <GalleryControls />
        {/* Убрали GlassElement вокруг GalleryGrid, чтобы избежать дублирования контента */}
        <GalleryGrid 
          nightMode={nightMode}
          setNightMode={setNightMode}
          onOpenModal={openModal}
          onPageChange={handlePageChange}
        />
        <AudioPlayer />  
       
      </div>
    </>
  );
});

export default CombinedContent;