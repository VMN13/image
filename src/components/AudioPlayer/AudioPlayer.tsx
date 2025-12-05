import React, { useState, useRef, useEffect, FC } from 'react';
import ReactDOM from 'react-dom';
import { useTheme } from '../ThemeContext';
import './AudioPlayer.css';


interface SoundUrls {
  [key: string]: string;
}

interface SoundNames {
  [key: string]: string;
}

// ... (soundUrls и soundNames остаются без изменений)
const soundUrls: SoundUrls = {
  sea: '/sounds/water_ocean_waves_rocks_light_003.mp3', // Океанские волны
  forest: '/sounds/les.mp3', // Лесные звуки
  rain: '/sounds/deti-online.com_-_dozhd.mp3', // Дождь
  calm: 'https://www.soundjay.com/misc/sounds/wind-chimes-1.wav', // Спокойные звуки (ветер в колоколах)
};

const soundNames: SoundNames = {
  sea: 'Море',
  forest: 'Лес',
  rain: 'Дождь',
  calm: 'Спокойная погода',
};


interface FloatingPosition {
  top: number;
  left: number;
}

interface DragStart {
  x: number;
  y: number;
}



const AudioPlayer: FC = () => {
  const { isDarkMode } = useTheme();
  const audioRef = useRef<HTMLAudioElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentSound, setCurrentSound] = useState<string | null>(null);
  const [playbackTime, setPlaybackTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolume] = useState<number>(1); // Новое состояние для громкости (0-1)
  const [showFloatingPlayer, setShowFloatingPlayer] = useState<boolean>(false);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [floatingPosition, setFloatingPosition] = useState<FloatingPosition>({ top: 0, left: 20 }); // Новое состояние для позиции дублирующего плеера
  const [isDragging, setIsDragging] = useState<boolean>(false); // Для отслеживания перетаскивания
  const dragStartRef = useRef<DragStart>({ x: 0, y: 0 }); // Начальная позиция мыши/тача

  // Список звуков для переключения
  const soundKeys: string[] = Object.keys(soundUrls);

  // Форматирование времени в MM:SS
  const formatTime = (time:number): string => {
    if (isNaN(time)) return '00:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Обновление таймера
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setPlaybackTime(audioRef.current?.currentTime || 0);
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
  }, [isPlaying]);

  // Синхронизация громкости с аудио
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const handlePlay = (sound: string): void => {
    if (audioRef.current) {
      const audio = new Audio(soundUrls[sound])
      audio.preload = 'metadata';
      if (currentSound && currentSound !== sound) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      if (currentSound === sound && !isPlaying) {
        audioRef.current.play();
        setIsPlaying(true);
        setShowFloatingPlayer(true);
        return;
      }
      audioRef.current.src = soundUrls[sound];
      audioRef.current.play();
      setCurrentSound(sound);
      setIsPlaying(true);
      setShowFloatingPlayer(true);
      setIsMinimized(false);
    }
  };

  const handlePause = (): void => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleStop = (): void => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      setPlaybackTime(0);
      setShowFloatingPlayer(false);
      setIsMinimized(false);
    }
  };

  const handleLoadedMetadata = (): void => {
    setDuration(audioRef.current?.duration || 0);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const newTime = parseFloat(e.target.value);
    if (audioRef.current) audioRef.current.currentTime = newTime;
    setPlaybackTime(newTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setVolume(parseFloat(e.target.value));
  };

  // Функции для переключения звуков
  const handlePrev = (): void => {
    const currentIndex = soundKeys.indexOf(currentSound || '');
    const prevIndex = (currentIndex - 1 + soundKeys.length) % soundKeys.length;
    handlePlay(soundKeys[prevIndex]);
  };

  const handleNext = (): void => {
    const currentIndex = soundKeys.indexOf(currentSound || '');
    const nextIndex = (currentIndex + 1) % soundKeys.length;
    handlePlay(soundKeys[nextIndex]);
  };

  // Функции для перетаскивания (ПК)
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>): void => {
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX - floatingPosition.left, y: e.clientY - floatingPosition.top };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>): void => {
    if (!isDragging) return;
    const newLeft = e.clientX - dragStartRef.current.x;
    const newTop = e.clientY - dragStartRef.current.y;
    // Ограничение в пределах экрана
    const maxLeft = window.innerWidth - 250; // Ширина плеера
    const maxTop = window.innerHeight - 100; // Высота плеера
    setFloatingPosition({
      left: Math.max(0, Math.min(newLeft, maxLeft)),
      top: Math.max(0, Math.min(newTop, maxTop)),
    });
  };

  const handleMouseUp = (): void => {
    setIsDragging(false);
  };

  // Функции для перетаскивания (сенсорные экраны)
  const handleTouchStart = (e: TouchEvent<HTMLDivElement>): void => {
    setIsDragging(true);
    const touch = e.touches[0];
    dragStartRef.current = { x: touch.clientX - floatingPosition.left, y: touch.clientY - floatingPosition.top };
  };

  const handleTouchMove = (e: TouchEvent): void => {
    if (!isDragging) return;
    const touch = e.touches[0];
    const newLeft = touch.clientX - dragStartRef.current.x;
    const newTop = touch.clientY - dragStartRef.current.y;
    const maxLeft = window.innerWidth - 250;
    const maxTop = window.innerHeight - 100;
    setFloatingPosition({
      left: Math.max(0, Math.min(newLeft, maxLeft)),
      top: Math.max(0, Math.min(newTop, maxTop)),
    });
  };

  const handleTouchEnd = (): void => {
    setIsDragging(false);
  };

  // Добавляем глобальные обработчики для mouse/touch move/up
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleTouchEnd);
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging]);

  const handleCloseFloatingPlayer = (): void => {
    handleStop();
  };

  const toggleMinimize = (): void => {
    setIsMinimized(!isMinimized);
  };

  return (
    <>
      {/* Оригинальный плеер */}
      <div className={`audio-player ${isDarkMode ? 'dark' : 'light'}`}>
        <audio
          ref={audioRef}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={() => {
            setIsPlaying(false);
            setShowFloatingPlayer(false);
          }}
        />
        
        <div className="sound-buttons">
          {Object.keys(soundUrls).map((sound) => (
            <button
              key={sound}
              className={`sound-button ${isDarkMode ? 'dark' : 'light'} ${currentSound === sound ? 'active' : ''}`}
              onClick={() => handlePlay(sound)}
            >
              {soundNames[sound]}
            </button>
          ))}
        </div>

        <div className="controls">
          <button className={`control-button ${isDarkMode ? 'dark' : 'light'}`} onClick={isPlaying ? handlePause : () => handlePlay(currentSound || 'sea')}>
            {isPlaying ? '⏸️' : '▶️'}
          </button>
          <button className={`control-button ${isDarkMode ? 'dark' : 'light'}`} onClick={handleStop}>
            ⏹️
          </button>
        </div>

        <div className={`timer-display ${isDarkMode ? 'dark' : 'light'}`}>
          <span>{formatTime(playbackTime)}</span>
          <input 
            type='range' 
            min='0' 
            max={duration || 0} 
            value={playbackTime} 
            onChange={handleSeek}
            className={`seek-bar ${isDarkMode ? 'dark' : 'light'}`}
            disabled={!duration}
          />
        </div>

        {/* Новый ползунок громкости в основном плеере */}
        <div className={`volume-control ${isDarkMode ? 'dark' : 'light'}`}>
          <label>Громкость:</label>
          <input 
            type='range' 
            min='0' 
            max='1' 
            step='0.1' 
            value={volume} 
            onChange={handleVolumeChange}
            className={`volume-bar ${isDarkMode ? 'dark' : 'light'}`}
          />
        </div>
      </div>

      {/* Дублирующий (floating) плеер */}
      {showFloatingPlayer && ReactDOM.createPortal(
        <div 
          className={`floating-player ${isDarkMode ? 'dark' : 'light'} ${isMinimized ? 'minimized' : ''} ${isDragging ? 'dragging' : ''}`}
          style={{ top: floatingPosition.top, left: floatingPosition.left }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        >
          <button className="close-button" onClick={handleCloseFloatingPlayer}>✕</button>
          <button className="minimize-button" onClick={toggleMinimize}>
            {isMinimized ? '⤢' : '⤡'}
          </button>
          {!isMinimized && (
            <>
              <div className="floating-controls">
                <button className="floating-control-button" onClick={handlePrev}>◀</button> {/* Предыдущий звук */}
                <button className="floating-control-button" onClick={isPlaying ? handlePause : () => handlePlay(currentSound)}>
                  {isPlaying ? '⏸️' : '▶️'}
                </button>
                <button className="floating-control-button" onClick={handleStop}>
                  ⏹️
                </button>
                <button className="floating-control-button" onClick={handleNext}>▶</button> {/* Следующий звук */}
              </div>
              <div className="floating-timer">
                <span>{formatTime(playbackTime)}</span>
                <input 
                  type='range' 
                  min='0' 
                  max={duration || 0} 
                  value={playbackTime} 
                  onChange={handleSeek}
                  className="floating-seek-bar"
                  disabled={!duration}
                />
              </div>
              {/* Новый ползунок громкости в дублирующем плеере */}
              <div className="floating-volume">
                <input 
                  type='range' 
                  min='0' 
                  max='1' 
                  step='0.1' 
                  value={volume} 
                  onChange={handleVolumeChange}
                  className="floating-volume-bar"
                />
              </div>
            </>
          )}
          {isMinimized && (
            <button className="floating-control-button minimized-play" onClick={isPlaying ? handlePause : () => handlePlay(currentSound)}>
              {isPlaying ? '⏸️' : '▶️'}
            </button>
          )}
        </div>,
        document.body
      )}
    </>
  );
};

export default AudioPlayer;