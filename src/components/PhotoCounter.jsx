import React, { useState } from "react";
import CountUp from 'react-countup';
import images from '../data/images';
import '../styles/global/Confetti.css';

const PhotoCounter = React.memo(() => {
  const totalPhotos = images.length;
  const [isCompleted, setIsCompleted] = useState(false);

  return (
    // 1. Оборачиваем счетчик в контейнер для позиционирования
    <div className="counter-wrapper">
      <div className="counter">
        <h2>
          Количество уникальных фотографий: 
          <CountUp
            end={totalPhotos}
            duration={2}
            onEnd={() => setIsCompleted(true)}
          />
        </h2>
      </div>
      {isCompleted && (
        // 2. Контейнер для звездочек
        <div className="confetti">
          {/* 3. Создаем 30 звездочек со случайными параметрами */}
          {[...Array(30)].map((_, i) => {
            const left = Math.random() * 100; // Случайное положение по горизонтали (0-100%)
            const delay = Math.random() * 0.5; // Случайная задержка (0-0.5 сек)
            const duration = 2 + Math.random() * 2; // Случайная длительность (2-4 сек)
            
            return (
              <div
                key={i} // Используем индекс в качестве ключа
                className="confetti-star"
                // 4. Создаем объект стилей прямо в JSX
                style={{
                  '--left': `${left}%`,
                  '--delay': `${delay}s`,
                  '--duration': `${duration}s`,
                }}
              >
                ★
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
});

export default PhotoCounter;