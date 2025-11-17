import React  from "react";
import CountUp from 'react-countup';
import images from '../data/images';

const PhotoCounter = React.memo(() => {
  const totalPhotos = images.length;
  return (
    <div className="counter">
      <h2>
        Общее количество уникальных фотографий: <CountUp end={totalPhotos} duration={2} />

      </h2>
    </div>
  )
})


export default PhotoCounter;
