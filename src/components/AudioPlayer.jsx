import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../components/ThemeContext';
import '../styles/AudioPlayer.css';


// Вам нужно будет заменить эти URL на пути к вашим аудиофайлам
const soundUrls = {
  sea: '/sounds/water_ocean_waves_rocks_light_003.mp3', // Океанские волны
  forest: '/sounds/les.mp3', // Лесные звуки
  rain: '/sounds/deti-online.com_-_dozhd.mp3', // Дождь
  calm: 'https://www.soundjay.com/misc/sounds/wind-chimes-1.wav', // Спокойные звуки (ветер в колоколах)
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
  const [showFloatingPlayer, setShowFloatingPlayer] = useState(false);


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
        setShowFloatingPlayer(true);
        return;
      }

      // Воспроизводим новый звук
      audioRef.current.src = soundUrls[sound];
      audioRef.current.play();
      setCurrentSound(sound);
      setIsPlaying(true);
      setShowFloatingPlayer(true);
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
      setShowFloatingPlayer(false);
    }
  };

  const handleLoadedMetadata = () => {
    setDuration(audioRef.current.duration);
  };


  const handleSeek = (e) => {
    const newTime = e.target.value;
    audioRef.current.currentTime = newTime;
    setPlaybackTime(newTime);
  };
  


const handleCloseFloatingPlayer = () => {
  handleStop();
}


  return (
    <>
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
        <span>{formatTime(playbackTime)}</span>
        <input type='range' min='0' max={duration || 0} value={playbackTime} onChange={handleSeek}
          className={`seek-bar ${isDarkMode ? 'dark' : 'light'} `}
          disabled={!duration}
          />
 
      </div>
    </div>

   
    {showFloatingPlayer && (
      <div className={`floating-player ${isDarkMode ? 'dark' : 'light'}`}>
        <button className='close-button'
          onClick={handleCloseFloatingPlayer}
        >X</button> 
         <div className='floating-controls'>
            <button className='floating-control-button' onClick={isPlaying ? handlePause : () => handlePlay(currentSound)}>
              {isPlaying ? '⏸️' : '▶️'}
            </button>
            <button className='floating-control-button' onClick={handleStop}>
              ⏹️
            </button>
          </div> 
          <span>{formatTime(playbackTime)}
            <input type='range' min='0' max={duration || 0} value={playbackTime} onChange={handleSeek}
              className={`floating-seek-bar ${isDarkMode ? 'dark' : 'light'} `}
              disabled={!duration}
              />
          </span>
      </div>
    )}
    </>
  );
};

export default AudioPlayer;