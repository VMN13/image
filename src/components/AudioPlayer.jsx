import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../components/ThemeContext';
import '../styles/AudioPlayer.css';


// Вам нужно будет заменить эти URL на пути к вашим аудиофайлам
const soundUrls = {
  sea: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav', // Пример URL
  forest: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav', // Пример URL
  rain: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav', // Пример URL
  calm: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav', // Пример URL
};

const soundNames = {
  sea: 'Море',
  forest: 'Лес',
  rain: 'Дождь',
  calm: 'Спокойная погода',
};

const AudioPlayer = () => {
  const { isDarkMode } = useTheme();
  const audioRef = useRef(null);
  const intervalRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSound, setCurrentSound] = useState(null);
  const [playbackTime, setPlaybackTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Форматирование времени в MM:SS
  const formatTime = (time) => {
    if (isNaN(time)) return '00:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Обновление таймера
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setPlaybackTime(audioRef.current.currentTime);
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isPlaying]);

  const handlePlay = (sound) => {
    if (audioRef.current) {
      // Если играем другой звук, останавливаем его
      if (currentSound && currentSound !== sound) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      
      // Если текущий звук уже на паузе, продолжаем
      if (currentSound === sound && !isPlaying) {
        audioRef.current.play();
        setIsPlaying(true);
        return;
      }

      // Воспроизводим новый звук
      audioRef.current.src = soundUrls[sound];
      audioRef.current.play();
      setCurrentSound(sound);
      setIsPlaying(true);
    }
  };

  const handlePause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      setPlaybackTime(0);
    }
  };

  const handleLoadedMetadata = () => {
    setDuration(audioRef.current.duration);
  };

  return (
    <div className={`audio-player ${isDarkMode ? 'dark' : 'light'}`}>
      <audio
        ref={audioRef}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
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
        {formatTime(playbackTime)} / {formatTime(duration)}
      </div>
    </div>
  );
};

export default AudioPlayer;